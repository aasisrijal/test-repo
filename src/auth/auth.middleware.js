import AppError from '../core/utils/appError.js';
import asyncWrapper from '../core/utils/asyncWrapper.js';
import logger from '../core/utils/logger.js';
import httpStatus from 'http-status';
import { verifyAccessTokenAndGetUser } from './auth.service.js';

export const verifyToken = asyncWrapper(async (req, res, next) => {
  const { authorization } = req.headers;
  const accessToken = authorization?.split('Bearer ')[1];
  if (!accessToken) throw new AppError(httpStatus.UNAUTHORIZED, 'errors:signed_user_not_found');
  const user = await verifyAccessTokenAndGetUser(accessToken);
  logger.info('Access token validated successfully');
  req.user = user;
  next();
});

