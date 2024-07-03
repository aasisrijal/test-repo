import logger from "../core/utils/logger.js";
import AppError from "../core/utils/appError.js";
import httpStatus from "http-status";
import { UserModel } from "../user/user.model.js";
// import bcrypt, { hashSync } from 'bcryptjs';
import { genAccessToken, verifyAccessToken } from "../services/jwt.js";
import config from "../config/config.js";
import {
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_CODE,
  PROVIDER_CREDENTIALS,
  PROVIDER_FACEBOOK,
  PROVIDER_GOOGLE,
  VERIFY_EMAIL,
} from "./auth.constants.js";
import axios from "axios";
import Token from "./token.model.js";
import { genRandomNumber } from "../core/utils/misc.js";
import crypto from "crypto";
// import { sendEmail } from '../shared/services/mail';
import i18next from "../core/middlewares/i18nMiddleware.js";

import bcrypt from "bcryptjs";
const { hashSync } = bcrypt;

function splitFullName(fullName) {
  const words = fullName.split(" ");
  const firstname = words[0];
  const lastname = words.slice(1).join(" ");
  return { firstname, lastname };
}

const getGoogleUser = async (accessToken) => {
  try {
    const {
      data: { name, email, sub, picture },
    } = await axios({
      method: "GET",
      url: config.google.apiUrl,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { firstname, lastname } = splitFullName(name);

    return {
      name: `${firstname} ${lastname}`,
      email,
      auth_provider: PROVIDER_GOOGLE,
      auth_provider_id: sub,
      avatar: picture,
      email_verified: true,
    };
  } catch (err) {
    logger.error(`User getting google data error: %0`, err.message);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      i18next.t("errors:signing_error")
    );
  }
};

const getFacebookUser = async (accessToken) => {
  try {
    const {
      data: { name, email, id, picture },
    } = await axios({
      method: "GET",
      url: config.facebook.graphUrl,
      params: {
        fields: "id,email,name,picture.type(large)",
        access_token: accessToken,
      },
    });
    const { firstname, lastname } = splitFullName(name);
    return {
      name: `${firstname} ${lastname}`,
      email,
      auth_provider: PROVIDER_FACEBOOK,
      auth_provider_id: id,
      avatar: picture?.data?.url,
      email_verified: true,
      // status: VERIFIED_STATUS,
    };
  } catch (err) {
    logger.error(`User getting facebook data error: %0`, err.message);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      i18next.t("errors:signing_error")
    );
  }
};

const getCredentialsUser = async (email, password) => {
  const user = await UserModel.findOne({ email }).select("password");
  console.log("user", user, email, password);
  if (!user)
    throw new AppError(
      httpStatus.NOT_FOUND,
      i18next.t("errors:user_invalid_email")
    );
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid)
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      i18next.t("errors:user_invalid_credentials")
    );
  return { auth_provider: PROVIDER_CREDENTIALS, email };
};

const loginService = async (queryParam, userData) => {
  const user = await UserModel.findOneAndUpdate(
    queryParam,
    {
      $setOnInsert: {
        ...userData,
      },
    },
    {
      new: true,
      upsert: true,
    }
  )
    .select("email name auth_provider status email_verified avatar")
    .lean();
  // if (!user.email_verified) throw new AppError(httpStatus.FORBIDDEN, 'errors:email_not_verified');
  const accessToken = await genAccessToken(user._id);
  return { user, token: accessToken };
};

// const sendEmailVerification = async (user, email ) => {
//   let newUser;
//   if (!user && email) {
//     const _user = await UserModel.findOne({ email });
//     if (!_user) throw new AppError(httpStatus.NOT_FOUND, i18next.t('errors:user_not_found'));
//     if (_user.email_verified) throw new AppError(httpStatus.BAD_REQUEST, i18next.t('errors:email_already_verified'));
//     newUser = _user;
//   } else {
//     newUser = user;
//   }
//   await Token.findOneAndDelete({
//     user: newUser._id,
//     type: VERIFY_EMAIL,
//   });
//   const token = await Token.create({
//     user: newUser._id,
//     type: VERIFY_EMAIL,
//     token: crypto.randomBytes(32).toString('hex'),
//   });
//   const url = `${config.app.frontEndUrl}/verify-email?token=${token.token}`;
//   const locals = {
//     name: newUser.name,
//     url,
//   };
//   sendEmail('verifyEmail', [newUser.email], locals);
//   return true;
// };

const registerService = async (userData) => {
  const { name, email, password, address } = userData;
  const user = await UserModel.findOne({ email });
  if (user)
    throw new AppError(
      httpStatus.FORBIDDEN,
      i18next.t("errors:user_already_exists")
    );
  const hashedPassword = hashSync(password);
  const doc = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    auth_provider: PROVIDER_CREDENTIALS,
    address,
  });
  const result = await UserModel.findById(doc._id).select("-password -__v");
  // await sendEmailVerification(doc);
  return result;
};

const verifyEmailVerification = async (token) => {
  const _token = await Token.findOne({
    token,
    type: VERIFY_EMAIL,
  });
  if (!_token)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      i18next.t("errors:token_expired")
    );
  const user = await UserModel.findByIdAndUpdate(_token.user, {
    email_verified: true,
  });
  if (!user)
    throw new AppError(
      httpStatus.NOT_FOUND,
      i18next.t("errors:user_not_found")
    );
  await Token.findOneAndDelete({ token });
  return true;
};

const requestForgotPasswordService = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new AppError(
      httpStatus.NOT_FOUND,
      i18next.t("errors:user_not_found_email")
    );
  // if (!user.email_verified) throw new AppError(httpStatus.BAD_REQUEST, 'errors:user_not_verified');
  await Token.findOneAndDelete({ user: user._id, type: FORGOT_PASSWORD });
  const token = await Token.create({
    user: user._id,
    token: genRandomNumber(4),
    key: crypto.randomBytes(32).toString("hex"),
    type: FORGOT_PASSWORD,
  });
  // const url = `${config.app.frontEndUrl}/`;
  // const locals = {
  //   name: user.name,
  //   code: token.token,
  //   url,
  // };
  // To be send on mail
  // sendEmail('changePassword', [user.email], locals);
  return token.key;
};

const requestTokenForgotPassword = async (key, code) => {
  const dbToken = await Token.findOneAndUpdate(
    {
      key: key,
      type: FORGOT_PASSWORD,
    },
    {
      $inc: {
        count: 1,
      },
    },
    {
      new: true,
    }
  );
  if (!dbToken)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      i18next.t("errors:code_expired_or_invalid")
    );
  if (dbToken.count > 5) {
    dbToken.deleteOne();
    throw new AppError(
      httpStatus.TOO_MANY_REQUESTS,
      i18next.t("errors:too_many_requests")
    );
  }
  if (dbToken.token !== String(code))
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      i18next.t("errors:invalid_code")
    );
  await Token.findOneAndDelete({
    key: key,
    type: FORGOT_PASSWORD,
  });
  const token = await Token.create({
    user: dbToken.user,
    token: crypto.randomBytes(32).toString("hex"),
    type: FORGOT_PASSWORD_CODE,
  });
  return token.token;
};

export const changeForgotPassword = async (token, password) => {
  const dbToken = await Token.findOne({
    key: token,
    type: FORGOT_PASSWORD,
  });
  if (!dbToken)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      i18next.t("errors:invalid_token")
    );
  await UserModel.findByIdAndUpdate(dbToken.user, {
    password: bcrypt.hashSync(password, 10),
  });
  await Token.findOneAndDelete({
    key: token,
    type: FORGOT_PASSWORD,
  });
  return true;
};

export const changePassword = async (oldPassword, newPassword, id) => {
  const user = await getCredentialsUser(id, oldPassword);
  await UserModel.updateOne(
    { email: user.email },
    {
      password: hashSync(newPassword, 10),
    }
  );

  return true;
};

export const verifyAccessTokenAndGetUser = async (accessToken) => {
  const decoded = await verifyAccessToken(accessToken);
  const user = await UserModel.findById(decoded._id).select(
    "name avatar email created_at updated_at"
  );
  if (!user)
    throw new AppError(
      httpStatus.NOT_FOUND,
      i18next.t("errors:user_not_found")
    );
  return user;
};

export {
  getCredentialsUser,
  getGoogleUser,
  getFacebookUser,
  loginService,
  registerService,
  requestForgotPasswordService,
  requestTokenForgotPassword,
  verifyEmailVerification,
  // sendEmailVerification,
};
