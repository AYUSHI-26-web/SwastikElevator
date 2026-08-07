const express = require('express');
const { getEmailQueueStats } = require('../services/emailQueueService');
const {
  sendMailOptions,
  getMailConfig,
  classifyEmailError,
} = require('../services/emailService');

const router = express.Router();

router.get('/email-queue/stats', async (req, res) => {
  try {
    const stats = await getEmailQueueStats();
    return res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch email queue stats:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch email queue stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.post('/email/test', async (req, res) => {
  try {
    const { emailUser } = getMailConfig();
    const requestedTo = typeof req.body?.to === 'string' ? req.body.to.trim() : '';
    const to = requestedTo || emailUser;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required. Provide body.to or set EMAIL_USER in backend/.env.',
      });
    }

    const subject = `SMTP Test Email - ${new Date().toISOString()}`;
    const text = [
      'This is a test email from Swastik backend ops route.',
      'If you received this, SMTP auth and send flow are working.',
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>SMTP Test Email</h2>
        <p>This is a test email from Swastik backend ops route.</p>
        <p>If you received this, SMTP auth and send flow are working.</p>
      </div>
    `;

    await sendMailOptions({
      from: `"Swastik Elevator" <${emailUser}>`,
      to,
      subject,
      text,
      html,
    });

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully.',
      data: {
        to,
        subject,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const emailErrorCode = classifyEmailError(error);
    const status = emailErrorCode === 'MAIL_CONFIG_MISSING' ? 500 : 502;

    return res.status(status).json({
      success: false,
      message: 'Test email failed.',
      data: {
        emailErrorCode,
      },
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
