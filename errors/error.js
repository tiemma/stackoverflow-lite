class NullError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NullError);
  }
}

class NotImplementedError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NullError);
  }
}

class SQLExecError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NullError);
  }
}

class InternalServerError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NullError);
  }
}

export { NullError, NotImplementedError, SQLExecError, InternalServerError };
