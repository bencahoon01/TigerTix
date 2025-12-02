
// Mock external dependencies before importing the main app file
// 1. Mock the 'openai' package
const mockCreate = jest.fn();
jest.mock('openai', () => {
    return jest.fn(() => ({
        chat: {
            completions: {
                create: mockCreate,
            },
        },
    }));
});

// 2. Mock global.fetch to simulate the CLIENT_SERVICE_URL response
const mockEvents = [
    { id: 'e1', name: 'The Great Gatsby Musical', date: '2025-12-10' },
    { id: 'e2', name: 'Tech Conference 2026', date: '2026-03-01' },
    { id: 'e3', name: 'Taylor Swift Tribute Night', date: '2025-11-29' },
];

// Helper to create a mock fetch response object
const mockFetchResponse = (data, status = 200, ok = true) => ({
    ok: ok,
    status: status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
});

global.fetch = jest.fn(() => Promise.resolve(mockFetchResponse(mockEvents)));

// Import the main app (after mocks are set up)
const request = require('supertest');
const app = require('../llm-service/index'); // Assuming your LLM service file is named 'llm_service.js'

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockImplementation(() => Promise.resolve(mockFetchResponse(mockEvents)));
});


describe('LLM Service /api/chat Integration Tests', () => {

    test('1. Successful LLM function call for booking (explicit amount)', async () => {
        // Mock the LLM to return a function call
        const eventName = 'Great Gatsby';
        const amount = 3;
        const mockLLMResponse = {
            choices: [{
                message: {
                    tool_calls: [{
                        function: {
                            name: 'propose_booking',
                            arguments: JSON.stringify({ eventName: eventName, amount: amount }),
                        },
                    }],
                },
            }],
        };
        mockCreate.mockResolvedValue(mockLLMResponse);

        // Act
        const response = await request(app)
            .post('/api/chat')
            .send({ message: `I want to book ${amount} tickets for the ${eventName} show.` })
            .expect(200);

        // Assert
        expect(response.body.action).toBe('propose_booking');
        expect(response.body.amount).toBe(amount);
        expect(response.body.eventName).toBe('The Great Gatsby Musical');
        expect(response.body.eventId).toBe('e1');
    });


    test('2. Fails to fetch events from client-service', async () => {
        // Arrange: Mock global.fetch to return a non-OK response
        global.fetch.mockImplementationOnce(() => Promise.resolve(mockFetchResponse({}, 503, false)));

        // Act & Assert
        await request(app)
            .post('/api/chat')
            .send({ message: 'Book me a ticket.' })
            .expect(500) // EXPECT 500 STATUS CODE
            .expect(res => {
                expect(res.body.error).toBe('Failed to get response from LLM.');
            });
    });



    test('3. Robust matching: Event name contains non-word characters', async () => {
        // Mock the LLM to return a function call with a slightly malformed name
        const eventName = 'Taylor Swift';
        const mockLLMResponse = {
            choices: [{
                message: {
                    tool_calls: [{
                        function: {
                            name: 'propose_booking',
                            arguments: JSON.stringify({ eventName: eventName, amount: 1 }),
                        },
                    }],
                },
            }],
        };
        mockCreate.mockResolvedValue(mockLLMResponse);

        // Act
        const response = await request(app)
            .post('/api/chat')
            .send({ message: `I want 1 ticket for ${eventName}!` })
            .expect(200);

        // Assert: Ensure it matches 'Taylor Swift Tribute Night'
        expect(response.body.eventName).toBe('Taylor Swift Tribute Night');
        expect(response.body.eventId).toBe('e3');
    });
});