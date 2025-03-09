const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Routes for auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/validate-token', auth, authController.validateToken);

module.exports = router;