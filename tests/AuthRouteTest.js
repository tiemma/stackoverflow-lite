/* eslint-disable no-undef */
import {
  use, request, expect, assert,
} from 'chai';
import chaiHTTP from 'chai-http';
import server from '../app';

use(chaiHTTP);

const API_PREFIX = '/api/v1';

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
});
