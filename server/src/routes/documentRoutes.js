import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { supabaseClient } from '../config/supabase.js';
import prisma from '../config/db.js';

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


export default router;