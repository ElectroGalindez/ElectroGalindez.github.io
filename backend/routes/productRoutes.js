const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas (solo admin)
router.post('/', 
  isAdmin, 
  productController.validateProduct, 
  productController.createProduct
);

router.put('/:id', 
  isAdmin, 
  productController.validateProduct, 
  productController.updateProduct
);

router.delete('/:id', 
  isAdmin, 
  productController.deleteProduct
);

module.exports = router;