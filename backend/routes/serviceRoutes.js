const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { adminAuth } = require('../utils/adminAuth');

router.post('/', serviceController.createService);
router.get('/', adminAuth, serviceController.getServices);
router.get('/:id', adminAuth, serviceController.getServiceById);
router.put('/:id', adminAuth, serviceController.updateService);
router.delete('/:id', adminAuth, serviceController.deleteService);

module.exports = router;
