const express = require('express');
const router = express.Router();

// Rutas públicas
router.use('/auth', require('./auth.routes'));
router.use('/auth', require('./user.routes'));
router.use('/server', require('./server.routes'));
router.use('/products', require('./product.routes'));
router.use('/categories', require('./categories.routes'));
router.use('/orders', require('./orders.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
