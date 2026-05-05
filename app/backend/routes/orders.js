const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// User routes
router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getUserOrders);

// Admin routes
router.get('/', auth, adminAuth, orderController.getAllOrders);
router.patch('/:id/status', auth, adminAuth, orderController.updateOrderStatus);

module.exports = router;
