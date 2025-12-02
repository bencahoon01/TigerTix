const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const adminRouter = require('../admin-service/routes/adminRoute.js');
const clientRouter = require('../client-service/routes/clientRoutes.js');

const JWT_SECRET = 'random_string_for_jwt_secret';

// Setup express app
const app = express();
app.use(express.json());
app.use('/api', adminRouter);
app.use('/api', clientRouter);

describe('Integration tests', () => {
    let eventId;
    let authToken;

    beforeAll(() => {
        // Create a valid JWT token for admin operations
        authToken = jwt.sign(
            { id: 1, email: 'admin@test.com' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    it('Admin can create an event', async () => {
        const res = await request(app)
            .post('/api/events')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Integration Test Event',
                date: '2025-12-31',
                ticketsAvailable: 50
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        eventId = res.body.id;
    });

    it('Client can fetch events including the new one', async () => {
        const res = await request(app).get('/api/events');
        expect(res.statusCode).toBe(200);
        const event = res.body.find(e => e.id === eventId);
        expect(event).toBeDefined();
        expect(event.name).toBe('Integration Test Event');
    });

    it('Client can purchase tickets', async () => {
        const purchaseRes = await request(app)
            .post(`/api/events/${eventId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ amount: 3 });

        expect(purchaseRes.statusCode).toBe(200);
        expect(purchaseRes.body.message).toContain('Purchased 3 ticket');
    });
});
