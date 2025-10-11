const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the shared SQLite database
const dbPath = path.resolve(__dirname, '../../shared-db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Client service connected to the shared database.");
    }
});
/**
 * Retrieves all events from the database.
 * @param {function(Error, Array<object>)} callback - Callback with error and event data.
 */
const getEvents = (callback) => {
    db.all('SELECT * FROM events', [], callback);
};

/**
 * Decrements the available ticket count for an event.
 * @param {number} eventId - The ID of the event to update.
 * @param {function(Error)} callback - Callback called when the update finishes.
 */
const updateTicketCount = (eventId, callback) => {
    db.run(
        'UPDATE events SET ticketsAvailable = ticketsAvailable - 1 WHERE id = ?',
        [eventId],
        callback
    );
};


module.exports = { getEvents, updateTicketCount };