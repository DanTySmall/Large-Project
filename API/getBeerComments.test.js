const { getBeerComments } = require('./Controllers/getBeerCommentsController');
const { getClient } = require('../database');
const { ObjectId } = require('mongodb'); // Make sure this matches how you're importing ObjectId

// Mock the getClient function to return a mock database client
jest.mock('../database', () => ({
    getClient: jest.fn()
}));

// Mock the ObjectId function
jest.mock('mongodb', () => ({
    ObjectId: {
        createFromHexString: jest.fn()
    }
}));

describe('GET BEER COMMENTS', () => {
    let req, res;
    let mockDb;

    beforeEach(() => {
        // Create a mock response object
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Create a mock request object
        req = {
            query: {
                _id: 'mockId'
            }
        };

        // Create a mock database
        mockDb = {
            collection: jest.fn().mockReturnValue({
                aggregate: jest.fn().mockReturnValue({
                    toArray: jest.fn()
                })
            })
        };

        // Mock the getClient function to return the mock database
        getClient.mockReturnValue({ db: () => mockDb });
        
        // Mock the ObjectId function
        ObjectId.createFromHexString.mockImplementation(id => ({ _id: id }));
    });

    it('should return comments if found', async () => {
        // Set up the mock data
        mockDb.collection().aggregate().toArray.mockResolvedValue([
            { comments: [{ text: 'Great beer!' }, { text: 'Not bad.' }] }
        ]);

        // Call the function
        await getBeerComments(req, res);

        // Check the response
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ comments: [{ text: 'Great beer!' }, { text: 'Not bad.' }] });
    });

    it('should return an error if no comments are found', async () => {
        // Set up the mock data
        mockDb.collection().aggregate().toArray.mockResolvedValue([]);

        // Call the function
        await getBeerComments(req, res);

        // Check the response
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Comments could not be retrieved." });
    });
});
