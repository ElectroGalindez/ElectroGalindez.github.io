const express = require('express');
const router = express.Router();

// Rutas públicas
router.use('/auth', require('./authRoutes'));
router.use('/server', require('./serverStatus'));

module.exports = router;