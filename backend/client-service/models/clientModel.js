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
 * Decrements the available ticket count for an event by a specified amount.
 * @param {number} eventId - The ID of the event to update.
 * @param {number} amount - The number of tickets to purchase.
 * @param {function(Error)} callback - Callback called when the update finishes.
 */
const updateTicketCount = (eventId, amount, callback) => {
    db.run(
        'UPDATE events SET ticketsAvailable = ticketsAvailable - ? WHERE id = ?',
        [amount, eventId],
        callback
    );
};

/**
 * Retrieves a single event by title from the database.
 * @param {string} title - The event title to look up.
 * @param {function(Error, object)} callback - Callback with error and event data.
 */
const getEventByTitle = (title, callback) => {
    // Normalize title: trim and lowercase
    const normalizedTitle = title.trim().toLowerCase();
    db.get('SELECT * FROM events WHERE LOWER(TRIM(name)) = ?', [normalizedTitle], callback);
};

module.exports = { getEvents, updateTicketCount, getEventByTitle };