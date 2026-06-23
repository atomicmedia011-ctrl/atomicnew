const nodemailer = require('nodemailer');

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Wrapper to send mail with common styling
const sendHtmlMail = async (to, subject, title, bodyHtml) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0a0f; color: #f0f0f5; margin: 0; padding: 24px; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background-color: #111118; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
        .header { background: linear-gradient(135deg, #6366f1, #a78bfa); padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 0.05em; }
        .content { padding: 32px; line-height: 1.6; font-size: 16px; }
        .content h2 { color: #f0f0f5; margin-top: 0; font-size: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 12px; }
        .content p { color: #8b8b9e; margin: 16px 0; }
        .info-box { background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin: 24px 0; }
        .info-item { margin-bottom: 12px; }
        .info-item:last-child { margin-bottom: 0; }
        .info-label { font-weight: 600; color: #f0f0f5; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
        .info-value { color: #6366f1; font-weight: 500; }
        .otp-code { font-size: 32px; font-weight: 800; text-align: center; letter-spacing: 8px; color: #6366f1; margin: 24px 0; background: rgba(99,102,241,0.08); padding: 16px; border-radius: 8px; border: 1px dashed rgba(99,102,241,0.3); }
        .footer { text-align: center; padding: 24px; font-size: 12px; color: #5a5a6e; border-top: 1px solid rgba(255,255,255,0.06); }
        .footer a { color: #6366f1; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚛ ATOMIC MEDIA</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          ${bodyHtml}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ATOMIC MEDIA. All rights reserved.</p>
          <p>If you have any questions, contact us at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  });
};

// Send email to admin
const sendAdminNotification = async (leadData, type = 'lead') => {
  try {
    const subject = type === 'lead' ? `New Lead: ${leadData.name}` : `New Inquiry: ${leadData.clientName}`;
    const title = type === 'lead' ? 'New Contact Lead Received' : 'New Project Inquiry Received';

    const infoHtml = type === 'lead'
      ? `
        <div class="info-box">
          <div class="info-item"><span class="info-label">Name:</span> <span style="color:#f0f0f5">${leadData.name}</span></div>
          <div class="info-item"><span class="info-label">Email:</span> <span style="color:#f0f0f5">${leadData.email}</span></div>
          <div class="info-item"><span class="info-label">Phone:</span> <span style="color:#f0f0f5">${leadData.phone || '—'}</span></div>
          <div class="info-item"><span class="info-label">Service:</span> <span class="info-value">${leadData.service}</span></div>
          <div class="info-item"><span class="info-label">Budget:</span> <span style="color:#fcd34d">${leadData.budget}</span></div>
        </div>
        <p><strong>Message Detail:</strong></p>
        <p style="white-space: pre-line; background: rgba(255,255,255,0.01); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);">${leadData.message}</p>
      `
      : `
        <div class="info-box">
          <div class="info-item"><span class="info-label">Client Name:</span> <span style="color:#f0f0f5">${leadData.clientName}</span></div>
          <div class="info-item"><span class="info-label">Business:</span> <span style="color:#f0f0f5">${leadData.businessName || '—'}</span></div>
          <div class="info-item"><span class="info-label">Email:</span> <span style="color:#f0f0f5">${leadData.email}</span></div>
          <div class="info-item"><span class="info-label">Phone:</span> <span style="color:#f0f0f5">${leadData.phone || '—'}</span></div>
          <div class="info-item"><span class="info-label">Project Type:</span> <span class="info-value">${leadData.websiteType}</span></div>
          <div class="info-item"><span class="info-label">Budget:</span> <span style="color:#fcd34d">${leadData.budget}</span></div>
          <div class="info-item"><span class="info-label">Deadline:</span> <span style="color:#f0f0f5">${leadData.deadline}</span></div>
        </div>
        <p><strong>Project Requirements:</strong></p>
        <p style="white-space: pre-line; background: rgba(255,255,255,0.01); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);">${leadData.requirements}</p>
      `;

    await sendHtmlMail(process.env.ADMIN_EMAIL, subject, title, infoHtml);
    console.log(`✓ Admin notification email sent for ${type}`);
  } catch (error) {
    console.error('Error sending admin notification email:', error.message);
  }
};

// Send confirmation email to client
const sendClientConfirmation = async (email, clientName, type = 'lead') => {
  try {
    const subject = `Inquiry Confirmation - ATOMIC MEDIA`;
    const title = 'Thank you for reaching out!';
    const bodyHtml = `
      <p>Hello ${clientName},</p>
      <p>We've successfully received your ${type === 'lead' ? 'message' : 'project inquiry'} request.</p>
      <p>Our strategic team is reviewing your requirements, and we will get back to you with custom insights within 24-48 business hours.</p>
      <p>In the meantime, feel free to review our latest case studies and blog posts on the website.</p>
      <br>
      <p>Best regards,<br><strong style="color: #6366f1">ATOMIC MEDIA Team</strong></p>
    `;

    await sendHtmlMail(email, subject, title, bodyHtml);
    console.log(`✓ Client confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending client confirmation email:', error.message);
  }
};

// Send OTP email
const sendOtpEmail = async (email, otp) => {
  try {
    const subject = `Your Verification Code - ATOMIC MEDIA`;
    const title = 'Verify Your Email';
    const bodyHtml = `
      <p>Hello,</p>
      <p>Thank you for contacting us. To verify your email address and submit your inquiry, please use the following one-time password (OTP):</p>
      <div class="otp-code">${otp}</div>
      <p>This code is secure and will expire in <strong>5 minutes</strong>. Do not share this code with anyone.</p>
      <p>If you did not request this code, please ignore this email.</p>
    `;

    await sendHtmlMail(email, subject, title, bodyHtml);
    console.log(`✓ OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw new Error('Failed to send verification code. Please check your email.');
  }
};

// Send Booking confirmation to client
const sendBookingConfirmation = async (booking) => {
  try {
    const subject = `Meeting Confirmed - ATOMIC MEDIA`;
    const title = 'Meeting Scheduled Successfully';
    const dateStr = new Date(booking.dateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = new Date(booking.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const bodyHtml = `
      <p>Hello ${booking.clientName},</p>
      <p>Your meeting with the ATOMIC MEDIA team has been scheduled!</p>
      <div class="info-box">
        <div class="info-item"><span class="info-label">Date:</span> <span style="color:#f0f0f5">${dateStr}</span></div>
        <div class="info-item"><span class="info-label">Time:</span> <span class="info-value">${timeStr}</span></div>
        <div class="info-item"><span class="info-label">Mode:</span> <span style="color:#f0f0f5">Video Conference / Phone Call</span></div>
      </div>
      <p>We will send you a calendar invite with the meeting link shortly before the slot. If you need to reschedule, please contact us by replying to this email.</p>
      <br>
      <p>Best regards,<br><strong style="color: #6366f1">ATOMIC MEDIA Team</strong></p>
    `;

    await sendHtmlMail(booking.email, subject, title, bodyHtml);
    console.log(`✓ Booking confirmation sent to ${booking.email}`);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error.message);
  }
};

// Send Booking notification to admin
const sendBookingAdminNotification = async (booking) => {
  try {
    const subject = `New Booking: ${booking.clientName}`;
    const title = 'New Meeting Scheduled';
    const dateStr = new Date(booking.dateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = new Date(booking.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const bodyHtml = `
      <div class="info-box">
        <div class="info-item"><span class="info-label">Client Name:</span> <span style="color:#f0f0f5">${booking.clientName}</span></div>
        <div class="info-item"><span class="info-label">Email:</span> <span style="color:#f0f0f5">${booking.email}</span></div>
        <div class="info-item"><span class="info-label">Phone:</span> <span style="color:#f0f0f5">${booking.phone || '—'}</span></div>
        <div class="info-item"><span class="info-label">Date & Time:</span> <span class="info-value">${dateStr} at ${timeStr}</span></div>
      </div>
      <p><strong>Client Notes:</strong></p>
      <p style="white-space: pre-line; background: rgba(255,255,255,0.01); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);">${booking.notes || 'No notes'}</p>
    `;

    await sendHtmlMail(process.env.ADMIN_EMAIL, subject, title, bodyHtml);
    console.log(`✓ Booking admin notification sent`);
  } catch (error) {
    console.error('Error sending booking admin notification email:', error.message);
  }
};

module.exports = {
  sendAdminNotification,
  sendClientConfirmation,
  sendOtpEmail,
  sendBookingConfirmation,
  sendBookingAdminNotification,
};
