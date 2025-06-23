// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Importa CORRECTAMENTE los controladores
const authController = require('../controllers/authController');

// Usa las funciones directamente como handlers
router.post('/register', authController.register); 
router.post('/login', authController.login);       

// Ruta de perfil (ejemplo adicional)
router.get('/profile', authController.getProfile);

module.exports = router;