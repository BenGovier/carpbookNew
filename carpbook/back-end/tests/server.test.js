const request = require('supertest');
const app = require('../server'); // Adjust this path if your main server file is named differently

describe('Server', () => {
  it('should respond with 200 for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});