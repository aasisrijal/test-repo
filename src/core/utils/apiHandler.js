import errorHandler from './errorHandler.js';
import httpStatus from 'http-status';
// import AppError from './appError';

export const handleApiError = (err, res) => {
  console.log(err, 'Api error');
  const isTrusted = errorHandler.isTrustedError(err);
  const message = isTrusted ? (err.message) : ('errors:internal_server_error');
  const httpStatusCode = isTrusted ? (err).httpCode : httpStatus.INTERNAL_SERVER_ERROR;
  return res.status(httpStatusCode).json({
    ok: false,
    message,
  });
};
