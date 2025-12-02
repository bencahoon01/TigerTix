const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const sqlPath = path.join(__dirname, 'init.sql');

const db = new sqlite3.Database(dbPath);
const sql = fs.readFileSync(sqlPath, 'utf8');

db.exec(sql, (err) => {
    if (err) {
        console.error('Error initializing database:', err);
    } else {
        console.log('Database initialized successfully!');
    }
    db.close();
});
