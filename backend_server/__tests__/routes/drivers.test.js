// === backend-server/__tests__/routes/drivers.test.js ===
const requestD = require('supertest');
const expressD = require('express');

// Bypass auth
jest.mock('../../middlewares/authMiddleware', () => (req, res, next) => {
  req.user = { uid: 'test-uid' };
  next();
});

// Mock models
const Driver = require('../../models/Driver');
const UserModel = require('../../models/User');
Driver.findOne = jest.fn();
Driver.prototype.save = jest.fn();
UserModel.findOne = jest.fn();

const driverRoutes = require('../../routes/drivers');

describe('routes/drivers.js', () => {
  let app;
  beforeAll(() => {
    app = expressD();
    app.use(expressD.json());
    app.use('/api/drivers', driverRoutes);
  });
  beforeEach(() => jest.clearAllMocks());

  it('returns 404 if user not found', async () => {
    UserModel.findOne.mockResolvedValue(null);
    const res = await requestD(app)
      .post('/api/drivers')
      .set('Authorization', 'Bearer tok')
      .send({ licenseNo: '123', carName: 'Toyota', seats: 4 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('returns 400 if driver exists', async () => {
    UserModel.findOne.mockResolvedValue({ _id: 'u1' });
    Driver.findOne.mockResolvedValue({ _id: 'd1' });

    const res = await requestD(app)
      .post('/api/drivers')
      .set('Authorization', 'Bearer tok')
      .send({ licenseNo: '123', carName: 'Toyota', seats: 4 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Driver profile already exists' });
  });

  it('creates new driver on valid input', async () => {
    const fakeUser = { _id: '122111111111111111111111', save: jest.fn() };
    UserModel.findOne.mockResolvedValue(fakeUser);
    Driver.findOne.mockResolvedValue(null);
    Driver.prototype.save.mockImplementation(function() { return Promise.resolve(this); });

    const payload = { licenseNo: 'NZD98456A', carName: 'Suzuki Swift', seats: 4 };
    const res = await requestD(app)
      .post('/api/drivers')
      .set('Authorization', 'Bearer tok')
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ userID: '122111111111111111111111', ...payload });
    expect(fakeUser.licenseValidated).toBe(true);
    expect(fakeUser.save).toHaveBeenCalled();
  });
});
