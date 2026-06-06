import express from 'express';
import cors from 'cors';
import prisma from './config/db.js'; // The .js extension is mandatory in ES Modules
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Bind Feature API Module Routers
app.use('/api/auth', authRoutes);


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
  res.status(200).json({
    authenticated: true,
    message: "Your JWT transmission packet was securely decoded and verified!",
    sessionUser: req.user
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing cleanly on port http://localhost:${PORT}`);
});