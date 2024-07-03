import { Router } from 'express';
import {
  confirmEmailVerification,
  login,
  register,
  requestEmailVerification,
  requestForgotPassword,
  updateForgotPassword,
  updatePassword,
  validateForgotPasswordToken,
} from './auth.controller.js';
import validate from '../core/middlewares/validate.middleware.js';
import {
  changePasswordValidation,
  loginValidation,
  registerValidation,
  requestForgotPasswordValidation,
} from './auth.validation.js';
import { verifyToken } from './auth.middleware.js';

const router = Router();

router.post('/signin', [validate(loginValidation)], login);
router.post('/register', [validate(registerValidation)], register);

router.post('/request-email-verification', [validate(requestForgotPasswordValidation)], requestEmailVerification);

router.post('/request-forgot-password', [validate(requestForgotPasswordValidation)], requestForgotPassword);
router.post('/forgot-password-token', validateForgotPasswordToken);
router.post('/change-forgot-password', updateForgotPassword);
router.post('/change-password', [verifyToken, validate(changePasswordValidation)], updatePassword);

router.get('/confirm-email-verification/:token', confirmEmailVerification);

export default router;
