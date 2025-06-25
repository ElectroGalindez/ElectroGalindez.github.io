const express = require('express');
const router = express.Router();

// Rutas públicas
router.use('/auth', require('./auth.routes'));
router.use('/server', require('./server.routes'));
router.use('/products', require('./product.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/orders', require('./orders.routes'));

module.exports = router;
