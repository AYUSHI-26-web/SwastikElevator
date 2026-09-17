const mongoose = require('mongoose');
const SiteContent = require('../models/SiteContent');
const MediaAsset = require('../models/MediaAsset');
const { defaultSiteContent } = require('../utils/defaultSiteContent');

const SITE_CONTENT_KEY = 'main';
const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;
const MAX_JSON_IMAGE_LENGTH = 4_500_000;
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/x-icon',
  'image/vnd.microsoft.icon',
];

const normalizeString = (value) => (value === undefined || value === null ? '' : value.toString().trim());

const clone = (value) => JSON.parse(JSON.stringify(value));

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const mergeContent = (base, override) => {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (!isPlainObject(base)) {
    return override === undefined || override === null || override === '' ? base : override;
  }

  const merged = { ...base };
  if (!isPlainObject(override)) {
    return merged;
  }

  Object.keys(override).forEach((key) => {
    merged[key] = Object.prototype.hasOwnProperty.call(base, key)
      ? mergeContent(base[key], override[key])
      : override[key];
  });

  return merged;
};

const getMergedContent = (content = {}) => mergeContent(clone(defaultSiteContent), content);

const ensureSiteContent = async () => {
  let document = await SiteContent.findOne({ key: SITE_CONTENT_KEY });

  if (!document) {
    document = await SiteContent.create({
      key: SITE_CONTENT_KEY,
      content: defaultSiteContent,
    });
  }

  return document;
};

const parseDataUrl = (dataUrl) => {
  const value = normalizeString(dataUrl);
  const match = value.match(/^data:([^;,]+);base64,(.+)$/i);

  if (!match) {
    const error = new Error('Invalid image data.');
    error.statusCode = 400;
    throw error;
  }

  const contentType = match[1].toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    const error = new Error('Please upload JPG, PNG, WEBP, or ICO images only.');
    error.statusCode = 400;
    throw error;
  }

  if (value.length > MAX_JSON_IMAGE_LENGTH) {
    const error = new Error('Image is too large. Please upload an image up to 3 MB.');
    error.statusCode = 400;
    throw error;
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > MAX_IMAGE_SIZE_BYTES) {
    const error = new Error('Image is too large. Please upload an image up to 3 MB.');
    error.statusCode = 400;
    throw error;
  }

  return { contentType, buffer };
};

const validateExternalImageValue = (value) => {
  const imageValue = normalizeString(value);

  if (
    !imageValue ||
    imageValue.startsWith('/api/site-content/media/') ||
    /^https?:\/\//i.test(imageValue)
  ) {
    return;
  }

  if (/^data:image\//i.test(imageValue)) {
    parseDataUrl(imageValue);
    return;
  }

  const error = new Error('Image values must be uploaded assets or valid http(s) URLs.');
  error.statusCode = 400;
  throw error;
};

const validateImageReferences = (value, key = '') => {
  if (Array.isArray(value)) {
    value.forEach((item) => validateImageReferences(item, key));
    return;
  }

  if (!isPlainObject(value)) {
    if (['imageUrl', 'logoUrl', 'faviconUrl', 'profileUrl'].includes(key)) {
      validateExternalImageValue(value);
    }
    return;
  }

  Object.entries(value).forEach(([entryKey, entryValue]) => {
    validateImageReferences(entryValue, entryKey);
  });
};

exports.getSiteContent = async (req, res) => {
  try {
    const document = await ensureSiteContent();

    return res.status(200).json({
      success: true,
      data: {
        content: getMergedContent(document.content),
        updatedAt: document.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateSiteContent = async (req, res) => {
  try {
    const nextContent = getMergedContent(req.body?.content || req.body || {});
    validateImageReferences(nextContent);

    const document = await SiteContent.findOneAndUpdate(
      { key: SITE_CONTENT_KEY },
      {
        key: SITE_CONTENT_KEY,
        content: nextContent,
        updatedBy: req.admin?.id || null,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Website content updated successfully.',
      data: {
        content: getMergedContent(document.content),
        updatedAt: document.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating site content:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Internal server error',
    });
  }
};

exports.uploadSiteImage = async (req, res) => {
  try {
    const { dataUrl, fileName, name } = req.body || {};
    const parsed = parseDataUrl(dataUrl);

    const asset = await MediaAsset.create({
      fileName: normalizeString(fileName || name || 'site-image').slice(0, 160),
      contentType: parsed.contentType,
      size: parsed.buffer.length,
      data: parsed.buffer,
      createdBy: req.admin?.id || null,
    });

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        url: `/api/site-content/media/${asset._id}`,
        id: asset._id,
        contentType: asset.contentType,
        size: asset.size,
      },
    });
  } catch (error) {
    console.error('Error uploading site image:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Internal server error',
    });
  }
};

exports.getSiteImage = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send('Image not found');
    }

    const asset = await MediaAsset.findById(req.params.id).select('contentType data size updatedAt');
    if (!asset) {
      return res.status(404).send('Image not found');
    }

    res.setHeader('Content-Type', asset.contentType);
    res.setHeader('Content-Length', asset.size.toString());
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(asset.data);
  } catch (error) {
    console.error('Error serving site image:', error);
    return res.status(500).send('Internal server error');
  }
};
