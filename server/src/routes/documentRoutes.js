import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { supabaseClient } from '../config/supabase.js';
import prisma from '../config/db.js';
import { PDFDocument } from 'pdf-lib';

const router = express.Router();

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

    const pdfResponse = await fetch(document.fileUrl);
    if (!pdfResponse.ok) {
      throw new Error('Unable to download the PDF for signing.');
    }

    const pdfBytes = Buffer.from(await pdfResponse.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(0);

    const imageBytes = Buffer.from(signatureData.split(',')[1], 'base64');
    const signatureImage = await pdfDoc.embedPng(imageBytes);

    const canvasWidth = Number(coordinates?.canvas_width || 150);
    const canvasHeight = Number(coordinates?.canvas_height || 60);
    const x = Number(coordinates?.x_position || 0);
    const y = Number(coordinates?.y_position || 0);

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const scaleX = (pageWidth / canvasWidth) * 0.95;
    const scaleY = (pageHeight / canvasHeight) * 0.95;
    const width = signatureImage.width * scaleX;
    const height = signatureImage.height * scaleY;
    const drawX = Math.max(0, x * (pageWidth / canvasWidth));
    const drawY = Math.max(0, pageHeight - y * (pageHeight / canvasHeight) - height);

    page.drawImage(signatureImage, {
      x: drawX,
      y: drawY,
      width,
      height,
    });

    const signedPdfBytes = await pdfDoc.save();
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