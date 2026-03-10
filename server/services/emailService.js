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

async function sendPasswordResetEmail(email, resetLink) {
  await transporter.sendMail({
    from: `"OpenChat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your OpenChat password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Click the button below to reset your OpenChat password:</p>
        <a href="${resetLink}" style="display:inline-block; padding: 12px 24px; background: #C8F135; color: #080810; border-radius: 8px; font-weight: 700; text-decoration: none;">
          Reset Password
        </a>
        <p style="margin-top: 16px; color: #666; font-size: 13px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };