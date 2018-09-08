import { expect, assert } from 'chai';
import {
  InternalServerError, NotImplementedError, NullError, SQLExecError,
} from '../server/errors/error';

const returnMessage = 'This should be the return message';

// eslint-disable-next-line no-undef
describe('Errors', () => {
  it('Null Error should be instance of error and should have the same message', (done) => {
    const nullError = new NullError(returnMessage);
    expect(nullError.message).equals(returnMessage);
    assert.instanceOf(nullError, Error);
    done();
  });

  it('SQLExec Error should be instance of error and should have the same message', (done) => {
    const sqlExecError = new SQLExecError(returnMessage);
    assert.instanceOf(sqlExecError, Error);
    expect(sqlExecError.message).equals(returnMessage);
    done();
  });

  it('NotImplemented Error should be instance of error and should have the same message', (done) => {
    const notImplementedError = new NotImplementedError(returnMessage);
    assert.instanceOf(notImplementedError, Error);
    expect(notImplementedError.message).equals(returnMessage);
    done();
  });

  it('InternalServer Error should be instance of error and should have the same message', (done) => {
    const internalServerError = new InternalServerError(returnMessage);
    assert.instanceOf(internalServerError, Error);
    expect(internalServerError.message).equals(returnMessage);
    done();
  });
});
