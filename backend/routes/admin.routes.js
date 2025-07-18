// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/summary', adminController.getAdminSummary);

module.exports = router;

