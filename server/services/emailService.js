const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendVerificationEmail = async (toEmail, verificationLink, name) => {
  await transporter.sendMail({
    from: `"OpenChat" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify your OpenChat account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #4F46E5;">Welcome to OpenChat, ${name}! 👋</h2>
        <p>Thanks for signing up. Please verify your email to get started.</p>
        <a href="${verificationLink}" 
           style="display: inline-block; background: #4F46E5; color: white; 
                  padding: 12px 24px; border-radius: 6px; text-decoration: none;
                  font-weight: bold; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #6B7280; font-size: 14px;">
          If you didn't create this account, ignore this email.
        </p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail };