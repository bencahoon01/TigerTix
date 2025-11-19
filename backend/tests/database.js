/**
 * This is a minimal mock implementation for the database connection
 * to allow the authController unit tests to run without
 * needing a real SQLite database.
 * * The actual functions (run, get) are fully mocked in authController.test.js.
 */
module.exports = {
    run: (sql, params, callback) => {
        // This function is mocked in the test file, so this body is unused.
        console.warn("Database.run was called in the actual file, not the mock.");
    },
    get: (sql, params, callback) => {
        // This function is mocked in the test file, so this body is unused.
        console.warn("Database.get was called in the actual file, not the mock.");
    },
    // Add other required methods (like all, close, etc.) if needed by the controller
};