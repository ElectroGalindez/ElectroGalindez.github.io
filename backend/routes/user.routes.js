// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/users', userController.getAllUsers);
router.put('/users/:id/role', userController.updateUserRole);

module.exports = router;
