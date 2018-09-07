import { expect, assert } from 'chai';
import { NotImplementedError, NullError, SQLExecError } from '../errors/error';

const returnMessage = 'This should be the return message';

// eslint-disable-next-line no-undef
describe('Errors', () => {
  it('User should be able to access apis after login with token, should not return 403', (done) => {
    const nullError = new NullError(returnMessage);
    expect(nullError.message).equals(returnMessage);
    assert.instanceOf(nullError, Error);
    done();
  });

  it('User should be able to access apis after login with token, should not return 403', (done) => {
    const sqlExecError = new SQLExecError(returnMessage);
    assert.instanceOf(sqlExecError, Error);
    expect(sqlExecError.message).equals(returnMessage);
    done();
  });

  it('User should be able to access apis after login with token, should not return 403', (done) => {
    const notImplementedError = new NotImplementedError(returnMessage);
    assert.instanceOf(notImplementedError, Error);
    expect(notImplementedError.message).equals(returnMessage);
    done();
  });
});
