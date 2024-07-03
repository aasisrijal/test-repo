import asyncWrapper from "../core/utils/asyncWrapper.js";
import httpStatus from "http-status";
import {
  // updateProfile,
  // getMyProfileService,
  getDetails,
} from "./user.service.js";

export const getMyProfile = asyncWrapper(async (req, res) => {
  const id = req.user.id;
  const data = await getDetails(id);
  res
    .status(httpStatus.OK)
    .json({ ok: true, message: req.t("success:user_details_fetched"), data });
});
