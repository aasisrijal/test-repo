import httpStatus from "http-status";
import errorHandler from "../utils/errorHandler.js";

// catch all unhandled errors
const errorHandling = (error, req, res) => {
  errorHandler.handleError(error);
  const isTrusted = errorHandler.isTrustedError(error);
  const httpStatusCode = isTrusted
    ? error.httpCode
    : httpStatus.INTERNAL_SERVER_ERROR;
  const responseError = isTrusted
    ? req.t(error.message)
    : req.t("errors:internal_server_error");
  res.status(httpStatusCode).json({
    ok: false,
    message: responseError,
  });
};

export default errorHandling;
