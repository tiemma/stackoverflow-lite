
// eslint-disable-next-line no-undef
import { assert, expect } from 'chai';
import Model from '../server/models/model';

describe('Run Model', () => {
  it('Direct instance of the model should throw an Error', (done) => {
    assert.throws(Model.returnInstance, Error, 'Table name must be defined');
    done();
  });
});
