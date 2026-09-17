const crypto = require('crypto');
const Service = require('../models/Service');
const { getConnectionStatus } = require('../config/db');
const {
  buildServiceAdminMailOptions,
  buildServiceConfirmationMailOptions,
  buildReviewRequestMailOptions,
  sendMailOptions,
} = require('../services/emailService');
const { enqueueEmailJob } = require('../services/emailQueueService');

const DEFAULT_SITE_URL = 'https://swastik-lift-elevate-main.vercel.app';
const serviceUpdateFields = ['name', 'email', 'phone', 'address', 'serviceType', 'message', 'status'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requiredFields = ['name', 'email', 'phone', 'address', 'serviceType'];

const normalizeServiceData = (body) => ({
  name: body.name.trim(),
  email: body.email.trim(),
  phone: body.phone.trim(),
  address: body.address.trim(),
  serviceType: body.serviceType.trim(),
  message: body.message ? body.message.trim() : (body.description ? body.description.trim() : ''),
});

const saveServiceWithRetry = async (serviceData, retries = 2) => {
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const service = new Service(serviceData);
      return await service.save();
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
    sourceType: 'service',
    jobType,
    to: mailOptions.to,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  });
};

const createReviewToken = () => crypto.randomBytes(24).toString('hex');

const getPublicSiteUrl = () => {
  const rawUrl =
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    process.env.SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL;

  const normalized = rawUrl.toString().trim().replace(/\/+$/, '');
  return normalized || DEFAULT_SITE_URL;
};

const buildReviewUrl = (token) =>
  `${getPublicSiteUrl()}/?reviewToken=${encodeURIComponent(token)}#reviews`;

const ensureReviewToken = async (service) => {
  if (service.reviewToken) {
    return service.reviewToken;
  }

  for (let attempt = 1; attempt <= 5; attempt++) {
    service.reviewToken = createReviewToken();

    try {
      await service.save();
      return service.reviewToken;
    } catch (error) {
      if (error && error.code === 11000 && attempt < 5) {
        service.reviewToken = undefined;
        continue;
      }

      throw error;
    }
  }

  throw new Error('Unable to generate a unique review link');
};

const sendReviewRequestForService = async (service) => {
  if (service.reviewSubmittedAt) {
    return {
      emailStatus: 'already_submitted',
      reviewUrl: service.reviewToken ? buildReviewUrl(service.reviewToken) : null,
    };
  }

  if (service.reviewRequestedAt && ['sent', 'queued'].includes(service.reviewEmailStatus)) {
    return {
      emailStatus: service.reviewEmailStatus,
      reviewUrl: service.reviewToken ? buildReviewUrl(service.reviewToken) : null,
      alreadyRequested: true,
    };
  }

  const token = await ensureReviewToken(service);
  const reviewUrl = buildReviewUrl(token);
  const mailOptions = buildReviewRequestMailOptions(service, reviewUrl);
  const now = new Date();

  try {
    await sendMailOptions(mailOptions);
    service.reviewRequestedAt = now;
    service.reviewEmailStatus = 'sent';
    service.reviewEmailSentAt = now;
    service.reviewEmailLastError = '';
    await service.save();

    return {
      emailStatus: 'sent',
      reviewUrl,
    };
  } catch (error) {
    try {
      await enqueueFailedEmail({
        sourceId: service._id,
        jobType: 'review_request',
        mailOptions,
      });

      service.reviewRequestedAt = service.reviewRequestedAt || now;
      service.reviewEmailStatus = 'queued';
      service.reviewEmailLastError = error.message;
      await service.save();

      return {
        emailStatus: 'queued',
        reviewUrl,
        error: error.message,
      };
    } catch (queueError) {
      service.reviewRequestedAt = service.reviewRequestedAt || now;
      service.reviewEmailStatus = 'failed';
      service.reviewEmailLastError = queueError.message;
      await service.save();

      console.error('Failed to queue review request email:', queueError.message);

      return {
        emailStatus: 'failed',
        reviewUrl,
        error: queueError.message,
      };
    }
  }
};

const applyServiceUpdates = (service, body) => {
  for (const field of serviceUpdateFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      service[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
    }
  }
};

exports.createService = async (req, res) => {
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

    const serviceData = normalizeServiceData(req.body);

    let savedService = null;
    try {
      savedService = await saveServiceWithRetry(serviceData, 2);
    } catch (error) {
      console.error('Service save failed:', error.message);
      return res.status(503).json({
        success: false,
        message: 'Failed to save service request. Please try again.',
      });
    }

    const adminMailOptions = buildServiceAdminMailOptions(serviceData);
    const confirmationMailOptions = buildServiceConfirmationMailOptions(serviceData);

    let adminEmailSent = false;
    let confirmationEmailSent = false;
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
          sourceId: savedService._id,
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
      await sendMailOptions(confirmationMailOptions);
      confirmationEmailSent = true;
    } catch (error) {
      emailDeliveryFailed = true;
      try {
        await enqueueFailedEmail({
          sourceId: savedService._id,
          jobType: 'welcome',
          mailOptions: confirmationMailOptions,
        });
        queuedEmails.push('welcome');
      } catch (queueError) {
        console.error('Failed to queue confirmation email:', queueError.message);
        queueErrors.push('welcome');
      }
    }

    if (emailDeliveryFailed) {
      console.warn('Email delivery queued: Gmail authentication failed. Update EMAIL_PASS.');
    }

    if (queueErrors.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'Service request saved but email retry queue failed. Please contact support.',
        data: {
          id: savedService._id,
          dbSaved: true,
          adminEmailSent,
          confirmationEmailSent,
          emailStatus: queuedEmails.length ? 'queued' : 'sent',
          queuedEmails,
        },
      });
    }

    const emailStatus = queuedEmails.length === 0 ? 'sent' : 'queued';
    const message =
      emailStatus === 'sent'
        ? 'Service request submitted. Confirmation email sent.'
        : 'Service request submitted. Email delivery is delayed; we will retry automatically.';

    return res.status(200).json({
      success: true,
      message,
      data: {
        id: savedService._id,
        dbSaved: true,
        adminEmailSent,
        confirmationEmailSent,
        emailStatus,
        queuedEmails,
      },
    });
  } catch (error) {
    console.error('Error submitting service request:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const previousStatus = service.status;
    applyServiceUpdates(service, req.body);
    await service.save();

    let reviewRequest = null;
    if (
      previousStatus !== 'completed' &&
      service.status === 'completed' &&
      !service.reviewSubmittedAt &&
      !(service.reviewRequestedAt && ['sent', 'queued'].includes(service.reviewEmailStatus))
    ) {
      reviewRequest = await sendReviewRequestForService(service);
    }

    res.json({
      success: true,
      message:
        reviewRequest && reviewRequest.emailStatus === 'sent'
          ? 'Service updated and review request email sent.'
          : 'Service updated successfully.',
      data: {
        service,
        reviewRequest,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
