const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../shared-db/database.sqlite');

// Delete existing database if it exists
if (fs.existsSync(dbPath)) {
    try {
        fs.unlinkSync(dbPath);
        console.log('Deleted existing database at:', dbPath);
    } catch (err) {
        if (err.code === 'EBUSY' || err.code === 'EPERM') {
            console.error('✗ Cannot delete database: file is currently in use');
            console.error('  Please stop all running servers first:');
            console.error('  1. Press Ctrl+C in the terminal running npm start');
            console.error('  2. Close any database viewers (like DB Browser)');
            console.error('  3. Then run this command again');
            process.exit(1);
        } else {
            throw err;
        }
    }
} else {
    console.log('ℹ No database found to delete');
}