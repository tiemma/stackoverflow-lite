/* eslint-disable no-undef */
import { use, request, should } from 'chai';
import chaiHTTP from 'chai-http';
import server from '../app';

use(chaiHTTP);

describe('Questions', (done) => {
  it('Fetch all questions should return with a json object, status 200', () => {
    request(server)
      .get('/questions')
      .end((err, res) => {
        JSON.stringify(res);
        res.should.have.status(200);
        done();
      });
  });
  it('Fetch all questions should return with 200');
});
