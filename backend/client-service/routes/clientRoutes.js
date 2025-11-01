const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const llmController = require('../controllers/llmController');

// Define GET and POST routes for client-specific functionality
// GET route returns all events
router.get('/events', clientController.getEvents)

// Post route for purchasing tickets, decreases ticket count
router.post('/events/:id/purchase', clientController.updateTicketCount);

// LLM Assistant route
router.post('/llm/parse', llmController.parseUserInput);


module.exports = router;