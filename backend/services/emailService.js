const nodemailer = require('nodemailer');

let transporter = null;
let transporterLastVerifiedAt = 0;
const TRANSPORTER_VERIFY_TTL_MS = 5 * 60 * 1000;

const emailAuthState = {
  status: 'unknown',
  lastCheckedAt: null,
  lastError: '',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const sanitizeEnvValue = (value = '') =>
  String(value)
    .trim()
    .replace(/^['"]|['"]$/g, '');

const getMailConfig = () => {
  const emailUser = sanitizeEnvValue(process.env.EMAIL_USER);
  const emailPass = sanitizeEnvValue(process.env.EMAIL_PASS).replace(/\s/g, '');
  return { emailUser, emailPass };
};

const assertMailConfig = () => {
  const { emailUser, emailPass } = getMailConfig();

  if (!emailUser || !emailPass) {
    const error = new Error(
      'Email service is not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env.'
    );
    error.code = 'MAIL_CONFIG_MISSING';
    throw error;
  }

  return { emailUser, emailPass };
};

const classifyEmailError = (error) => {
  if (!error) {
    return 'SMTP_INIT_FAILED';
  }

  if (error.code === 'MAIL_CONFIG_MISSING') {
    return 'MAIL_CONFIG_MISSING';
  }

  if (error.code === 'EAUTH' || error.responseCode === 535) {
    return 'SMTP_AUTH_FAILED';
  }

  return 'SMTP_INIT_FAILED';
};

const updateAuthState = (status, error = null) => {
  emailAuthState.status = status;
  emailAuthState.lastCheckedAt = new Date().toISOString();
  emailAuthState.lastError = error ? error.message : '';
};

const getEmailAuthStatus = () => ({ ...emailAuthState });

const createTransporter = (emailUser, emailPass) =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

const shouldReverifyTransporter = () => {
  if (!transporter) {
    return true;
  }

  return Date.now() - transporterLastVerifiedAt > TRANSPORTER_VERIFY_TTL_MS;
};

const ensureTransporter = async (maxAttempts = 2) => {
  const { emailUser, emailPass } = assertMailConfig();

  if (transporter && !shouldReverifyTransporter()) {
    return transporter;
  }

  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      transporter = createTransporter(emailUser, emailPass);
      await transporter.verify();
      transporterLastVerifiedAt = Date.now();
      updateAuthState('ok');
      return transporter;
    } catch (error) {
      lastError = error;
      transporter = null;
      transporterLastVerifiedAt = 0;
      updateAuthState('failed', error);

      if (attempt < maxAttempts) {
        await sleep(300 * attempt);
      }
    }
  }

  const wrappedError = new Error(
    `SMTP initialization failed: ${lastError ? lastError.message : 'unknown error'}`
  );
  wrappedError.code = classifyEmailError(lastError);
  wrappedError.cause = lastError;
  throw wrappedError;
};

const preflightEmailAuth = async () => {
  try {
    await ensureTransporter();
    return getEmailAuthStatus();
  } catch (error) {
    updateAuthState('failed', error);
    return getEmailAuthStatus();
  }
};

const resetTransporter = () => {
  transporter = null;
  transporterLastVerifiedAt = 0;
};

const sendMailOptions = async (mailOptions) => {
  try {
    const mailer = await ensureTransporter();
    return await mailer.sendMail(mailOptions);
  } catch (error) {
    const wrappedError = error;
    if (!wrappedError.code || wrappedError.code === 'EAUTH') {
      wrappedError.code = classifyEmailError(error);
    }

    if (wrappedError.code === 'SMTP_AUTH_FAILED' || error.code === 'EAUTH') {
      resetTransporter();
      updateAuthState('failed', wrappedError);
    }

    throw wrappedError;
  }
};

const buildAdminMailOptions = (contactData) => {
  const { emailUser } = getMailConfig();
  const safe = {
    salutation: escapeHtml(contactData.salutation),
    name: escapeHtml(contactData.name),
    company: escapeHtml(contactData.company || '-'),
    email: escapeHtml(contactData.email),
    phone: escapeHtml(contactData.phone),
    street: escapeHtml(contactData.street),
    number: escapeHtml(contactData.number),
    buildingName: escapeHtml(contactData.buildingName || ''),
    city: escapeHtml(contactData.city),
    state: escapeHtml(contactData.state),
    subject: escapeHtml(contactData.subject || '-'),
    message: escapeHtml(contactData.message),
  };

  return {
    from: `"Swastik Elevator" <${emailUser}>`,
    to: emailUser,
    replyTo: contactData.email,
    subject:
      'New Contact Form Submission - Swastik Elevator { A unit of Himanchal Enterprises }',
    text: [
      'You have a new contact form submission:',
      '',
      `Salutation: ${contactData.salutation}`,
      `Name: ${contactData.name}`,
      `Company: ${contactData.company || '-'}`,
      `Email: ${contactData.email}`,
      `Phone: ${contactData.phone}`,
      `Address: ${contactData.street} ${contactData.number}${
        contactData.buildingName ? `, ${contactData.buildingName}` : ''
      }, ${contactData.city}, ${contactData.state}`,
      `Subject: ${contactData.subject || '-'}`,
      `Message: ${contactData.message}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Swastik Elevator</h1>
          <p style="color: #dbeafe; margin: 5px 0 0;">A unit of Himanchal Enterprises</p>
        </div>
        <div style="padding: 30px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
          <h2 style="color: #1e40af; margin-top: 0;">New Contact Form Submission</h2>
          <p style="font-size: 16px;">You've received a new inquiry from your website.</p>
        </div>
        <div style="padding: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Salutation</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.salutation}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Company</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.company}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Address</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
                ${safe.street} ${safe.number}${safe.buildingName ? `, ${safe.buildingName}` : ''}, ${safe.city}, ${safe.state}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subject</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 10px;">${safe.message}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };
};

const buildWelcomeMailOptions = (contactData) => {
  const { emailUser } = getMailConfig();
  const safe = {
    salutation: escapeHtml(contactData.salutation),
    name: escapeHtml(contactData.name),
    subject: escapeHtml(contactData.subject || 'General Inquiry'),
    message: escapeHtml(contactData.message),
  };

  return {
    from: `"Swastik Elevator" <${emailUser}>`,
    to: contactData.email,
    subject: 'Thank you for contacting Swastik Elevator',
    text: [
      `Dear ${contactData.salutation} ${contactData.name},`,
      '',
      'Thank you for contacting Swastik Elevator.',
      'We have received your inquiry and our team will get back to you within 24 hours.',
      '',
      `Subject: ${contactData.subject || 'General Inquiry'}`,
      `Message: ${contactData.message}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Swastik Elevator</h1>
          <p style="color: #dbeafe; margin: 5px 0 0;">A unit of Himanchal Enterprises</p>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #1e40af; margin-top: 0;">Thank You for Contacting Us</h2>
          <p style="font-size: 16px;">Dear ${safe.salutation} ${safe.name},</p>
          <p>We have received your inquiry and appreciate your interest in our services.</p>
          <p>Our team will review your message and get back to you within 24 hours.</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h3 style="color: #1e40af;">Your Submission</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Subject</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${safe.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Message</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${safe.message}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 20px; background-color: #f3f4f6; text-align: center;">
          <p style="margin: 0;"><strong>Need Immediate Assistance?</strong></p>
          <p style="margin: 5px 0;">Call us: <a href="tel:+918318326578">+91 8318326578</a></p>
          <p style="margin: 5px 0;">WhatsApp: <a href="https://wa.me/918318326578">Chat with us</a></p>
        </div>
      </div>
    `,
  };
};

const buildServiceAdminMailOptions = (serviceData) => {
  const { emailUser } = getMailConfig();
  const safe = {
    name: escapeHtml(serviceData.name),
    email: escapeHtml(serviceData.email || '-'),
    phone: escapeHtml(serviceData.phone),
    address: escapeHtml(serviceData.address || '-'),
    serviceType: escapeHtml(serviceData.serviceType),
    message: escapeHtml(serviceData.message || '-'),
  };

  return {
    from: `"Swastik Elevator" <${emailUser}>`,
    to: emailUser,
    replyTo: serviceData.email || undefined,
    subject: `New Service Request - ${serviceData.serviceType}`,
    text: [
      'You have a new service booking request:',
      '',
      `Name: ${serviceData.name}`,
      `Email: ${serviceData.email || '-'}`,
      `Phone: ${serviceData.phone}`,
      `Address: ${serviceData.address || '-'}`,
      `Service Type: ${serviceData.serviceType}`,
      `Description: ${serviceData.message || '-'}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Swastik Elevator</h1>
          <p style="color: #dbeafe; margin: 5px 0 0;">A unit of Himanchal Enterprises</p>
        </div>
        <div style="padding: 30px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
          <h2 style="color: #1e40af; margin-top: 0;">New Service Booking Request</h2>
          <p style="font-size: 16px;">You've received a new service request from your website.</p>
        </div>
        <div style="padding: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 30%;">Name</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.phone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Address</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.address}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Service Type</td>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${safe.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">Description</td>
              <td style="padding: 10px;">${safe.message}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };
};

const buildServiceConfirmationMailOptions = (serviceData) => {
  const { emailUser } = getMailConfig();
  const safe = {
    name: escapeHtml(serviceData.name),
    serviceType: escapeHtml(serviceData.serviceType),
    message: escapeHtml(serviceData.message || '-'),
  };

  return {
    from: `"Swastik Elevator" <${emailUser}>`,
    to: serviceData.email,
    subject: 'We received your service request - Swastik Elevator',
    text: [
      `Dear ${serviceData.name},`,
      '',
      'Thank you for booking a service with Swastik Elevator.',
      'We have received your request and our team will contact you within 24 hours to schedule it.',
      '',
      `Service Type: ${serviceData.serviceType}`,
      `Description: ${serviceData.message || '-'}`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Swastik Elevator</h1>
          <p style="color: #dbeafe; margin: 5px 0 0;">A unit of Himanchal Enterprises</p>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #1e40af; margin-top: 0;">Service Request Received</h2>
          <p style="font-size: 16px;">Dear ${safe.name},</p>
          <p>We have received your service booking request and our team will contact you within 24 hours to schedule it.</p>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h3 style="color: #1e40af;">Your Request</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Service Type</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${safe.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Description</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${safe.message}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 20px; background-color: #f3f4f6; text-align: center;">
          <p style="margin: 0;"><strong>Need Immediate Assistance?</strong></p>
          <p style="margin: 5px 0;">Call us: <a href="tel:+918318326578">+91 8318326578</a></p>
          <p style="margin: 5px 0;">WhatsApp: <a href="https://wa.me/918318326578">Chat with us</a></p>
        </div>
      </div>
    `,
  };
};

const buildReviewRequestMailOptions = (serviceData, reviewUrl) => {
  const { emailUser } = getMailConfig();
  const safe = {
    name: escapeHtml(serviceData.name),
    serviceType: escapeHtml(serviceData.serviceType),
    address: escapeHtml(serviceData.address || '-'),
    reviewUrl: escapeHtml(reviewUrl),
  };

  return {
    from: `"Swastik Elevator" <${emailUser}>`,
    to: serviceData.email,
    subject: 'How was your Swastik Elevator service?',
    text: [
      `Dear ${serviceData.name},`,
      '',
      'Thank you for choosing Swastik Elevator.',
      'Your service/project has been marked completed, and we would be grateful for your feedback.',
      '',
      `Service: ${serviceData.serviceType}`,
      `Location: ${serviceData.address || '-'}`,
      '',
      `Give your review: ${reviewUrl}`,
      '',
      'This review link is unique to your completed service and can be used only once.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937; background: #ffffff;">
        <div style="background-color: #1e40af; padding: 24px; text-align: center; border-top: 4px solid #f59e0b;">
          <h1 style="color: white; margin: 0; font-size: 26px;">Swastik Elevator</h1>
          <p style="color: #dbeafe; margin: 6px 0 0;">A unit of Himanchal Enterprises</p>
        </div>
        <div style="padding: 32px; background-color: #f8fafc;">
          <p style="font-size: 16px; margin-top: 0;">Dear ${safe.name},</p>
          <h2 style="color: #1e40af; margin: 0 0 12px; font-size: 24px;">Your feedback helps us serve better</h2>
          <p style="line-height: 1.7; margin: 0 0 22px;">
            Your elevator service/project has been completed. We would appreciate a short review about your experience with our engineering and support team.
          </p>
          <table style="width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #e5e7eb; margin-bottom: 26px;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 34%;">Service</td>
              <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${safe.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-weight: bold;">Location</td>
              <td style="padding: 12px;">${safe.address}</td>
            </tr>
          </table>
          <div style="text-align: center;">
            <a href="${safe.reviewUrl}" style="display: inline-block; background: #f59e0b; color: #0f172a; text-decoration: none; font-weight: 800; padding: 14px 24px; border-radius: 8px;">
              Give Your Review
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin: 24px 0 0;">
            This review link is unique to your completed service and can be used only once.
          </p>
        </div>
      </div>
    `,
  };
};

module.exports = {
  getMailConfig,
  ensureTransporter,
  sendMailOptions,
  buildAdminMailOptions,
  buildWelcomeMailOptions,
  buildServiceAdminMailOptions,
  buildServiceConfirmationMailOptions,
  buildReviewRequestMailOptions,
  classifyEmailError,
  getEmailAuthStatus,
  preflightEmailAuth,
};
