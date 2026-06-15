import express from 'express';
import cors from 'cors';
import prisma from './config/db.js'; // The .js extension is mandatory in ES Modules
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';

import documentRoutes from './routes/documentRoutes.js'; // Import our new routers

dotenv.config();
const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Add this line to parse form fields safely
app.use(express.json());

// Main App API Routes Layout Linkages
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes); // Mount file system router mappings


// Base Server Validation Route checking DB connectivity
app.get('/api/health-check', async (req, res) => {
  try {
    // Attempt a count query on the User table to verify end-to-end integration
    const userCount = await prisma.user.count();
    res.status(200).json({
      status: "Healthy",
      message: "Express core server operating successfully inside production src/ layout!",
      databaseStatus: "Connected",
      currentUsersInDB: userCount
    });
  } catch (error) {
    res.status(500).json({
      status: "Degraded",
      message: "Express booted, but could not connect to Supabase.",
      databaseError: error.message
    });
  }
});

// Protected Verification Endpoint - Verifies auth token validation rules cleanly
app.get('/api/auth/verify-session', authenticateToken, (req, res) => {

  try {
    res.status(200).json({
      authenticated: true,
      message: "Your JWT transmission packet was securely decoded and verified!",
      sessionUser: req.user
    });
  } catch (error) {
    res.status(500).json({
      authenticated: false,
      message: "An error occurred while verifying the session.",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing cleanly on port http://localhost:${PORT}`);
});