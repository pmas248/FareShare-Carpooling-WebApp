const request = require('supertest');
const http = require('http');
const app = require('../server');

let server;
beforeAll(done => {
  // spin up a real HTTP server on an ephemeral port
  server = http.createServer(app).listen(0, done);
});
afterAll(done => {
  server.close(done);
});
describe('Server Health & Startup', () => {
  it('should respond 200 on GET /health', async () => {
    const res = await request(server).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
