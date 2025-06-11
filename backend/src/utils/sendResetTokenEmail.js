// src/utils/sendResetTokenEmail.js
import nodemailer from "nodemailer";

const sendResetTokenEmail = async ({ email, token }) => {
  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use your SMTP provider
    auth: {
      user: process.env.MAIL_USER,      // Your email address
      pass: process.env.MAIL_PASS       // Your email password or app password
    }
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"Chat App Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset</h3>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetTokenEmail;
