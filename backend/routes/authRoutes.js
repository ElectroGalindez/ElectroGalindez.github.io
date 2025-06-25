const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');
const express = require('express');
const authController = require('../controllers/authController');

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.get('/validate-reset-token', authController.validateResetToken);
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
const rateLimit = require('express-rate-limit');

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 3, // Máximo 3 solicitudes por IP
    message: 'Demasiadas solicitudes de recuperación. Intente más tarde.',
    skipSuccessfulRequests: true
});

// En authRoutes.js
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);

module.exports = router;
