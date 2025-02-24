import request from 'supertest';
import app, { dbReady } from '../src/app';

beforeAll(async () => {
  await dbReady;
});

describe('URL Shortener API Integration Tests', () => {
  describe('POST /shorten', () => {
    it('should return a shortened URL when provided with a valid long URL and valid authentication', async () => {
      // The JWT token has to be working
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NDAzODQzNTUsImV4cCI6MTc0MDM4Nzk1NX0._Is985XaV4KUdrNiK7qCHzA8GS1v1-c1W91dxgC8GLo';
      const response = await request(app)
        .post('/shorten')
        .set('Authorization', `Bearer ${token}`)
        .send({ originalUrl: 'https://www.example.com' });
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('shortUrl');
    });

    it.todo('should return an error for an invalid URL');
    it.todo('should return 401 if Authorization header is missing');
    it.todo('should return 401 if token is invalid');
  });

  describe('GET /:shortUrl', () => {
    it.todo('should redirect to the original URL when the short code exists');
    it.todo('should return 404 when the short code does not exist');
    it.todo('should log analytics data when a redirect occurs');
  });

  describe('User Authentication Endpoints', () => {
    it.todo('should register a new user successfully');
    it.todo('should not register a user with duplicate username');
    it.todo('should log in an existing user and return a token');
    it.todo('should return 400 if required fields are missing during registration');
    it.todo('should return 400 if required fields are missing during login');
  });

  describe('Admin Analytics Endpoints', () => {
    it.todo('should restrict access to non-admin users');
    it.todo('should return analytics data for admin requests');
    it.todo('should return 401 when admin token is missing');
    it.todo('should return 403 for valid token but non-admin user');
  });
});
