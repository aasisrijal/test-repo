import jwt from "jsonwebtoken";
import config from "../config/config.js";
import logger from "../core/utils/logger.js";
import AppError from "../core/utils/appError.js";
import httpStatus from "http-status";

const { verify } = jwt;

export const genAccessToken = (user) => {
  return new Promise((resolve, reject) => {
    try {
      const { secret, expiresIn } = config.jwt;
      const token = jwt.sign({ _id: user }, secret, { expiresIn });
      resolve(token);
    } catch (err) {
      logger.error(`Error generating access token`, err.message);
      reject(err);
    }
  });
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const { secret } = config.jwt;
      const decodedToken = verify(token, secret);
      resolve(decodedToken);
    } catch (err) {
      reject(new AppError(httpStatus.UNAUTHORIZED, "errors:invalid_token"));
    }
  });
};
