const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter with SMTP configuration
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service configuration error:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

/**
 * Send OTP email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<void>}
 */
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset OTP - GN Division System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password for your GN Division System account.</p>
            <p>Please use the following One-Time Password (OTP) to proceed with your password reset:</p>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; color: #666;">This code will expire in 10 minutes</p>
            </div>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you did not request this password reset, please ignore this email and ensure your account is secure.
            </div>

            <p>For security reasons, do not share this OTP with anyone.</p>
            
            <div class="footer">
              <p>This is an automated message from GN Division System</p>
              <p>© ${new Date().getFullYear()} GN Division. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset OTP - GN Division System

You have requested to reset your password.

Your OTP code is: ${otp}

This code will expire in 10 minutes.

If you did not request this password reset, please ignore this email.

Do not share this OTP with anyone.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = {
  sendOTPEmail,
};
