// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');  // Import controller functions

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);
module.exports = router;
