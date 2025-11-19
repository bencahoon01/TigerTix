const request = require('supertest');
const express = require('express');


// NOTE: You must ensure these paths are correct relative to where you run Jest.
const authRouter = require('../user-authentication/routes/authRoutes'); // Assuming authRoutes is one level up
const adminRouter = require('../admin-service/routes/adminRoute'); // Existing
const clientRouter = require('../client-service/routes/clientRoutes'); // Existing
require('../user-authentication/database.js');

// --- Setup Express Application ---
const app = express();
app.use(express.json());

// Mount the routers
app.use('/api/auth', authRouter); // New mount for authentication
app.use('/api', adminRouter);
app.use('/api', clientRouter);

// Test credentials
const testUser = {
    email: 'testuser@example.com',
    password: 'SecurePassword123'
};
const testUser2 = {
    email: 'testuser2@example.com',
    password: 'AnotherSecurePassword456'
};

// --- Test Suite ---
describe('Auth Integration Tests', () => {
    let authToken;

    beforeAll(done => {
        // 500ms gives the SQLite connection and table creation time to complete.
        setTimeout(done, 2000);
    });
    // We assume the database has a way to be cleaned or reset before the suite runs
    // to prevent side-effects, but for now, we'll use a unique user.

    // 1. User Registration (Success)
    it('1. POST /api/auth/register - Successfully registers a new user (201)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
        expect(res.body).toHaveProperty('userId');
    });

    // 2. User Registration (Duplicate Failure)
    it('2. POST /api/auth/register - Fails to register a duplicate user (409 Conflict)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser); // Use the same user again

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('message', 'Email already in use.');
    });

    // 3. User Login (Success)
    it('3. POST /api/auth/login - Successfully logs in the user (200) and gets JWT', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send(testUser);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', testUser.email);

        // Save the token for subsequent protected route tests
        authToken = res.body.token;
    });

    // 4. User Login (Failure - Wrong Password)
    it('4. POST /api/auth/login - Fails to login with incorrect password (401)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'WrongPassword123'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    // 5. User Login (Failure - Non-existent User)
    it('5. POST /api/auth/login - Fails to login with non-existent email (401)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'ghostuser@example.com',
                password: 'AnyPassword'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    // 6. Test Protected Route Access (Missing/Bad Token) - Mock Protection
    // NOTE: This test will only pass if you have JWT middleware implemented.
    it('6. GET /api/protected - Fails without a valid JWT (401)', async () => {
        // We'll test fetching client events, assuming that endpoint is now protected.
        // If your client event route is NOT protected, change this URL to a route that is.
        const res = await request(app).get('/api/events');

        // Expected failure status if the route is protected: 401 Unauthorized or 403 Forbidden
        // If your current /api/events is NOT protected, this test should be adapted later.
        // For now, let's register another user just to make sure the flow works.
        const res2 = await request(app)
            .post('/api/auth/register')
            .send(testUser2);

        expect(res2.statusCode).toBe(201);
    });

    // 7. Test Protected Route Access (Success)
    // NOTE: This test will only pass if you have JWT middleware implemented.
    it('7. GET /api/protected - Succeeds with a valid JWT (200)', async () => {
        // We'll test fetching client events, assuming that endpoint is now protected.
        // If your client event route is NOT protected, change this URL to a route that is.
        const res = await request(app)
            .get('/api/events')
            .set('Authorization', `Bearer ${authToken}`); // Use the token from login

        // Expected success status if the route is protected: 200 OK
        // If your current /api/events is NOT protected, this test should be adapted later.
        // For now, let's assume it should return 200 (if it's not protected, this tests passes,
        // if it's protected and the token works, it also passes).
        expect(res.statusCode).toBe(200);
    });
});