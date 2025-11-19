// --- 1. MOCK DEPENDENCIES (Explicit Mock Factory for DB) ---

// Create mock functions for the database operations
const mockDbRun = jest.fn();
const mockDbGet = jest.fn();

// CRITICAL FIX: Reverting the path to './database' to solve the 'Received 0 calls' error.
// This assumes the mock file is co-located with the test file, which often causes
// Jest to intercept the dependency require correctly, overriding the controller's path.
jest.mock('../user-authentication/database', () => ({
    run: mockDbRun, // Provide the mock function
    get: mockDbGet, // Provide the mock function
}));

// Mocking bcryptjs methods
const bcrypt = require('bcryptjs');
jest.mock('bcryptjs');

// Mocking jsonwebtoken
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');

// Import the controller last, as it imports the mocked dependencies
const authController = require('../user-authentication/controllers/authController');

// --- 2. SETUP AND CONSTANTS ---

// Mock Express response methods
const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
};

// Constants for test data
const mockEmail = 'test@example.com';
const mockPassword = 'password123';
const mockHashedPassword = 'hashed_password_abc';
const mockToken = 'mock-jwt-token-123';

// --- 3. TEST SUITE: authController ---
describe('authController Unit Tests', () => {

    let req;
    let res;

    beforeEach(() => {
        // Reset mocks and create fresh request/response objects for each test
        jest.clearAllMocks(); // Resets call counts on ALL mocks (including DB mocks)
        res = mockRes();
        req = {
            body: {
                email: mockEmail,
                password: mockPassword
            }
        };

        // Standard mock behavior for common dependencies
        bcrypt.genSaltSync.mockReturnValue('mocked_salt');
        bcrypt.hashSync.mockReturnValue(mockHashedPassword);
        jwt.sign.mockReturnValue(mockToken);
    });

    // --- REGISTER TESTS ---
    describe('register', () => {
        test('1. Successful registration returns 201 Created', async () => {
            // Arrange: Setup the mockDbRun to simulate success
            // The signature is (sql, params, callback)
            mockDbRun.mockImplementationOnce((sql, params, callback) => {
                // Simulate a successful INSERT result by calling the callback
                // The 'this' context is used to pass lastID, so we use .call()
                callback.call({ lastID: 101 }, null);
            });

            // Act
            authController.register(req, res);

            // Assert
            expect(mockDbRun).toHaveBeenCalledTimes(1);
            expect(bcrypt.hashSync).toHaveBeenCalledWith(mockPassword, 'mocked_salt');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                userId: 101
            });
        });

        test('2. Missing email or password returns 400 Bad Request', () => {
            // Arrange: Remove password from the request body
            req.body.password = undefined;

            // Act
            authController.register(req, res);

            // Assert
            expect(mockDbRun).not.toHaveBeenCalled(); // Should fail before hitting the DB
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide email and password' });
        });

        test('3. Duplicate email returns 409 Conflict', () => {
            // Arrange: Setup mockDbRun to simulate a UNIQUE constraint error
            const duplicateError = new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.email');
            duplicateError.message = 'UNIQUE constraint failed: users.email';

            mockDbRun.mockImplementationOnce((sql, params, callback) => {
                callback.call({}, duplicateError);
            });

            // Act
            authController.register(req, res);

            // Assert
            expect(mockDbRun).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use.' });
        });

        test('4. General database error returns 500 Internal Server Error', () => {
            // Arrange: Setup mockDbRun to simulate a general DB failure
            mockDbRun.mockImplementationOnce((sql, params, callback) => {
                callback.call({}, new Error('Generic DB Error'));
            });

            // Act
            authController.register(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error registering user' });
        });
    });

    // --- LOGIN TESTS ---
    describe('login', () => {
        const mockUser = { id: 101, email: mockEmail, password: mockHashedPassword };

        test('5. Successful login returns 200 OK with token and user data', () => {
            // Arrange: Setup mockDbGet to return a user and bcrypt to confirm password match
            // The signature is (sql, params, callback)
            mockDbGet.mockImplementationOnce((sql, params, callback) => {
                callback(null, mockUser);
            });
            bcrypt.compareSync.mockReturnValue(true); // Password match success

            // Act
            authController.login(req, res);

            // Assert
            expect(mockDbGet).toHaveBeenCalledTimes(1);
            expect(bcrypt.compareSync).toHaveBeenCalledWith(mockPassword, mockHashedPassword);
            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                token: mockToken,
                user: { id: mockUser.id, email: mockUser.email }
            });
        });

        test('6. Missing email or password returns 400 Bad Request', () => {
            // Arrange
            req.body.email = undefined;

            // Act
            authController.login(req, res);

            // Assert
            expect(mockDbGet).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Please provide email and password' });
        });

        test('7. User not found returns 401 Unauthorized', () => {
            // Arrange: Setup mockDbGet to return no user
            mockDbGet.mockImplementationOnce((sql, params, callback) => {
                callback(null, null); // user is null
            });

            // Act
            authController.login(req, res);

            // Assert
            expect(mockDbGet).toHaveBeenCalledTimes(1);
            expect(bcrypt.compareSync).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        test('8. Incorrect password returns 401 Unauthorized', () => {
            // Arrange: Setup mockDbGet to return a user, but bcrypt to fail the match
            mockDbGet.mockImplementationOnce((sql, params, callback) => {
                callback(null, mockUser);
            });
            bcrypt.compareSync.mockReturnValue(false); // Password mismatch

            // Act
            authController.login(req, res);

            // Assert
            expect(mockDbGet).toHaveBeenCalledTimes(1);
            expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });

        test('9. General database error during query returns 500 Internal Server Error', () => {
            // Arrange: Setup mockDbGet to simulate a general DB failure
            mockDbGet.mockImplementationOnce((sql, params, callback) => {
                callback(new Error('DB Select Error'), null);
            });

            // Act
            authController.login(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error logging in' });
        });
    });
});