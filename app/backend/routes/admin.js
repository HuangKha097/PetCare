const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const requireAdminPassword = require('../middleware/requireAdminPassword');

router.get('/dashboard', auth, adminAuth, adminController.getDashboardAnalytics);
router.get('/notifications', auth, adminAuth, adminController.getRecentNotifications);

// User Management
router.get('/users', auth, adminAuth, adminController.getAllUsers);
router.get('/users/:id', auth, adminAuth, adminController.getUserDetails);
router.put('/users/:id', auth, adminAuth, requireAdminPassword, adminController.updateUserInfo);
router.patch('/users/:id/status', auth, adminAuth, requireAdminPassword, adminController.toggleUserStatus);
router.delete('/users/:id', auth, adminAuth, requireAdminPassword, adminController.deleteUser);

module.exports = router;
