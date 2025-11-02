const ClientModel = require('../models/clientModel.js');

/**
 * GET /api/events
 * Returns all events for clients to view.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {JSON} 200 with list of events, or 500 with error message.
 */
const getEvents = async (req, res) => {
    try {
        ClientModel.getEvents((err, rows) => {
            if (err) {
                return res.status(500).json({ message: 'Server error while fetching events.', error: err.message });
            }
            return res.status(200).json(rows || []);
        });
    } catch (error) {
        return res.status(500).json({ message: 'Unexpected server error.', error: error.message });
    }
};

/**
 * POST /api/events/:id/purchase
 * Decrements the available tickets for a specific event to simulate a purchase.
 * @param {object} req - Express request object, expects req.params.id as event ID.
 * @param {object} res - Express response object.
 * @returns {JSON} 200 with success message, 400 if invalid ID, or 500 with error message.
 */
const updateTicketCount = async (req, res) => {
    const idRaw = req.params.id;
    const id = parseInt(idRaw, 10);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid event id. It must be a positive integer.' });
    }

    try {
            ClientModel.updateTicketCount(id, function (err) {
                if (err) {
                    console.error(`Error updating ticket count for event ${id}:`, err.message);
                    return res.status(500).json({ message: 'Server error while updating ticket count.', error: err.message });
                }
                // 'this' is the statement context in sqlite3, contains changes property
                console.log(`Ticket purchase attempted for event ${id}. Rows affected: ${this.changes}`);
                return res.status(200).json({ message: 'Ticket purchased successfully.' });
            });
    } catch (error) {
        return res.status(500).json({ message: 'Unexpected server error.', error: error.message });
    }
};

module.exports = { getEvents, updateTicketCount };


