const request = require('supertest');
const { spawn } = require('child_process');

let serverProcess;
const BASE_URL = 'http://localhost:6001';

beforeAll((done) => {
    // Start the client service as a separate process
    serverProcess = spawn('node', ['server.js'], {
        cwd: __dirname + '/../', // adjust if server.js is elsewhere
        shell: true,
        stdio: 'ignore', // or 'inherit' to see logs
    });

    // Wait a moment for the server to start
    setTimeout(done, 2000);
});

afterAll(() => {
    // Kill the server after tests
    serverProcess.kill();
});

describe('Client Service Events', () => {
    it('should fetch all events', async () => {
        const res = await request(BASE_URL).get('/api/events');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new event', async () => {
        const newEvent = { name: 'Test Concert', date: '2025-12-01' };
        const res = await request(BASE_URL).post('/api/events').send(newEvent);
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Test Concert');
    });

    it('should not create an event without a name', async () => {
        const res = await request(BASE_URL).post('/api/events').send({ date: '2025-12-01' });
        expect(res.statusCode).toBe(400);
    });
});
