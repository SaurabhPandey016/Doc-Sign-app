import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false }
});

try {
  await transporter.verify();
  console.log('VERIFY_OK');
  const info = await transporter.sendMail({
    from: 'DocuSign.io <noreply@docusign.io>',
    to: 'wesaysaurabh@gmail.com',
    subject: 'Mailtrap test from app',
    html: '<p>Hello from app</p>'
  });
  console.log('SENT_OK', info.response);
} catch (e) {
  console.error('ERR', e.message);
  process.exitCode = 1;
}
