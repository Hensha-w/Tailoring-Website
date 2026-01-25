// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, googleAuth, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { validateRegistration, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;