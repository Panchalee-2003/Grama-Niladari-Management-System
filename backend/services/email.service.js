const nodemailer = require('nodemailer');
require('dotenv').config();

// Email service has been temporarily disabled. Mocking the transporter to prevent authentication errors.
const transporter = {
  verify: (cb) => {
    console.log('Email service is mocked and ready');
    cb(null, true);
  },
  sendMail: async (mailOptions) => {
    console.log('Mock email sent to:', mailOptions.to, '| Subject:', mailOptions.subject);
    return { messageId: 'mock-email-id-' + Date.now() };
  }
};

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

/**
 * Send physical visit notification to citizen
 */
const sendVisitNotification = async (email, name, appointmentDate, documents) => {
  const formattedDate = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    : 'To be confirmed';

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Certificate Request – Physical Visit Required | GN Division',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f6a623 0%, #e07000 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: #fff8ec; border-left: 4px solid #f6a623; padding: 16px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>📅 Visit Appointment Scheduled</h1></div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your certificate request requires a physical visit to the Grama Niladhari office. Please note the following details:</p>
            <div class="info-box">
              <p><strong>Appointment Date:</strong> ${formattedDate}</p>
              <p><strong>Required Documents:</strong><br/>${documents || 'Please bring all relevant original documents and photocopies.'}</p>
            </div>
            <p>Please arrive on time and bring all the listed documents. Failure to present required documents may result in delays.</p>
            <div class="footer">
              <p>Grama Niladhari Division – Maspanna | Ministry of Home Affairs</p>
              <p>© ${new Date().getFullYear()} GN Division. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${name},\n\nYour certificate request requires a physical visit.\n\nAppointment Date: ${formattedDate}\nRequired Documents: ${documents || 'All relevant original documents and photocopies.'}\n\nGrama Niladhari Division – Maspanna`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Visit notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending visit notification:', error);
    throw new Error('Failed to send visit notification email');
  }
};

/**
 * Send rejection notification to citizen
 */
const sendRejectionNotification = async (email, name, certType, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Certificate Request Update – Rejected | GN Division',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reason-box { background: #fdf2f2; border-left: 4px solid #e74c3c; padding: 16px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Certificate Request Rejected</h1></div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Unfortunately, your request for a <strong>${certType}</strong> has been reviewed and could not be approved at this time.</p>
            <div class="reason-box">
              <strong>Reason for Rejection:</strong>
              <p>${reason || 'Please contact the GN office for further details.'}</p>
            </div>
            <p>You may re-apply after addressing the reason mentioned above, or visit the Grama Niladhari office for assistance.</p>
            <div class="footer">
              <p>Grama Niladhari Division – Maspanna | Ministry of Home Affairs</p>
              <p>© ${new Date().getFullYear()} GN Division. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${name},\n\nYour request for ${certType} has been rejected.\n\nReason: ${reason || 'Please contact the GN office.'}\n\nGrama Niladhari Division – Maspanna`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Rejection notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending rejection notification:', error);
    throw new Error('Failed to send rejection notification email');
  }
};

/**
 * Send approval / ready-for-download notification to citizen
 */
const sendApprovalNotification = async (email, name, certType) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Certificate Ready for Download | GN Division',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #27ae60 0%, #1a7a3f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-box { background: #eafaf1; border-left: 4px solid #27ae60; padding: 16px; margin: 20px 0; border-radius: 4px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>✅ Certificate Approved!</h1></div>
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            <div class="success-box">
              <p>Your <strong>${certType}</strong> has been approved and is now ready for download.</p>
            </div>
            <p>Please log in to your citizen portal and go to <strong>My Certificate Requests</strong> to download your certificate.</p>
            <div class="footer">
              <p>Grama Niladhari Division – Maspanna | Ministry of Home Affairs</p>
              <p>© ${new Date().getFullYear()} GN Division. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Dear ${name},\n\nYour ${certType} has been approved. Please log in to download your certificate.\n\nGrama Niladhari Division – Maspanna`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Approval notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending approval notification:', error);
    throw new Error('Failed to send approval notification email');
  }
};

module.exports = {
  sendOTPEmail,
  sendVisitNotification,
  sendRejectionNotification,
  sendApprovalNotification,
};

