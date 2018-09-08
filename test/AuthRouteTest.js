import {
  use, request, expect,
} from 'chai';
import chaiHTTP from 'chai-http';
import { word, title } from 'casual';
import server from '../server/app';

use(chaiHTTP);

const API_PREFIX = '/api/v1';
const payload = {
  name: title,
  username: word,
  password: word,
};
let token = null;

// eslint-disable-next-line no-undef
describe('Auth', () => {
  it('User should be able to access login api without a token', (done) => {
    request(server)
      .get(`${API_PREFIX}/auth/login`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('User should be able to access register api without a token', (done) => {
    request(server)
      .get(`${API_PREFIX}/auth/register`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('All APIs except auth are not accessible without a token', (done) => {
    request(server)
      .get(`${API_PREFIX}/random/endpoint`)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('User should be able to register, should return 201 and have a token with user details', (done) => {
    request(server)
      .post(`${API_PREFIX}/auth/register`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(Object.keys(res.body)).to.have.contains('token');
        expect(Object.keys(res.body)).to.have.contains('auth');
        expect(Object.keys(res.body)).to.have.contains('user');
        expect(res.body.auth).equals(true);
        expect(res.body.token).to.not.equals(null);
        expect(res.body.user.username).equals(payload.username);
        expect(res.body.user.name).equals(payload.name);
        expect(res.body.user.id).greaterThan(0);
        token = res.body.token;
        done();
      });
  });

  it('User should be not be able to register twice, should return 409 and an error', (done) => {
    request(server)
      .post(`${API_PREFIX}/auth/register`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(Object.keys(res.body)).to.have.contains('error');
        expect(res.body.error).equals("You've already registered, kindly login");
        done();
      });
  });

  it('User should be able to access apis after registering with token, should not return 403', (verify) => {
    request(server)
      .get(`${API_PREFIX}/questions`)
      .set('x-access-token', token)
      .end((error, resp) => {
        expect(resp).to.not.have.status(403);
        verify();
      });
  });

  it('User should be able to login after registering with correct details, should return 200 and have a token with user details', (done) => {
    request(server)
      .post(`${API_PREFIX}/auth/login`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.keys(res.body)).to.have.contains('token');
        expect(Object.keys(res.body)).to.have.contains('auth');
        expect(Object.keys(res.body)).to.have.contains('user');
        expect(res.body.auth).equals(true);
        expect(res.body.token).to.not.equals(null);
        expect(res.body.user.username).equals(payload.username);
        expect(res.body.user.name).equals(payload.name);
        expect(res.body.user.id).greaterThan(0);
        token = res.body.token;
        done();
      });
  });

  it('User should be able to access apis after login with token, should not return 403', (done) => {
    request(server)
      .get(`${API_PREFIX}/questions`)
      .set('x-access-token', token)
      .end((error, resp) => {
        expect(resp).to.not.have.status(403);
        done();
      });
  });

  it('User should not be able to login with a correct username but incorrect password, should return 404 and have an error message', (done) => {
    payload.password = 'cannotBeACorrectPassword';
    request(server)
      .post(`${API_PREFIX}/auth/login`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(Object.keys(res.body)).to.have.contains('error');
        expect(res.body.error).equals('Username or password combination is incorrect');
        done();
      });
  });

  it('User should not be able to login with an incorrect username, should return 404 and have an error message', (done) => {
    payload.username = 'cannotExist';
    request(server)
      .post(`${API_PREFIX}/auth/login`)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(Object.keys(res.body)).to.have.contains('error');
        expect(res.body.error).equals('Username does not exist');
        done();
      });
  });
});
