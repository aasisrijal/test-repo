import morgan from "morgan";

import config from "../../config/config.js";
import logger from "./logger.js";

const { isProd } = config.app;

morgan.token(
  "message",
  (_req, res) => res.locals.errorMessage || ""
);

const clientRemoteAddr = () => (isProd ? ":remote-addr - " : "");
const successResponseFormat = `${clientRemoteAddr()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${clientRemoteAddr()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (_req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default { successHandler, errorHandler };
