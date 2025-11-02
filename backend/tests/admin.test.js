const AdminModel = require('../admin-service/models/adminModel.js');

describe('AdminModel.createEvent', () => {

    it('should create a valid event', async () => {
        const newEvent = { name: 'Test Concert', date: '2025-12-15', ticketsAvailable: 100 };

        const result = await AdminModel.createEvent(newEvent);

        // The function should return the inserted event with an ID
        expect(result).toHaveProperty('id');
        expect(result.name).toBe(newEvent.name);
        expect(result.date).toBe(newEvent.date);
        expect(result.ticketsAvailable).toBe(newEvent.ticketsAvailable);
    });

});
