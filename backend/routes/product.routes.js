// routes/product.routes.js
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload'); // ← Importa multer

router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);

// ✅ Usa upload.single('image') para procesar FormData
router.post('/', requireAuth, requireAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', requireAuth, requireAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', requireAuth, requireAdmin, productController.deleteProduct);

module.exports = router;