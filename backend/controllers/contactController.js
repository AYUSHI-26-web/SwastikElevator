const Contact = require('../models/Contact');
const { getConnectionStatus } = require('../config/db');
const {
  buildAdminMailOptions,
  buildWelcomeMailOptions,
  sendMailOptions,
} = require('../services/emailService');
const { enqueueEmailJob } = require('../services/emailQueueService');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requiredFields = [
  'salutation',
  'name',
  'email',
  'phone',
  'street',
  'number',
  'city',
  'state',
  'subject',
  'message',
];

const normalizeContactData = (body) => ({
  salutation: body.salutation.trim(),
  name: body.name.trim(),
  company: body.company ? body.company.trim() : '',
  email: body.email.trim(),
  phone: body.phone.trim(),
  street: body.street.trim(),
  number: body.number.trim(),
  buildingName: body.buildingName ? body.buildingName.trim() : '',
  city: body.city.trim(),
  state: body.state.trim(),
  message: body.message.trim(),
  subject: body.subject ? body.subject.trim() : '',
});

const saveContactWithRetry = async (contactData, retries = 2) => {
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const contact = new Contact(contactData);
      return await contact.save();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(400);
      }
    }
  }

  throw lastError;
};

const enqueueFailedEmail = async ({ sourceId, jobType, mailOptions }) => {
  await enqueueEmailJob({
    sourceId,
    sourceType: 'contact',
    jobType,
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  });
};

exports.createContact = async (req, res) => {
  try {
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    if (!getConnectionStatus()) {
      return res.status(503).json({
        success: false,
        message: 'Database is unavailable. Please try again.',
      });
    }

    const contactData = normalizeContactData(req.body);

    let savedContact = null;
    try {
      savedContact = await saveContactWithRetry(contactData, 2);
    } catch (error) {
      console.error('Contact save failed:', error.message);
      return res.status(503).json({
        success: false,
        message: 'Failed to save contact submission. Please try again.',
      });
    }

    const adminMailOptions = buildAdminMailOptions(contactData);
    const welcomeMailOptions = buildWelcomeMailOptions(contactData);

    let adminEmailSent = false;
    let welcomeEmailSent = false;
    const queuedEmails = [];
    const queueErrors = [];
    let emailDeliveryFailed = false;

    try {
      await sendMailOptions(adminMailOptions);
      adminEmailSent = true;
    } catch (error) {
      emailDeliveryFailed = true;
      try {
        await enqueueFailedEmail({
          sourceId: savedContact._id,
          jobType: 'admin',
          mailOptions: adminMailOptions,
        });
        queuedEmails.push('admin');
      } catch (queueError) {
        console.error('Failed to queue admin email:', queueError.message);
        queueErrors.push('admin');
      }
    }

    try {
      await sendMailOptions(welcomeMailOptions);
      welcomeEmailSent = true;
    } catch (error) {
      emailDeliveryFailed = true;
      try {
        await enqueueFailedEmail({
          sourceId: savedContact._id,
          jobType: 'welcome',
          mailOptions: welcomeMailOptions,
        });
        queuedEmails.push('welcome');
      } catch (queueError) {
        console.error('Failed to queue welcome email:', queueError.message);
        queueErrors.push('welcome');
      }
    }

    if (emailDeliveryFailed) {
      console.warn('Email delivery queued: Gmail authentication failed. Update EMAIL_PASS.');
    }

    if (queueErrors.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Contact saved but email retry queue failed. Please contact support.',
        data: {
          id: savedContact._id,
          dbSaved: true,
          adminEmailSent,
          welcomeEmailSent,
          emailStatus: queuedEmails.length ? 'queued' : 'sent',
          queuedEmails,
        },
      });
    }

    const emailStatus = queuedEmails.length === 0 ? 'sent' : 'queued';
    const message =
      emailStatus === 'sent'
        ? 'Contact submitted. Confirmation email sent.'
        : 'Contact submitted. Email delivery is delayed; we will retry automatically.';

    return res.status(200).json({
      success: true,
      message,
      data: {
        id: savedContact._id,
        dbSaved: true,
        adminEmailSent,
        welcomeEmailSent,
        emailStatus,
        queuedEmails,
      },
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
