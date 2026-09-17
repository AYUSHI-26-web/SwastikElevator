const crypto = require('crypto');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Service = require('../models/Service');
const { getConnectionStatus } = require('../config/db');

const REQUIRED_FIELDS = [
  'name',
  'review',
];

const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_REVIEW_LENGTH = 1200;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const normalizeString = (value) => (value ? value.toString().trim() : '');
const normalizePhone = (value) => normalizeString(value).replace(/\D/g, '').slice(-10);
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getEmailProfileUrl = (email, size = 96) => {
  const normalizedEmail = normalizeString(email).toLowerCase();

  if (!normalizedEmail) {
    return '';
  }

  return `https://unavatar.io/email/${encodeURIComponent(normalizedEmail)}?size=${size}&fallback=false`;
};

const normalizeProfileUrl = (value) => {
  const profileUrl = normalizeString(value);

  if (!profileUrl || profileUrl.length > 1200 || !/^https:\/\/lh[3-6]\.googleusercontent\.com\//i.test(profileUrl)) {
    return '';
  }

  return profileUrl;
};

const normalizeAdminProfileUrl = (value) => {
  const profileUrl = normalizeString(value);

  if (!profileUrl || profileUrl.length > 1200) {
    return '';
  }

  if (/^(https?:\/\/|\/api\/site-content\/media\/)/i.test(profileUrl)) {
    return profileUrl;
  }

  return '';
};

const normalizeRating = (value) => {
  const rating = value === undefined || value === '' ? 5 : Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    const error = new Error('Rating must be between 1 and 5.');
    error.statusCode = 400;
    throw error;
  }

  return rating;
};

const createStandaloneReviewToken = () => `admin-${crypto.randomBytes(24).toString('hex')}`;

const applyAdminReviewFields = (review, body) => {
  if (Object.prototype.hasOwnProperty.call(body, 'name')) {
    review.name = normalizeString(body.name);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'email')) {
    review.email = normalizeString(body.email).toLowerCase();
  }
  if (Object.prototype.hasOwnProperty.call(body, 'mobile')) {
    review.mobile = normalizeString(body.mobile);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'companyBuilding')) {
    review.companyBuilding = normalizeString(body.companyBuilding);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'location')) {
    review.location = normalizeString(body.location);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'serviceUsed')) {
    review.serviceUsed = normalizeString(body.serviceUsed || 'Website Review');
  }
  if (Object.prototype.hasOwnProperty.call(body, 'rating')) {
    review.rating = normalizeRating(body.rating);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'review')) {
    review.review = normalizeString(body.review);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'profileUrl')) {
    review.profileUrl = normalizeAdminProfileUrl(body.profileUrl);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'status')) {
    const nextStatus = normalizeString(body.status);
    if (!['pending', 'approved', 'rejected'].includes(nextStatus)) {
      const error = new Error('Status must be pending, approved, or rejected.');
      error.statusCode = 400;
      throw error;
    }
    review.status = nextStatus;
    review.approvedAt = nextStatus === 'approved' ? review.approvedAt || new Date() : null;
  }
};

const ensureReviewToken = async (service) => {
  if (service.reviewToken) {
    return service.reviewToken;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    service.reviewToken = crypto.randomBytes(24).toString('hex');

    try {
      await service.save();
      return service.reviewToken;
    } catch (error) {
      if (error?.code !== 11000 || attempt === 2) {
        throw error;
      }
    }
  }

  throw new Error('Could not create a review token.');
};

const findCompletedServiceForPublicReview = async ({ email, mobile }) => {
  const normalizedMobile = normalizePhone(mobile);
  if (!normalizedMobile) {
    return null;
  }

  const services = await Service.find({
    status: 'completed',
    email: { $regex: new RegExp(`^${escapeRegExp(email)}$`, 'i') },
  }).sort({ createdAt: -1 });

  const matchingServices = services.filter((service) => normalizePhone(service.phone) === normalizedMobile);

  return matchingServices.find((service) => !service.reviewSubmittedAt) || matchingServices[0] || null;
};

const normalizePhoto = (photo) => {
  if (!photo || !photo.dataUrl) {
    return null;
  }

  const name = normalizeString(photo.name).slice(0, 120);
  const type = normalizeString(photo.type).toLowerCase();
  const size = Number(photo.size) || 0;
  const dataUrl = normalizeString(photo.dataUrl);

  if (!ALLOWED_PHOTO_TYPES.includes(type)) {
    const error = new Error('Please upload a JPG, PNG, or WEBP image.');
    error.statusCode = 400;
    throw error;
  }

  if (size > MAX_PHOTO_SIZE_BYTES || dataUrl.length > 3_000_000) {
    const error = new Error('Photo size must be 2 MB or less.');
    error.statusCode = 400;
    throw error;
  }

  if (!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(dataUrl)) {
    const error = new Error('Invalid photo format.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    type,
    size,
    dataUrl,
  };
};

const toPublicReview = (review) => {
  const profileUrl = normalizeString(review.profileUrl) || getEmailProfileUrl(review.email);

  return {
    id: review._id,
    name: review.name,
    email: review.email,
    company: review.companyBuilding,
    location: review.location,
    serviceUsed: review.serviceUsed,
    rating: review.rating,
    review: review.review,
    profileUrl,
    photoUrl: profileUrl,
    approvedAt: review.approvedAt,
    createdAt: review.createdAt,
  };
};

exports.getReviewInvite = async (req, res) => {
  try {
    const token = normalizeString(req.params.token);

    if (!token) {
      return res.status(400).json({ success: false, message: 'Review token is required.' });
    }

    const service = await Service.findOne({ reviewToken: token });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Review link is invalid.' });
    }

    const existingReview = await Review.findOne({ token }).select('_id status createdAt');

    return res.status(200).json({
      success: true,
      data: {
        token,
        isSubmitted: Boolean(existingReview || service.reviewSubmittedAt),
        reviewStatus: existingReview?.status || null,
        customer: {
          name: service.name,
          email: service.email,
          mobile: service.phone,
          companyBuilding: '',
          location: service.address,
          serviceUsed: service.serviceType,
          profileUrl: getEmailProfileUrl(service.email),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching review invite:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.createReview = async (req, res) => {
  try {
    if (!getConnectionStatus()) {
      return res.status(503).json({
        success: false,
        message: 'Database is unavailable. Please try again.',
      });
    }

    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    const token = normalizeString(req.body.token);
    const requestEmail = normalizeString(req.body.email).toLowerCase();
    const requestMobile = normalizeString(req.body.mobile);

    const service = token
      ? await Service.findOne({ reviewToken: token })
      : requestEmail && requestMobile
        ? await findCompletedServiceForPublicReview({ email: requestEmail, mobile: requestMobile })
        : null;

    if (token && !service) {
      return res.status(404).json({
        success: false,
        message: 'Review link is invalid.',
      });
    }

    if (service && service.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Review can be submitted after service completion only.',
      });
    }

    if (service) {
      const existingReview = await Review.findOne({ service: service._id });
      if (existingReview || service.reviewSubmittedAt) {
        return res.status(409).json({
          success: false,
          message: 'A review has already been submitted for this completed service.',
        });
      }
    }

    const email = normalizeString(req.body.email || service?.email).toLowerCase();
    const mobile = normalizeString(req.body.mobile || service?.phone);
    const profileUrl = normalizeProfileUrl(req.body.profileUrl);
    const rating = req.body.rating === undefined || req.body.rating === '' ? 5 : Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5.',
      });
    }

    const reviewText = normalizeString(req.body.review);
    if (reviewText.length > MAX_REVIEW_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Review must be ${MAX_REVIEW_LENGTH} characters or less.`,
      });
    }

    const reviewToken = token || (service ? await ensureReviewToken(service) : `public-${crypto.randomBytes(24).toString('hex')}`);
    const reviewServiceId = service?._id || new mongoose.Types.ObjectId();

    const review = await Review.create({
      service: reviewServiceId,
      token: reviewToken,
      name: normalizeString(req.body.name),
      email,
      mobile,
      companyBuilding: normalizeString(req.body.companyBuilding),
      location: normalizeString(req.body.location || service?.address),
      serviceUsed: normalizeString(req.body.serviceUsed || service?.serviceType || 'Website Review'),
      rating,
      review: reviewText,
      profileUrl,
      photo: normalizePhoto(req.body.photo),
      status: 'approved',
      approvedAt: new Date(),
    });

    if (service) {
      service.reviewSubmittedAt = new Date();
      await service.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your review is now visible on the website.',
      data: toPublicReview(review),
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A review has already been submitted for this completed service.',
      });
    }

    if (error && error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('Error submitting review:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(12);

    return res.status(200).json({
      success: true,
      data: reviews.map(toPublicReview),
    });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getAdminReviews = async (req, res) => {
  try {
    const status = normalizeString(req.query.status);
    const query = ['pending', 'approved', 'rejected'].includes(status) ? { status } : {};
    const reviews = await Review.find(query)
      .populate('service', 'status reviewEmailStatus reviewRequestedAt reviewSubmittedAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews.map((review) => ({
        ...review.toObject(),
        profileUrl: normalizeString(review.profileUrl) || getEmailProfileUrl(review.email),
      })),
    });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.createAdminReview = async (req, res) => {
  try {
    if (!normalizeString(req.body?.name) || !normalizeString(req.body?.review)) {
      return res.status(400).json({
        success: false,
        message: 'Name and review are required.',
      });
    }

    const reviewText = normalizeString(req.body.review);
    if (reviewText.length > MAX_REVIEW_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Review must be ${MAX_REVIEW_LENGTH} characters or less.`,
      });
    }

    const status = ['pending', 'approved', 'rejected'].includes(normalizeString(req.body.status))
      ? normalizeString(req.body.status)
      : 'approved';

    const review = new Review({
      token: createStandaloneReviewToken(),
      name: normalizeString(req.body.name),
      email: normalizeString(req.body.email).toLowerCase(),
      mobile: normalizeString(req.body.mobile),
      companyBuilding: normalizeString(req.body.companyBuilding),
      location: normalizeString(req.body.location),
      serviceUsed: normalizeString(req.body.serviceUsed || 'Website Review'),
      rating: normalizeRating(req.body.rating),
      review: reviewText,
      profileUrl: normalizeAdminProfileUrl(req.body.profileUrl),
      status,
      approvedAt: status === 'approved' ? new Date() : null,
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      data: review,
    });
  } catch (error) {
    console.error('Error creating admin review:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Internal server error',
    });
  }
};

exports.updateAdminReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    applyAdminReviewFields(review, req.body || {});

    if (!review.name || !review.review) {
      return res.status(400).json({
        success: false,
        message: 'Name and review are required.',
      });
    }

    if (review.review.length > MAX_REVIEW_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Review must be ${MAX_REVIEW_LENGTH} characters or less.`,
      });
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully.',
      data: review,
    });
  } catch (error) {
    console.error('Error updating admin review:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Internal server error',
    });
  }
};

exports.deleteAdminReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting admin review:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const nextStatus = normalizeString(req.body.status);

    if (!['pending', 'approved', 'rejected'].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, approved, or rejected.',
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    review.status = nextStatus;
    review.approvedAt = nextStatus === 'approved' ? new Date() : null;
    await review.save();

    return res.status(200).json({
      success: true,
      message: `Review ${nextStatus}.`,
      data: review,
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
