const https = require('https');
const querystring = require('querystring');

/**
 * Send a WhatsApp notification to admin using Twilio.
 * This helper fails gracefully if WhatsApp is not configured in settings.
 */
const sendWhatsAppNotification = async (message, settings = null) => {
  try {
    const enableWhatsApp = settings?.whatsapp?.enabled ?? (process.env.WHATSAPP_ENABLED === 'true');
    if (!enableWhatsApp) {
      console.log('ℹ WhatsApp notification skipped (disabled in configuration)');
      return;
    }

    const accountSid = settings?.whatsapp?.accountSid || process.env.TWILIO_ACCOUNT_SID;
    const authToken = settings?.whatsapp?.authToken || process.env.TWILIO_AUTH_TOKEN;
    const fromNum = settings?.whatsapp?.fromNumber || process.env.TWILIO_WHATSAPP_FROM || '+14155238886';
    const toNum = settings?.whatsapp?.adminNumber || process.env.ADMIN_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !toNum) {
      console.warn('⚠️ WhatsApp credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, ADMIN_WHATSAPP_NUMBER) are missing in environment/settings');
      return;
    }

    const fromFormatted = fromNum.startsWith('whatsapp:') ? fromNum : `whatsapp:${fromNum}`;
    const toFormatted = toNum.startsWith('whatsapp:') ? toNum : `whatsapp:${toNum}`;

    const postData = querystring.stringify({
      From: fromFormatted,
      To: toFormatted,
      Body: message,
    });

    const options = {
      hostname: 'api.twilio.com',
      port: 443,
      path: `/2010-04-01/Accounts/${accountSid}/Messages.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✓ WhatsApp alert sent successfully! SID: ${parsed.sid}`);
          } else {
            console.error(`✗ Twilio WhatsApp API Error (Status ${res.statusCode}): ${parsed.message || body}`);
          }
        } catch (e) {
          console.error(`✗ Failed to parse Twilio response: ${body}`);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`✗ HTTPS request error sending WhatsApp notification: ${e.message}`);
    });

    req.write(postData);
    req.end();
  } catch (error) {
    console.error(`✗ Error executing sendWhatsAppNotification: ${error.message}`);
  }
};

module.exports = {
  sendWhatsAppNotification,
};
