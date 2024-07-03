import httpStatus from 'http-status';
import {
  changeForgotPassword,
  changePassword,
  getCredentialsUser,
  getFacebookUser,
  getGoogleUser,
  loginService,
  registerService,
  requestForgotPasswordService,
  requestTokenForgotPassword,
  // sendEmailVerification,
  verifyEmailVerification,
} from './auth.service.js';
import asyncWrapper from '../core/utils/asyncWrapper.js';
import { PROVIDER_CREDENTIALS, PROVIDER_FACEBOOK, PROVIDER_GOOGLE } from './auth.constants.js';
import AppError from '../core/utils/appError.js';
import logger from '../core/utils/logger.js';

const login = asyncWrapper(async (req, res) => {
  const authProvider = req.query.provider;
  const token = req.body.token;
  const { email, password } = req.body;
  let userData = {};
  let queryParam = {};

  switch (authProvider) {
    case PROVIDER_GOOGLE:
      userData = await getGoogleUser(token);
      queryParam = { auth_provider_id: userData.auth_provider_id };
      break;

    case PROVIDER_FACEBOOK:
      userData = await getFacebookUser(token);
      queryParam = { auth_provider_id: userData.auth_provider_id };
      break;

    case PROVIDER_CREDENTIALS:
      userData = await getCredentialsUser(email, password);
      queryParam = { email: userData.email };
      break;

    default:
      throw new AppError(httpStatus.UNAUTHORIZED, req.t('errors:invalid_provider'));
  }

  const data = await loginService(queryParam, userData);
  logger.info('User signed successfully');
  res.status(httpStatus.OK).json({ ok: true, message: req.t('success:user_login'), data });
});

const register = asyncWrapper(async (req, res) => {
  const data = await registerService(req.body);
  logger.info('New user registered');
  res.status(httpStatus.CREATED).json({ ok: true, message: req.t('success:user_registered'), data });
});

const requestEmailVerification = asyncWrapper(async (req, res) => {
  const data = await sendEmailVerification(undefined, req.body.email);
  logger.info('Verification email sent');
  if (data) res.status(httpStatus.OK).json({ ok: true, message: req.t('success:verification_mail') });
});

const confirmEmailVerification = asyncWrapper(async (req, res) => {
  const data = await verifyEmailVerification(req.params.token);
  logger.info('Email verified successfully');
  if (data) res.status(httpStatus.OK).json({ ok: true, message: req.t('success:email_verified') });
});

const requestForgotPassword = asyncWrapper(async ({ body: { email } }, res) => {
  const token = await requestForgotPasswordService(email);
  res.status(httpStatus.OK).json({ ok: true, token });
});

const validateForgotPasswordToken = asyncWrapper(async (req, res) => {
  const { token: key, code } = req.body;
  const token = await requestTokenForgotPassword(key, code);
  res.status(httpStatus.OK).json({ ok: true, token });
});

const updateForgotPassword = asyncWrapper(async (req, res) => {
  const { token, password } = req.body;
  await changeForgotPassword(token, password);
  res.status(httpStatus.OK).json({ ok: true, message: req.t('success:password_changed') });
});

const updatePassword = asyncWrapper(async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  await changePassword(oldPassword, newPassword, req.user.email);
  res.status(httpStatus.OK).json({ ok: true, message: req.t('success:password_changed') });
});

export {
  login,
  register,
  requestForgotPassword,
  requestEmailVerification,
  confirmEmailVerification,
  validateForgotPasswordToken,
  updateForgotPassword,
  updatePassword,
};
