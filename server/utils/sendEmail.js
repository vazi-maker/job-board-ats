const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use Gmail App Password, not account password
  },
});

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 */
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Job Board ATS" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    // Log error but don't crash the application
    console.error(`❌ Email failed to send: ${error.message}`);
  }
};

/**
 * Generate HTML template for status update emails
 */
const statusUpdateEmailHtml = (applicantName, jobTitle, company, status) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
    <h2 style="color: #1d4ed8;">Job Board ATS</h2>
    <p>Hello <strong>${applicantName}</strong>,</p>
    <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been updated.</p>
    <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 0; font-size: 16px;">New Status: <strong style="color: #1d4ed8;">${status}</strong></p>
    </div>
    <p>Log in to your dashboard to view more details.</p>
    <p style="color: #6b7280; font-size: 12px;">This is an automated message. Please do not reply.</p>
  </div>
`;

module.exports = { sendEmail, statusUpdateEmailHtml };
