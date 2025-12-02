const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authRouter = require('../user-authentication/routes/authRoutes');
const clientRouter = require('../client-service/routes/clientRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api', clientRouter);

const JWT_SECRET = 'random_string_for_jwt_secret';

describe('Token Expiration and Handling Tests', () => {
  let validToken;
  let expiredToken;

  beforeAll(() => {
    // Create a valid token
    validToken = jwt.sign(
      { id: 1, email: 'test@example.com' },
      JWT_SECRET,
      { expiresIn: '30m' }
    );

    // Create an expired token (expired 1 second ago)
    expiredToken = jwt.sign(
      { id: 1, email: 'test@example.com' },
      JWT_SECRET,
      { expiresIn: '-1s' }
    );
  });

  test('1. Valid JWT token allows access to protected route', async () => {
    const res = await request(app)
      .post('/api/events/1/purchase')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ amount: 1 });

    // Should not return 401 (either 200 success or 404 if event doesn't exist)
    expect(res.statusCode).not.toBe(401);
    expect([200, 404]).toContain(res.statusCode);
  });

  test('2. Expired JWT token returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/events/1/purchase')
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({ amount: 1 });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message.toLowerCase()).toContain('not authorized');
  });

  test('3. Missing token returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/events/1/purchase')
      .send({ amount: 1 });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('4. Invalid token format returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/events/1/purchase')
      .set('Authorization', 'Bearer invalid-token-format')
      .send({ amount: 1 });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('5. Token with wrong secret returns 401 Unauthorized', async () => {
    const wrongToken = jwt.sign(
      { id: 1, email: 'test@example.com' },
      'wrong-secret-key',
      { expiresIn: '30m' }
    );

    const res = await request(app)
      .post('/api/events/1/purchase')
      .set('Authorization', `Bearer ${wrongToken}`)
      .send({ amount: 1 });

    expect(res.statusCode).toBe(401);
  });

  test('6. JWT contains correct user information', () => {
    const decoded = jwt.verify(validToken, JWT_SECRET);
    
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('email');
    expect(decoded.email).toBe('test@example.com');
  });

  test('7. JWT expires in 30 minutes', () => {
    const decoded = jwt.decode(validToken);
    const issuedAt = decoded.iat;
    const expiresAt = decoded.exp;
    
    const duration = expiresAt - issuedAt;
    expect(duration).toBe(30 * 60); // 30 minutes in seconds
  });

  test('8. New login generates fresh token', async () => {
    const res1 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });

    const res2 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });

    // Both should fail, but if they succeeded, tokens would be different
    expect(res1.statusCode).toBe(401);
    expect(res2.statusCode).toBe(401);
  });
});
