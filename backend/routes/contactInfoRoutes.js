const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  createContactInfo
} = require('../controllers/contactInfoController');

router.get('/', getContactInfo);
router.post('/', createContactInfo);

module.exports = router;
