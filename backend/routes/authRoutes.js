const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Rutas protegidas
router.get('/profile', authenticate, authController.getProfile);

// Ruta de ejemplo para administradores
router.get('/admin-only', 
  authenticate, 
  authorize(['admin']),
  (req, res) => {
    res.json({ message: 'Acceso de administrador concedido' });
  }
);

module.exports = router;