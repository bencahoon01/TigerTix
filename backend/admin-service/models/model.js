const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the shared SQLite database
const dbPath = path.resolve(__dirname, '../../shared-db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Admin service connected to the shared database.");
    }
});

/**
 * Inserts a new event into the database.
 * @param {object} event - The event object.
 * @param {string} event.name - The name of the event
 * @param {string} event.date - The date of the event
 * @param {number} event.ticketsAvailable - The number of available tickets
 * @returns {Promise<object>} A promise that resolves with the new event's ID
 */
const createEvent = (event) => {
    return new Promise((resolve, reject) => {
        const { name, date, ticketsAvailable } = event;
        const sql = 'INSERT INTO events (name, date, ticketsAvailable) VALUES (?, ?, ?)';

        db.run(sql, [name, date, ticketsAvailable], function(err) {
            if (err) {
                reject(new Error('Database error: ' + err.message));
            } else {
                // this.lastID is the ID of the newly inserted row
                resolve({ id: this.lastID, ...event });
            }
        });
    });
};

module.exports = { createEvent };