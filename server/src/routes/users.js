const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Routes for users
router.post('/register', userController.registerUser);
router.get('/profile/:id', auth, userController.getUserProfile);
router.get('/', auth, userController.getAllUsers);

module.exports = router;