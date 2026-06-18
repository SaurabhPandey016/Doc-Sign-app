import 'dotenv/config';
import express from 'express';
import { handleRegister, handleLogin, handleLogout } from '../controllers/authController.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/logout', handleLogout);

// Configuration for Nodemailer email delivery transporter engine
console.log('Initializing Nodemailer transporter with SMTP config:');
console.log('  Host:', process.env.SMTP_HOST);
console.log('  Port:', process.env.SMTP_PORT);
console.log('  User:', process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 5) + '...' : 'NOT SET');
console.log('  Pass:', process.env.SMTP_PASS ? '***SET***' : 'NOT SET');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '587'), // FIXED: Shift to port 587 (Standard Secure TLS port)
  secure: false, // Must remain false for explicit STARTTLS port upgrades over 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    // Avoids certificate verification drops on guarded developer machines
    rejectUnauthorized: false 
  }
});

// Test transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Transporter verification failed:', error.message);
  } else {
    console.log('✅ SMTP Transporter verified successfully!');
  }
});


// ROUTE 1: Dispatch secure token email link to target user mailbox
router.post('/forgot-password', async (req, res) => {

  console.error("inside the forgot password section");
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email address parameter required." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Security measure: Do not disclose whether an email address exists
      return res.status(200).json({ message: "If an account matches that email, a reset transmission link has been dispatched." });
    }

    // Generate cryptographically random token string
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiration timestamp window

    // Update user record state bounds with safety criteria logs
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: tokenExpiry
      }
    });

    const verificationLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Reset token generated:', resetToken);
    console.log('Verification link:', verificationLink);

    // Dispatch system transmission packet using Nodemailer
    console.log('Attempting to send email to:', user.email);
    console.log('SMTP Config - Host:', process.env.SMTP_HOST, 'Port:', process.env.SMTP_PORT);
    const info = await transporter.sendMail({
      from: '"Signature Vault Support" <noreply@company.com>',
      to: user.email,
      subject: "Immutable Reset Vector - Password Change Request",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e4e7; border-radius: 12px;">
          <h2 style="font-weight: 900; tracking-tight: -0.05em; margin-bottom: 4px;">Reset Account Cryptography</h2>
          <p style="font-size: 13px; color: #71717a;">A request has been compiled to replace the entry keys for your Signature Hub vault.</p>
          <div style="margin: 24px 0;">
            <a href="${verificationLink}" style="background: black; color: white; text-decoration: none; padding: 12px 20px; font-size: 12px; font-weight: bold; border-radius: 8px;">Update Credentials Vector</a>
          </div>
          <p style="font-size: 11px; color: #a1a1aa;">This verification mapping expires in exactly one hour. If you did not trigger this sequence, ignore this transmission securely.</p>
        </div>
      `
    });
    console.log('✅ Password reset email sent successfully!');
    console.log('Email response:', info.response);

    res.status(200).json({ message: "If an account matches that email, a reset transmission link has been dispatched." });
  } catch (error) {
     //Prints the raw network error trace directly into your server shell log for visibility
    console.error("❌ CRITICAL MAIL DELIVERY EXCEPTION:", error.message);
    console.error("Full error details:", error);
    res.status(500).json({ 
      error: error.message,
      details: error.message 
    });
  }
});

// ROUTE 2: Verify token signature bounds and overwrite password hashing entries
router.post('/reset-password/:token', async (req, res) => {

  console.error("inside the reset password section");
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must contain a minimum criteria profile of 6 characters." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gte: new Date() } // Enforce that expiration timeline bounds check passes
      }
    });

    if (!user) {
      return res.status(400).json({ error: "Reset vector path link invalid or has expired." });
    }

    // Encrypt password entries using industrial bcryptjs work factors
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Write structural database adjustments and wipe authorization token column space cleanly
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.status(200).json({ success: true, message: "Credential vault profile keys successfully overwritten." });
  } catch (error) {
    res.status(500).json({ error: "Database execution failed while applying configuration updates." });
  }
});

export default router;