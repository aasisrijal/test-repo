import AppError from "../core/utils/appError.js";
import { UserModel } from "./user.model.js";
import httpStatus from "http-status";

export const getDetails = async (id) => {
  console.log("user id", id);
  const userProfile = await UserModel.findById(id);
  if (!userProfile)
    throw new AppError(httpStatus.NOT_FOUND, "errors:user_not_found");
  return userProfile;
};
