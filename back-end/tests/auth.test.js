const request = require('supertest');
const bcrypt = require('bcryptjs');

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = '';

const users = [];
let userIdCounter = 1;

class MockUser {
  constructor(data) {
    Object.assign(this, data);
    if (!this._id) {
      this._id = `mock-user-${userIdCounter++}`;
    }
  }

  async save() {
    if (this.password && typeof this.password === 'string' && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    const existingIndex = users.findIndex(user => user._id === this._id);
    if (existingIndex >= 0) {
      Object.assign(users[existingIndex], this);
      return users[existingIndex];
    } else {
      users.push(this);
    }
    return this;
  }

  static async deleteMany() {
    users.length = 0;
  }

  static async findOne(query) {
    if (query.email) {
      return users.find(user => user.email === query.email) || null;
    }

    if (query.resetToken) {
      const minExpiry = query.resetTokenExpiry && query.resetTokenExpiry.$gt;
      return users.find(user => {
        if (user.resetToken !== query.resetToken) {
          return false;
        }
        if (minExpiry) {
          return user.resetTokenExpiry && user.resetTokenExpiry > minExpiry;
        }
        return true;
      }) || null;
    }

    return null;
  }
}

jest.mock('../models/user', () => MockUser);

// Import app components after setting env vars
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authorization = require('../authorization');
const User = require('../models/user');
const { requireAuth } = require('../middleware/auth');

// Create test app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/authorization', authorization);

// Test protected route
app.get('/test-protected', requireAuth, (req, res) => {
  res.status(200).send({ userId: req.userId });
});

describe('Authentication System Tests', () => {

  beforeAll(async () => {});

  afterAll(async () => {});

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('POST /authorization/sign-up', () => {

    it('should successfully create a new user with valid data', async () => {
      const response = await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.firstName).toBe('John');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject signup with weak password', async () => {
      const response = await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'weak',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed.');
      expect(response.body.errors).toContain('Password must be at least 8 characters long.');
    });

    it('should reject signup with invalid email format', async () => {
      const response = await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Invalid email format.');
    });

    it('should reject duplicate email addresses', async () => {
      // Create first user
      await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      // Try to create duplicate
      const response = await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'AnotherPass123!',
          firstName: 'Jane',
          lastName: 'Smith'
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('An account with this email already exists.');
    });

    it('should hash password before storing', async () => {
      await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.password).not.toBe('SecurePass123!');

      // Verify it's a bcrypt hash
      const isValidHash = await bcrypt.compare('SecurePass123!', user.password);
      expect(isValidHash).toBe(true);
    });

    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/authorization/sign-up')
        .send({
          firstName: 'John',
          lastName: 'Doe'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed.');
    });
  });

  describe('POST /authorization/sign-in', () => {

    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });
    });

    it('should successfully sign in with correct credentials', async () => {
      const response = await request(app)
        .post('/authorization/sign-in')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject sign in with wrong password', async () => {
      const response = await request(app)
        .post('/authorization/sign-in')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should reject sign in with non-existent email', async () => {
      const response = await request(app)
        .post('/authorization/sign-in')
        .send({
          email: 'nonexistent@example.com',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should normalize email to lowercase', async () => {
      const response = await request(app)
        .post('/authorization/sign-in')
        .send({
          email: 'TEST@EXAMPLE.COM',
          password: 'SecurePass123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/authorization/sign-in')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation failed.');
    });
  });

  describe('POST /authorization/forgot-password', () => {

    beforeEach(async () => {
      await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });
    });

    it('should generate reset token for existing user', async () => {
      const response = await request(app)
        .post('/authorization/forgot-password')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('resetToken');

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.resetToken).toBeDefined();
      expect(user.resetTokenExpiry).toBeDefined();
    });

    it('should not reveal if email does not exist', async () => {
      const response = await request(app)
        .post('/authorization/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('If an account with that email exists');
    });
  });

  describe('POST /authorization/reset-password', () => {

    let resetToken;

    beforeEach(async () => {
      await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      const forgotResponse = await request(app)
        .post('/authorization/forgot-password')
        .send({
          email: 'test@example.com'
        });

      resetToken = forgotResponse.body.resetToken;
    });

    it('should successfully reset password with valid token', async () => {
      const response = await request(app)
        .post('/authorization/reset-password')
        .send({
          resetToken: resetToken,
          newPassword: 'NewSecurePass456!'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password has been reset successfully.');

      // Verify can sign in with new password
      const signInResponse = await request(app)
        .post('/authorization/sign-in')
        .send({
          email: 'test@example.com',
          password: 'NewSecurePass456!'
        });

      expect(signInResponse.status).toBe(200);
    });

    it('should reject weak new password', async () => {
      const response = await request(app)
        .post('/authorization/reset-password')
        .send({
          resetToken: resetToken,
          newPassword: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password validation failed.');
    });

    it('should reject invalid reset token', async () => {
      const response = await request(app)
        .post('/authorization/reset-password')
        .send({
          resetToken: 'invalid-token',
          newPassword: 'NewSecurePass456!'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid or expired reset token.');
    });
  });

  describe('JWT Token Middleware', () => {

    let validToken;

    beforeEach(async () => {
      const signUpResponse = await request(app)
        .post('/authorization/sign-up')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        });

      validToken = signUpResponse.body.token;
    });

    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/test-protected')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/test-protected');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required.');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/test-protected')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token.');
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/test-protected')
        .set('Authorization', validToken);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required.');
    });
  });

  describe('Password Validation', () => {

    const testCases = [
      { password: 'short', expected: 400, reason: 'too short' },
      { password: 'nouppercase123!', expected: 400, reason: 'no uppercase' },
      { password: 'NOLOWERCASE123!', expected: 400, reason: 'no lowercase' },
      { password: 'NoNumbers!', expected: 400, reason: 'no numbers' },
      { password: 'NoSpecial123', expected: 400, reason: 'no special chars' },
      { password: 'ValidPass123!', expected: 200, reason: 'valid password' }
    ];

    testCases.forEach(({ password, expected, reason }) => {
      it(`should ${expected === 200 ? 'accept' : 'reject'} password: ${reason}`, async () => {
        const response = await request(app)
          .post('/authorization/sign-up')
          .send({
            email: `test-${reason.replace(/\s+/g, '-')}@example.com`,
            password: password,
            firstName: 'Test',
            lastName: 'User'
          });

        expect(response.status).toBe(expected);
      });
    });
  });
});
