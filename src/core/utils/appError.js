// centralized error object that derives from Node’s Error
export default class AppError extends Error {
  constructor(httpCode, description, isOperational = true) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
