const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// GET user profile
router.get('/me', protect, userController.getUserProfile);

// PUT update user profile
router.put('/me', protect, userController.updateUserProfile);

// GET all users (admin only)
router.get('/', protect, userController.getAllUsers);

// GET user by ID (admin only)
router.get('/:id', protect, userController.getUserById);

// PUT update user (admin only)
router.put('/:id', protect, userController.updateUser);

// DELETE user (admin only)
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;

