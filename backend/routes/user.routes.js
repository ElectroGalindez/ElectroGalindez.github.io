// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Rutas corregidas sin duplicar '/users'
router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);

module.exports = router;