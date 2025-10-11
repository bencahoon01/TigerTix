const AdminModel = require('../models/adminModel.js');

/**
 * Handles the POST request to create a new event.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addEvent = async (req, res) => {
    const { name, date, ticketsAvailable } = req.body || {};

    // Input validation
    const errors = [];
    if (typeof name !== 'string' || name.trim().length === 0) {
        errors.push('name is required and must be a non-empty string ');
    }
    // Validate date: must be a valid date string
    const parsedDate = new Date(date);
    if (!date || isNaN(parsedDate.getTime())) {
        errors.push('date is required and must be a valid date string');
    }
    // Validate ticketsAvailable: integer >= 0
    const tickets = Number.isInteger(ticketsAvailable)
        ? ticketsAvailable
        : parseInt(ticketsAvailable, 10);
    if (!Number.isFinite(tickets) || !Number.isInteger(tickets) || tickets < 0) {
        errors.push('ticketsAvailable is required and must be an integer >= 0 ');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Invalid input.', errors });
    }

    try {
        const newEvent = { name: name.trim(), date, ticketsAvailable: tickets };
        const result = await AdminModel.createEvent(newEvent);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Server error while creating event.', error: error.message });
    }
};

module.exports = { addEvent };

