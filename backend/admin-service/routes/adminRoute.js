const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

// You access each function using dot notation
router.get('/events', adminController.listEvents);
// Define the POST route for creating an event
router.post('/events', adminController.addEvent);

module.exports = router;