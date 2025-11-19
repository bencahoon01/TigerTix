const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const sqlPath = path.resolve(__dirname, 'init.sql');

// Delete existing database
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✓ Deleted existing database');
}

// Create new database and initialize
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }
    console.log('✓ Created new database');
});

// Read and execute init.sql
const sql = fs.readFileSync(sqlPath, 'utf8');

db.exec(sql, (err) => {
    if (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
    console.log('✓ Database initialized successfully');
    
    // Verify tables
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('Error listing tables:', err);
        } else {
            console.log('✓ Tables created:', tables.map(t => t.name).join(', '));
        }
        
        // Verify events
        db.all('SELECT COUNT(*) as count FROM events', (err, result) => {
            if (err) {
                console.error('Error counting events:', err);
            } else {
                console.log(`✓ ${result[0].count} events added`);
            }
            
            db.close();
        });
    });
});
