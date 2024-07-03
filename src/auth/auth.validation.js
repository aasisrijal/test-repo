import Joi from 'joi';
import { PROVIDER_CREDENTIALS, PROVIDER_FACEBOOK, PROVIDER_GOOGLE } from './auth.constants.js';

const loginValidation = {
  query: Joi.object().keys({
    provider: Joi.string().required().valid(PROVIDER_CREDENTIALS, PROVIDER_FACEBOOK, PROVIDER_GOOGLE),
  }),
  body: Joi.object().when('query.provider', {
    is: Joi.valid(PROVIDER_CREDENTIALS),
    then: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    otherwise: Joi.object().keys({
      token: Joi.string().required(),
    }),
  }),
};

const registerValidation = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
  }),
};

const requestForgotPasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const changePasswordValidation = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};
export { loginValidation, registerValidation, requestForgotPasswordValidation, changePasswordValidation };
