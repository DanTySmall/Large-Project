const { loginController } = require('./loginController');
const { getClient } = require('../database');

// Mock database client and utilities
jest.mock('../database', () => ({
    getClient: jest.fn().mockReturnValue({
        db: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn().mockResolvedValue([])
            })
        })
    })
}));

// Mock request and response objects
const createLoginRequest = (body) => ({
    body,
    headers: {
        'Content-Type': 'application/json'
    }
});

const createLoginResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res); // Add this line
    return res;
};

describe('LOGIN', () => {
    describe('logging in', () => {
        describe('given the user exists', () => {
            it('should LOGIN the user', async () => {
                const req = createLoginRequest({ Username: 'cbennett', Password: 'COP4331' });
                const res = createLoginResponse();
                getClient().db().collection().find.mockReturnValueOnce({
                    toArray: jest.fn().mockResolvedValue([{ Username: 'cbennett', Verified: true }])
                });

                await loginController(req, res);

                expect(res.status).toHaveBeenCalledWith(200);
            });
        });

        describe('given the user does not exist', () => {
            it('should return 404 for invalid username or password', async () => {
                const req = createLoginRequest({ Username: 'cben', Password: 'COP4331' });
                const res = createLoginResponse();
                getClient().db().collection().find.mockReturnValueOnce({
                    toArray: jest.fn().mockResolvedValue([])
                });

                await loginController(req, res);

                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Username or Password' });
            });
        });

        describe('given the user is not verified', () => {
            it('should return 401 for unverified account', async () => {
                const req = createLoginRequest({ Username: 'cbennett', Password: 'COP4331' });
                const res = createLoginResponse();
                getClient().db().collection().find.mockReturnValueOnce({
                    toArray: jest.fn().mockResolvedValue([{ Username: 'cbennett', Verified: false }])
                });

                await loginController(req, res);

                expect(res.status).toHaveBeenCalledWith(401);
                expect(res.json).toHaveBeenCalledWith({ error: 'Account has not been verified' });
            });
        });
    });
});
