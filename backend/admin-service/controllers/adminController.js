const { createEvent } = require('../models/adminModel');

/**
 * Handles the POST request to create a new event.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addEvent = async (req, res) => {
    const { name, date, ticketsAvailable } = req.body;

    // Basic input validation
    if (!name || !date || ticketsAvailable === undefined) {
        return res.status(400).json({ message: 'Invalid input. Name, date, and ticketsAvailable are required.' }); // [cite: 132]
    }

    try {
        const newEvent = { name, date, ticketsAvailable: parseInt(ticketsAvailable, 10) };
        const result = await createEvent(newEvent);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating event.', error: error.message }); // [cite: 132]
    }
};

module.exports = { addEvent };