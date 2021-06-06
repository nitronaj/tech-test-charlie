import { server } from '..';
import request from 'supertest';
import { expect } from 'chai';
import { USERS } from '../userLogins';

describe('express', function () {
  after(() => {
    server.close();
  });

  it('should respond with 200 for /status', async () => {
    const res = await request(server).get('/status');
    expect(res.statusCode).to.equal(200);
  });

  it('should respond with 404 with non-existant routes', function testPath(done) {
    request(server).get('/non-existant-path').expect(404, done);
  });

  describe('basic auth tests', async () => {
    it('should respond with 200 when called with valid Authorization header value', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set(
          'Authorization',
          'Basic: bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ=='
        );
      expect(res.statusCode).to.equal(200);
    });

    it('should reject with 401 on wrong credentials', async () => {
      const userPass = ['test@gmail.com', '123456'];
      const base64UserPass = Buffer.from(userPass.join(':')).toString('base64');

      const res = await request(server)
        .get('/basic-auth')
        .set('Authorization', `Basic: ${base64UserPass}`);
      expect(res.statusCode).to.equal(401);
    });

    it('should reject with 401 on short credentials', async () => {
      const [{ userLogin, password }] = USERS.users;

      const res = await request(server)
        .get('/basic-auth')
        .auth(userLogin, password.slice(0, password.length / 2));
      expect(res.statusCode).to.equal(401);
    });

    it('should reject with 401 when called with invalid Authorization header value', async () => {
      const res = await request(server)
        .get('/basic-auth')
        .set('Authorization', 'Basic: abcd');
      expect(res.statusCode).to.equal(401);
    });

    it('should respond with 401 when called with no Authorization header value', async () => {
      const res = await request(server).get('/basic-auth');

      expect(res.statusCode).to.equal(401);
    });
  });
});
