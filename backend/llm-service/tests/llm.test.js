// backend/llm-service/tests/llm.test.js
const request = require('supertest');
const app = require('../index');
const fetchMock = require('jest-fetch-mock');

// Enable fetch mocking
fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
});

describe('LLM Service', () => {
    it('should propose booking for a valid event', async () => {
        // Mock the client-service response
        fetchMock.mockResponseOnce(
            JSON.stringify([
                { id: 1, name: 'Jazz Night' },
                { id: 2, name: 'RockFest' }
            ])
        );

        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'I want 2 tickets for Jazz Night' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('action', 'propose_booking');
        expect(res.body.eventName).toBe('Jazz Night');
        expect(res.body.amount).toBe(2);
    });

    it('should return error for an invalid event', async () => {
        // Mock the client-service response
        fetchMock.mockResponseOnce(
            JSON.stringify([
                { id: 1, name: 'Jazz Night' },
                { id: 2, name: 'RockFest' }
            ])
        );

        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'Book 1 ticket for Unknown Event' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('response');
        expect(res.body.response).toMatch(/could not find a valid event/i);
    });

    it('should handle default ticket amount when not specified', async () => {
        fetchMock.mockResponseOnce(
            JSON.stringify([
                { id: 1, name: 'Jazz Night' },
                { id: 2, name: 'RockFest' }
            ])
        );

        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'Book tickets for RockFest' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('action', 'propose_booking');
        expect(res.body.amount).toBe(1); // default amount
    });
});
