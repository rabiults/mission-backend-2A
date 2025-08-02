import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT), 
  secure: process.env.EMAIL_SECURE === 'true', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendVerificationEmail(toEmail, token) {
  const link = `http://localhost:3001/api/auth/verifikasi-email?token=${token}`;
  const mailOptions = {
    from: `"EduCourse" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verifikasi Akun EduCourse',
    html: `<p>Klik link berikut untuk verifikasi akun kamu:</p><a href="${link}">${link}</a>`
  };

  return transporter.sendMail(mailOptions);
}
