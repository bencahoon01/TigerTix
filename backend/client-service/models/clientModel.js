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
// Get all events
const getEvents = (callback) => {
    db.all('SELECT * FROM events', [], callback);
};

// Update ticket count
const updateTicketCount = (eventId, callback) => {
    db.run(
        'UPDATE events SET available_tickets = available_tickets - 1 WHERE id = ?',
        [eventId],
        callback
    );
};


module.exports = { getEvents, updateTicketCount };