class NullError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NullError);
  }
}

class NotImplementedError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NotImplementedError);
  }
}

class SQLExecError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, SQLExecError);
  }
}

class InternalServerError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, InternalServerError);
  }
}

export { NullError, NotImplementedError, SQLExecError, InternalServerError };
