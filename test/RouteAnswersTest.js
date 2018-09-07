/* eslint-disable no-undef */
import {
  use, request, expect,
} from 'chai';
import jwt from 'jsonwebtoken';
import { title, description } from 'casual';
import chaiHTTP from 'chai-http';
import server from '../app';
import Config from '../config';

use(chaiHTTP);

const API_PREFIX = '/api/v1';
const token = jwt.sign({
  id: 1,
}, Config('development').KEY, { expiresIn: 60 * 60 });
const payload = {
  description,
  headline: title,
  user_id: 1,
};

describe('Test Answers', () => {

  it('Submit an answer to an existent question, return 201', (done) => {
    request(server)
      .post(`${API_PREFIX}/questions/1/answers`)
      .send(payload)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(Object.keys(res.body)).to.have.contains('data');
        expect(Object.keys(res.body)).to.have.contains('success');
        done();
      });
  });


  it('Submit an answer to the question you\'ve answered', (done) => {
    setTimeout(() => {
      request(server)
        .post(`${API_PREFIX}/questions/1/answers`)
        .send(payload)
        .set('x-access-token', token)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(Object.keys(res.body)).to.have.contains('error');
          expect(res.body.error).to.have.equals('You can\'t answer a question twice');
          done();
        });
    }, 1000);
  });


  it('Then fetch all answer counts, return 200 and should have count and success objects', (done) => {
    request(server)
      .post(`${API_PREFIX}/answers/all/count`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.keys(res.body)).to.have.contains('success');
        expect(Object.keys(res.body)).to.have.contains('data');
        expect(parseInt(res.body.data.count)).equals(1);
        done();
      });
  });

  it('Submit an answer to the non-existent question', (done) => {
    request(server)
      .post(`${API_PREFIX}/questions/1000/answers`)
      .send(payload)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(Object.keys(res.body)).to.have.contains('error');
        expect(res.body.error).to.have.equals('You can\'t create an answer for a non-existent question');
        done();
      });
  });
});
