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
}, Config(process.env.NODE_ENV).KEY, { expiresIn: 60 * 60 });
const payload = {
  description,
  headline: title,
  user_id: 1,
};

describe('Begin Questions Tests', () => {
  it('Creates a base question, return 200 and the resulting id for the question', (done) => {
    request(server)
      .post(`${API_PREFIX}/questions`)
      .set('x-access-token', token)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(Object.keys(res.body)).to.have.contains('success');
        expect(Object.keys(res.body)).to.have.contains('data');
        expect(Object.keys(res.body.data)).to.have.contains('id');
        expect(res.body.data.id).equals(1);
        done();
      });
  });

  it('Creates a duplicate question with the same content, return 409 and the resulting error message', (done) => {
    request(server)
      .post(`${API_PREFIX}/questions`)
      .set('x-access-token', token)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(Object.keys(res.body)).to.have.contains('error');
        expect(res.body.error).to.have.equals('You can\'t create a question with the same headline');
        done();
      });
  });

  it('Fetch all questions should return with a json object, status 200', (done) => {
    request(server)
      .get(`${API_PREFIX}/questions`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.keys(res.body)).to.have.contains('questions');
        expect(res.body.questions.length).equals(1);
        done();
      });
  });

  it('Fetch a non existent question and return with 404', (done) => {
    request(server)
      .get(`${API_PREFIX}/questions/1000`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(Object.keys(res.body)).to.have.contains('error');
        done();
      });
  });

  it('Fetch all question counts, return 200 and should have count and success objects', (done) => {
    request(server)
      .post(`${API_PREFIX}/questions/all/count`)
      .set('x-access-token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(Object.keys(res.body)).to.have.contains('success');
        expect(Object.keys(res.body)).to.have.contains('data');
        expect(Object.keys(res.body.data)).to.have.contains('count');
        done();
      });
  });
});
