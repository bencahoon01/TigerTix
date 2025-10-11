const express = require('express');
const router = express.Router();
const { addEvent } = require('../controllers/adminController');

// Define the POST route for creating an event
router.post('/events', addEvent);

module.exports = router;