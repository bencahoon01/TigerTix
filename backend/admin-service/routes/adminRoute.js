const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { protect } = require('../controllers/authMiddleware'); // authMiddleware is in controllers folder

// You access each function using dot notation
// Define the POST route for creating an event
router.post('/events', protect, adminController.addEvent);

module.exports = router;