import AppError from "./appError.js";
import logger from "./logger.js";

class ErrorHandler {
  handleError(error) {
    logger.error(error);
  }

  isTrustedError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}

export default new ErrorHandler();
