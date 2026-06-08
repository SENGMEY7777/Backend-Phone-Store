const transporter = require('../../configs/mailler');

const sendVerificationEmail = async (to, token) => {
  const verificationLink = `http://localhost:3000/api/auth/users/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `Phone Store <noreply@myapp.com>`, // Professional "From" header
    to,
    subject: 'Confirm your email address',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          background-color: #4F46E5;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 30px;
        }
        .link-alt {
          word-break: break-all;
          font-size: 11px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to MyApp!</h2>
        </div>
        <p>Hi there,</p>
        <p>Thanks for signing up! Please confirm your email address to activate your account and get started.</p>
        
        <div class="button-container">
          <a href="${verificationLink}" class="button">Verify Email Address</a>
        </div>
        
        <p>This link will <strong>expire in 1 hour</strong>. If you did not create an account, no further action is required.</p>
        
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MyApp Inc. All rights reserved.</p>
          <p class="link-alt">If the button doesn't work, copy and paste this link into your browser:<br>
          ${verificationLink}</p>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

const sendPasswordResetOtp = async (to, otp) => {
  await transporter.sendMail({
    from: `Phone Store <noreply@myapp.com>`,
    to,
    subject: 'Reset your password',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #e1e1e1;
          border-radius: 10px;
        }
        .otp {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          text-align: center;
          margin: 30px 0;
          color: #4F46E5;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reset your password</h2>
        <p>Hi there,</p>
        <p>Use this OTP code to reset your password.</p>
        <div class="otp">${otp}</div>
        <p>This code will <strong>expire in 10 minutes</strong>. If you did not request this, no further action is required.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} MyApp Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetOtp };
