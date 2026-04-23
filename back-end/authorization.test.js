'use strict';

// Set required env vars before loading any modules
process.env.JWT_SECRET = 'test-secret-key-for-unit-tests';
process.env.NODE_ENV = 'test';

const express    = require('express');
const bodyParser = require('body-parser');
const supertest  = require('supertest');
const bcrypt     = require('bcryptjs');

// --- Mock the User model before requiring authorization ---
const mockUser = {
  findOne: jest.fn(),
};

// Constructor mock: instances have a save() method
function MockUserConstructor(data) {
  Object.assign(this, data);
  this._id = 'mock-id-123';
}
MockUserConstructor.findOne = mockUser.findOne;
MockUserConstructor.prototype.save = jest.fn();

jest.mock('./models/user.js', () => MockUserConstructor);

// Require after mocking
const authRouter = require('./authorization');

// Build a minimal express app for testing
function buildApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use('/authorization', authRouter);
  return app;
}

// Helper: create a bcrypt hash synchronously-ish
async function hashPassword(pw) {
  return bcrypt.hash(pw, 10);
}

describe('POST /authorization/sign-up', () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
  });

  it('returns 400 when email is missing', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ password: 'Password1' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 when password is missing', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: 'user@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 for an invalid email format', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: 'not-an-email', password: 'Password1' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Invalid email format.');
  });

  it('returns 400 when password is too short', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: 'user@example.com', password: 'Abc1' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Password must be at least 8 characters long.');
  });

  it('returns 400 when password has no number', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: 'user@example.com', password: 'NoNumber!' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Password must contain at least one number.');
  });

  it('returns 400 when password has no letter', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: 'user@example.com', password: '12345678' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Password must contain at least one lowercase letter.');
  });

  it('returns 409 when email already exists', async () => {
    MockUserConstructor.findOne.mockResolvedValueOnce({ email: 'user@example.com' });
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: 'user@example.com', password: 'Password1!' });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('returns 200 and a token on successful registration', async () => {
    MockUserConstructor.findOne.mockResolvedValueOnce(null);
    MockUserConstructor.prototype.save.mockResolvedValueOnce({ _id: 'mock-id-123' });

    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: 'new@example.com', password: 'Password1!', firstName: 'Jane', lastName: 'Doe' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 400 for non-string input (NoSQL injection guard)', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-up')
      .send({ email: { $gt: '' }, password: 'Password1' });
    expect(res.status).toBe(400);
  });
});

describe('POST /authorization/sign-in', () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
  });

  it('returns 400 when email is missing', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-in')
      .send({ password: 'Password1' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 when password is missing', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-in')
      .send({ email: 'user@example.com' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 401 when user is not found', async () => {
    MockUserConstructor.findOne.mockResolvedValueOnce(null);
    const res = await supertest(app)
      .post('/authorization/sign-in')
      .send({ email: 'notfound@example.com', password: 'Password1' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('returns 401 when password does not match', async () => {
    const hashedPw = await hashPassword('CorrectPassword1');
    MockUserConstructor.findOne.mockResolvedValueOnce({ _id: 'mock-id', password: hashedPw });
    const res = await supertest(app)
      .post('/authorization/sign-in')
      .send({ email: 'user@example.com', password: 'WrongPassword1' });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid email or password/i);
  });

  it('returns 200 and a token on successful sign-in', async () => {
    const hashedPw = await hashPassword('Password1');
    MockUserConstructor.findOne.mockResolvedValueOnce({ _id: 'mock-id', password: hashedPw });
    const res = await supertest(app)
      .post('/authorization/sign-in')
      .send({ email: 'user@example.com', password: 'Password1' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 400 for non-string input (NoSQL injection guard)', async () => {
    const res = await supertest(app)
      .post('/authorization/sign-in')
      .send({ email: { $gt: '' }, password: 'Password1' });
    expect(res.status).toBe(400);
  });
});
