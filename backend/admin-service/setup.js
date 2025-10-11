const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../shared-db/database.sqlite');
const db = new sqlite3.Database(dbPath);

const schema = fs.readFileSync(path.resolve(__dirname, '../shared-db/init.sql'), 'utf8');

db.serialize(() => {
    console.log('Database Serialized successfully.');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Failed to apply schema:', err.message);
        } else {
            console.log('Database tables created successfully.');
        }
    });
});

db.close();