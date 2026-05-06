const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const requireAdminPassword = require('../middleware/requireAdminPassword');

// Public routes
router.get('/popular', productController.getPopularProducts);

// Admin routes (must be before /:id to avoid matching 'admin' as an id)
router.get('/admin/all', auth, adminAuth, productController.getAllProductsAdmin);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', auth, adminAuth, productController.createProduct);
router.put('/:id', auth, adminAuth, requireAdminPassword, productController.updateProduct);
router.patch('/:id/status', auth, adminAuth, productController.updateProductStatus);
router.delete('/:id', auth, adminAuth, requireAdminPassword, productController.deleteProduct);

module.exports = router;
