const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { adminAuth } = require('../utils/adminAuth');

router.get('/approved', reviewController.getApprovedReviews);
router.get('/token/:token', reviewController.getReviewInvite);
router.post('/', reviewController.createReview);
router.get('/admin', adminAuth, reviewController.getAdminReviews);
router.post('/admin', adminAuth, reviewController.createAdminReview);
router.put('/admin/:id', adminAuth, reviewController.updateAdminReview);
router.delete('/admin/:id', adminAuth, reviewController.deleteAdminReview);
router.patch('/admin/:id/status', adminAuth, reviewController.updateReviewStatus);

module.exports = router;
