const express = require('express');
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require('../controllers/adminAuthController');

const { adminAuth } = require('../utils/adminAuth');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', adminAuth, getAdminProfile);

module.exports = router;
