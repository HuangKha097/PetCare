const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public route to submit inquiry
router.post('/', inquiryController.createInquiry);

// Admin routes to view and manage inquiries
router.get('/', auth, adminAuth, inquiryController.getAllInquiries);
router.patch('/:id/status', auth, adminAuth, inquiryController.updateInquiryStatus);

module.exports = router;
