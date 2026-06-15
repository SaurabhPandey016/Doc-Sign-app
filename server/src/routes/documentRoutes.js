import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { supabaseClient } from '../config/supabase.js';
import prisma from '../config/db.js';
import { PDFDocument } from 'pdf-lib';

const router = express.Router();
const SHARE_SECRET = process.env.SHARE_SECRET || 'dev-signature-share-secret';
const FRONTEND_URL = (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');

const createShareToken = (documentId) => {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = `${documentId}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', SHARE_SECRET).update(payload).digest('hex');
  const token = `${signature}.${documentId}.${expiresAt}`;
  return { token, expiresAt, shareUrl: `${FRONTEND_URL}/sign/${token}` };
};

const verifyShareToken = (token) => {
  const [signature, documentId, expiresAt] = token.split('.');
  if (!signature || !documentId || !expiresAt) return null;
  const payload = `${documentId}:${expiresAt}`;
  const expected = crypto.createHmac('sha256', SHARE_SECRET).update(payload).digest('hex');
  if (expected !== signature || Number(expiresAt) < Date.now()) return null;
  return { documentId, expiresAt: Number(expiresAt) };
};

const logAudit = async (documentId, userId, action, ipAddress) => {
  try {
    await prisma.auditLog.create({
      data: { documentId, userId, action, ipAddress: ipAddress || '127.0.0.1' }
    });
  } catch (error) {
    console.error('Audit log failure:', error);
  }
};

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT || 2525),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
});

const applySignatureToPdf = async ({ documentUrl, signatureData, coordinates }) => {
  const pdfResponse = await fetch(documentUrl);
  if (!pdfResponse.ok) {
    throw new Error('Unable to download the PDF for signing.');
  }

  const pdfBytes = Buffer.from(await pdfResponse.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPage(0);
  const imageBytes = Buffer.from(signatureData.split(',')[1], 'base64');
  const signatureImage = await pdfDoc.embedPng(imageBytes);

  const previewWidth = Number(coordinates?.preview_width || coordinates?.canvas_width || 0);
  const previewHeight = Number(coordinates?.preview_height || coordinates?.canvas_height || 0);
  const overlayWidth = Number(coordinates?.overlay_width || coordinates?.canvas_width || 150);
  const overlayHeight = Number(coordinates?.overlay_height || coordinates?.canvas_height || 60);
  const x = Number(coordinates?.x_position || 0);
  const y = Number(coordinates?.y_position || 0);

  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const scaleX = previewWidth > 0 ? pageWidth / previewWidth : 1;
  const scaleY = previewHeight > 0 ? pageHeight / previewHeight : 1;

  const width = Math.min(overlayWidth * scaleX, pageWidth * 0.45);
  const height = Math.min(overlayHeight * scaleY, pageHeight * 0.18);
  const drawX = Math.max(0, x * scaleX);
  const drawY = Math.max(0, pageHeight - (y + overlayHeight) * scaleY);

  page.drawImage(signatureImage, { x: drawX, y: drawY, width, height });
  return await pdfDoc.save();
};

router.post('/upload', authenticateToken, (req, res) => {
  // Process incoming file stream
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file detected inside upload transmission packet." });
    }

    try {
      // 1. Generate an entirely unique randomized filename to protect against name overlap overwrites
      const fileExtension = req.file.originalname.split('.').pop();
      const uniqueFileName = `${req.user.id}-${Date.now()}.${fileExtension}`;

      // 2. Upload file stream cleanly directly to Supabase cloud storage bucket
      const { data, error: uploadError } = await supabaseClient.storage
        .from('documents')
        .upload(uniqueFileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Supabase Storage cloud failure: ${uploadError.message}`);
      }

      // 3. Construct the public downloadable URL address pointing to our cloud file location
      const { data: publicUrlData } = supabaseClient.storage
        .from('documents')
        .getPublicUrl(uniqueFileName);

      const documentPublicUrl = publicUrlData.publicUrl;

      // 4. Create an immutable status tracking row record inside our Prisma database
      const newDocumentRecord = await prisma.document.create({
        data: {
          title: req.file.originalname,
          fileUrl: documentPublicUrl,
          status: 'PENDING',
          ownerId: req.user.id
        }
      });

      // Return unified resource schema data back to the user interface
      res.status(201).json({
        message: "Document successfully saved to cloud storage and registered in database!",
        document: newDocumentRecord
      });

    } catch (dbOrCloudError) {
      res.status(500).json({ error: dbOrCloudError.message });
    }
  });
});

// Fetch all documents associated with the authenticated logged-in user context
router.get('/my-dashboard', authenticateToken, async (req, res) => {
  try {
    const userDocuments = await prisma.document.findMany({
      where: {
        ownerId: req.user.id
      },
      orderBy: {
        createdAt: 'desc' // Ensures newly uploaded documents float cleanly to the top
      },
      include: {
        signatures: true // Pulls nested relation data to dynamically calculate signature status states
      }
    });

    res.status(200).json({
      success: true,
      count: userDocuments.length,
      documents: userDocuments
    });
  } catch (dbQueryError) {
    res.status(500).json({ error: "Failed to compile your secure dashboard ledger collection." });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, ownerId: req.user.id }
    });

    if (!document) {
      return res.status(404).json({ error: 'Requested document asset not found.' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.signature.deleteMany({ where: { documentId: document.id } });
      await tx.auditLog.deleteMany({ where: { documentId: document.id } });
      await tx.document.delete({ where: { id: document.id } });
    });

    try {
      const url = new URL(document.fileUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const storageIndex = pathParts.indexOf('documents');
      const storagePath = storageIndex >= 0 ? pathParts.slice(storageIndex + 1).join('/') : null;

      if (storagePath) {
        const { error: removeError } = await supabaseClient.storage
          .from('documents')
          .remove([decodeURIComponent(storagePath)]);

        if (removeError) {
          console.error('Warning: storage cleanup failed during deletion:', removeError.message);
        }
      }
    } catch (storageError) {
      console.error('Warning: storage cleanup skipped during deletion:', storageError);
    }

    res.status(200).json({ success: true, message: 'Document removed from your workspace.' });
  } catch (dbError) {
    console.error('Delete document failure:', dbError);
    res.status(500).json({ error: 'Failed to remove document from your workspace.' });
  }
});

// Fetch details for a specific single document inside the workspace layout
router.get('/public/:token', async (req, res) => {
  try {
    const verified = verifyShareToken(req.params.token);
    if (!verified) return res.status(401).json({ error: 'This signature link has expired or is invalid.' });

    const document = await prisma.document.findUnique({ where: { id: verified.documentId } });
    if (!document) return res.status(404).json({ error: 'Requested document asset not found.' });

    res.status(200).json({ success: true, document, shareExpiresAt: verified.expiresAt });
  } catch (error) {
    res.status(500).json({ error: 'Unable to open the signature link.' });
  }
});

router.post('/public/:token/sign', async (req, res) => {
  try {
    const verified = verifyShareToken(req.params.token);
    if (!verified) return res.status(401).json({ error: 'This signature link has expired or is invalid.' });

    const { signatureData, coordinates, signerEmail = 'signer@unknown.local' } = req.body;
    if (!signatureData) return res.status(400).json({ error: 'A signature image is required.' });

    const document = await prisma.document.findUnique({ where: { id: verified.documentId } });
    if (!document) return res.status(404).json({ error: 'Requested document asset not found.' });

    const signedPdfBytes = await applySignatureToPdf({
      documentUrl: document.fileUrl,
      signatureData,
      coordinates
    });

    const signedFileName = `public-${document.id}-${Date.now()}-signed.pdf`;
    const { error: uploadError } = await supabaseClient.storage
      .from('documents')
      .upload(signedFileName, signedPdfBytes, { contentType: 'application/pdf', upsert: false });

    if (uploadError) throw new Error(`Unable to store the signed PDF: ${uploadError.message}`);

    const { data: publicUrlData } = supabaseClient.storage.from('documents').getPublicUrl(signedFileName);

    await prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: { id: document.id },
        data: { fileUrl: publicUrlData.publicUrl, status: 'SIGNED', rejectReason: null }
      });

      await tx.signature.create({
        data: {
          documentId: document.id,
          signerEmail,
          signerId: null,
          signatureData,
          isSigned: true,
          signedAt: new Date(),
          x: coordinates ? Number(coordinates.x_position || 0) : 0,
          y: coordinates ? Number(coordinates.y_position || 0) : 0,
          pageNumber: 1
        }
      });
    });

    await logAudit(document.id, document.ownerId, `External signer completed signature for ${signerEmail}`, req.ip || '127.0.0.1');

    res.status(200).json({ success: true, message: 'Document signed successfully.', shareExpiresAt: verified.expiresAt });
  } catch (error) {
    console.error('External signature failure:', error);
    res.status(500).json({ error: 'Unable to complete the external signing request.' });
  }
});

router.post('/public/:token/decision', async (req, res) => {
  try {
    const verified = verifyShareToken(req.params.token);
    if (!verified) return res.status(401).json({ error: 'This signature link has expired or is invalid.' });

    const { action, reason = '' } = req.body;
    if (!['SIGNED', 'REJECTED'].includes(action)) return res.status(400).json({ error: 'Action must be SIGNED or REJECTED.' });

    const document = await prisma.document.findUnique({ where: { id: verified.documentId } });
    if (!document) return res.status(404).json({ error: 'Requested document asset not found.' });

    await prisma.document.update({
      where: { id: document.id },
      data: {
        status: action,
        rejectReason: action === 'REJECTED' ? reason || 'Signer rejected the document.' : null
      }
    });

    await logAudit(document.id, document.ownerId, `External signer marked document as ${action}${action === 'REJECTED' ? `: ${reason}` : ''}`, req.ip || '127.0.0.1');

    res.status(200).json({ success: true, status: action, message: action === 'SIGNED' ? 'Document accepted for signing.' : 'Document rejected successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to update the signature decision.' });
  }
});

router.post('/:id/share', authenticateToken, async (req, res) => {
  try {
    const document = await prisma.document.findFirst({ where: { id: req.params.id, ownerId: req.user.id } });
    if (!document) return res.status(404).json({ error: 'Requested document asset not found.' });

    const share = createShareToken(document.id);
    const signerEmail = req.body.email || req.user.email;

    const transporter = createTransporter();
    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"DocuSign.io" <noreply@docusign.io>',
      to: signerEmail,
      subject: 'Your secure signing invitation is ready',
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#0f172a;color:#e5eefb;padding:24px;border-radius:18px;">
          <h2 style="margin:0 0 8px;font-size:24px;line-height:1.2;color:#fff;">Secure signature request</h2>
          <p style="margin:0 0 14px;color:#cbd5e1;font-size:14px;">You have been invited to review and sign a document securely. This invitation expires in 7 days from the time it was sent.</p>
          <div style="background:#111827;border:1px solid #1f2937;border-radius:16px;padding:18px;">
            <p style="margin:0 0 8px;color:#bfdbfe;font-size:13px;text-transform:uppercase;letter-spacing:1.4px;">Open your secure link</p>
            <a href="${share.shareUrl}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#8b5cf6);color:#fff;text-decoration:none;padding:12px 16px;border-radius:12px;font-weight:700;font-size:14px;">Review & sign document</a>
            <p style="margin-top:12px;color:#cbd5e1;font-size:12px;word-break:break-all;">${share.shareUrl}</p>
          </div>
          <p style="margin-top:14px;color:#94a3b8;font-size:12px;">If this request was not expected, you can safely ignore this email.</p>
        </div>`
    });

    res.status(200).json({
      success: true,
      shareUrl: share.shareUrl,
      expiresAt: share.expiresAt,
      emailSent: true,
      deliveryResponse: info.response || 'Queued through Mailtrap SMTP.'
    });
  } catch (error) {
    console.error('Email delivery failed:', error);
    res.status(500).json({ error: 'Unable to generate the secure signing link. SMTP delivery failed.' });
  }
});

router.get('/:id/audit', authenticateToken, async (req, res) => {
  try {
    const document = await prisma.document.findFirst({ where: { id: req.params.id, ownerId: req.user.id } });
    if (!document) return res.status(404).json({ error: 'Requested document asset not found.' });

    const auditEntries = await prisma.auditLog.findMany({
      where: { documentId: document.id },
      orderBy: { createdAt: 'desc' }
    });

    const signatures = await prisma.signature.findMany({
      where: { documentId: document.id },
      orderBy: { signedAt: 'desc' }
    });

    res.status(200).json({ success: true, document, auditEntries, signatures });
  } catch (error) {
    res.status(500).json({ error: 'Unable to load audit history.' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user.id
      }
    });

    if (!document) {
      return res.status(404).json({ error: "Requested document asset not found." });
    }

    res.status(200).json({ success: true, document });
  } catch (dbError) {
    res.status(500).json({ error: "Failed to pull document data from database." });
  }
});

// Post and commit signature placement data back into the database
// Post and commit signature placement data back into the database
// Post and commit signature placement data back into the database
router.post('/:id/sign', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { signatureData, coordinates } = req.body;

  try {
    const document = await prisma.document.findFirst({
      where: { id, ownerId: req.user.id }
    });
    if (!document) {
      return res.status(404).json({ error: "Requested document asset not found." });
    }

    const signedPdfBytes = await applySignatureToPdf({ documentUrl: document.fileUrl, signatureData, coordinates });
    const signedFileName = `${req.user.id}-${Date.now()}-signed.pdf`;
    const { error: uploadError } = await supabaseClient.storage
      .from('documents')
      .upload(signedFileName, signedPdfBytes, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Unable to store the signed PDF: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from('documents')
      .getPublicUrl(signedFileName);

    await prisma.document.update({
      where: { id },
      data: { fileUrl: publicUrlData.publicUrl, status: 'SIGNED' }
    });

    await logAudit(id, req.user.id, `Document signed by ${req.user.email}`, req.ip || '127.0.0.1');

    const signature = await prisma.signature.create({
      data: {
        documentId: id,
        signerEmail: req.user.email, // FIX: Injects the mandatory string field required by your schema
        signerId: req.user.id,       // Optional relation back to the User record table
        signatureData: signatureData,
        isSigned: true,              // Toggles signature activation flag state
        signedAt: new Date(),        // Timestamps execution event log
        
        // Dynamic coordinates conversion mapping
        x: coordinates ? parseFloat(coordinates.x_position) : 0.0,
        y: coordinates ? parseFloat(coordinates.y_position) : 0.0,
        pageNumber: 1                // Default fallback layer initialization parameter
      }
    });

    // Create a clean entry inside your AuditLog table to record the signature transaction history
    await prisma.auditLog.create({
      data: {
        documentId: id,
        userId: req.user.id,
        action: `Document signed by user ${req.user.name} (${req.user.email}) via interactive workspace canvas portal.`,
        ipAddress: req.ip || '127.0.0.1'
      }
    });

    res.status(200).json({ 
      success: true, 
      message: "Document contract transaction executed successfully!", 
      signature 
    });

  } catch (dbError) {
    console.error("Core database crash exception trace log:", dbError);
    res.status(500).json({ 
      error: "Database execution failed while creating your digital signature link.",
      details: dbError.message 
    });
  }
});


export default router;