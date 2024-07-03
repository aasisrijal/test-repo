import http from "http";
import app from "./app.js";
import config from "./config/config.js";
import logger from "./core/utils/logger.js";
import errorHandler from "./core/utils/errorHandler.js";
import { db, connectionType } from "./config/db.js";

const { port } = config.app;

db.on("error", logger.error.bind(logger, "MongoDB connection error:"));
db.on("close", () => {
  logger.info("DB connection is closed");
});
db.once("open", () => {
  if (connectionType === "MongoDB URI") {
    logger.info(`Connected to ${connectionType}`);
  } else {
    logger.warn(`Connected to ${connectionType}`);
  }
});

export const server = http.createServer(app);

server.listen(port, () => {
  logger.info(`Application listens on PORT: ${port}`);
});

const exitHandler = () => {
  if (app) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    exitHandler();
  }
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection !!!!!!");
  throw reason;
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
