const express = require('express');
const router = express.Router();
const {
  getSiteContent,
  updateSiteContent,
  uploadSiteImage,
  getSiteImage,
} = require('../controllers/siteContentController');
const { adminAuth } = require('../utils/adminAuth');

router.get('/', getSiteContent);
router.get('/media/:id', getSiteImage);
router.put('/', adminAuth, updateSiteContent);
router.post('/upload', adminAuth, uploadSiteImage);

module.exports = router;
