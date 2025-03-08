const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get user profile
router.get('/:id', userController.getUserProfile);

// Route to update user information
router.put('/:id', userController.updateUser);

// Route to delete a user
router.delete('/:id', userController.deleteUser);

module.exports = router;