const { searchBeer } = require('./Controllers/searchBeerController'); // Adjust the path if needed
const { getClient } = require('../database');

jest.mock('../database', () => ({
    getClient: jest.fn()
}));

describe('searchBeer Controller', () => {
    let db;

    beforeEach(() => {
        db = {
            collection: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn()
        };

        getClient.mockReturnValue({ db: () => db });
    });

    it('should return beers matching criteria', async () => {
        const mockBeers = [{ Name: 'Beer1', Company: 'Company1' }, { Name: 'Beer2', Company: 'Company2' }];
        db.toArray.mockResolvedValue(mockBeers);

        const req = {
            body: { Name: 'Beer', Company: 'Company1' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await searchBeer(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ beer: mockBeers });
    });

    it('should return error if no beers match', async () => {
        db.toArray.mockResolvedValue([]);

        const req = {
            body: { Name: 'NonexistentBeer' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await searchBeer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "No beers matched with the criteria" });
    });

    it('should handle filters properly', async () => {
        const mockBeers = [{ Name: 'SpecialBeer', Company: 'SpecialCompany' }];
        db.toArray.mockResolvedValue(mockBeers);

        const req = {
            body: { Name: 'Special', Company: 'SpecialCompany' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await searchBeer(req, res);

        expect(db.collection).toHaveBeenCalledWith('Beer');
        expect(db.find).toHaveBeenCalledWith({
            Name: { $regex: 'Special', $options: 'i' },
            Company: { $regex: 'SpecialCompany', $options: 'i' }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ beer: mockBeers });
    });
});
