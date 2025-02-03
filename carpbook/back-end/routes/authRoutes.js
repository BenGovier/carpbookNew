const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Update the register route to use POST to /register
router.post('/register', authController.registerUser);

// Login route (unchanged)
router.post('/login', authController.loginUser);

module.exports = router;

