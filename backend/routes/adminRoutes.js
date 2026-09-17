const express = require('express');
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require('../controllers/adminAuthController');

const { adminAuth, allowInitialAdminOrAuthenticatedAdmin } = require('../utils/adminAuth');

router.post('/register', allowInitialAdminOrAuthenticatedAdmin, registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', adminAuth, getAdminProfile);

module.exports = router;
