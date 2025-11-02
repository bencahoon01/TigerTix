const ClientModel = require('../client-service/models/clientModel.js');
const clientController = require('../client-service/controllers/clientController.js');

jest.mock('../client-service/models/clientModel.js'); // Mock DB for controller tests

describe('Client Service', () => {

    describe('ClientModel', () => {
        it('should fetch all events', done => {
            ClientModel.getEvents.mockImplementation((cb) => cb(null, [{ id: 1, name: 'Test Event' }]));
            ClientModel.getEvents((err, events) => {
                expect(err).toBeNull();
                expect(Array.isArray(events)).toBe(true);
                expect(events[0]).toHaveProperty('name');
                done();
            });
        });

        it('should fetch an event by title', done => {
            const mockEvent = { id: 1, name: 'Test Event' };
            ClientModel.getEventByTitle.mockImplementation((title, cb) => cb(null, mockEvent));

            ClientModel.getEventByTitle('Test Event', (err, event) => {
                expect(err).toBeNull();
                expect(event.name.toLowerCase()).toBe('test event');
                done();
            });
        });

        it('should update ticket count', done => {
            ClientModel.updateTicketCount.mockImplementation((id, amount, cb) => cb(null));

            ClientModel.updateTicketCount(1, 2, (err) => {
                expect(err).toBeNull();
                done();
            });
        });
    });

    describe('ClientController', () => {
        let res;

        beforeEach(() => {
            res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        });

        it('getEvents returns events', async () => {
            const mockEvents = [{ id: 1, name: 'Test Event', ticketsAvailable: 10 }];
            ClientModel.getEvents.mockImplementation((cb) => cb(null, mockEvents));

            await clientController.getEvents({}, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEvents);
        });

        it('updateTicketCount returns 200 on success', async () => {
            ClientModel.updateTicketCount.mockImplementation((id, amount, cb) => cb(null));

            const req = { params: { id: '1' }, body: { amount: 2 } };
            await clientController.updateTicketCount(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Purchased') }));
        });

        it('lookupEventByTitle returns 404 if not found', async () => {
            ClientModel.getEventByTitle.mockImplementation((title, cb) => cb(null, null));

            const req = { query: { title: 'Nonexistent Event' } };
            await clientController.lookupEventByTitle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Event not found.' }));
        });
    });

});
