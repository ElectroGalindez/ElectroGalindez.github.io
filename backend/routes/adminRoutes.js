// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');  // Importa el controlador

// Rutas usando los controladores importados
router.get('/orders', isAdmin, adminController.getOrders);
router.get('/users', isAdmin, adminController.getUsers);
router.patch('/products/:id/stock', isAdmin, adminController.updateStock);

module.exports = router;