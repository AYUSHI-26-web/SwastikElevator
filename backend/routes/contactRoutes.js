const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/contactController');

router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Contact endpoint is available. Use POST /api/contact to submit the contact form.',
    methods: ['POST'],
  });
});

router.post('/', createContact);

module.exports = router;
