const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  createContactInfo
} = require('../controllers/contactInfoController');
const { adminAuth } = require('../utils/adminAuth');

router.get('/', getContactInfo);
router.post('/', adminAuth, createContactInfo);

module.exports = router;
