const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.post('/profile', authController.getProfile);

module.exports = router;
