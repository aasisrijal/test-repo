import config from "../config/config.js";
import { Schema, model } from "mongoose";
import {
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_CODE,
  VERIFY_EMAIL,
  VERIFY_EMAIL_CODE,
} from "./auth.constants.js";

const tokenType = [
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_CODE,
  VERIFY_EMAIL,
  VERIFY_EMAIL_CODE,
];

const TokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    token: { type: String, index: true },
    key: { type: String },
    count: { type: Number, default: 0 },
    type: {
      type: String,
      enum: tokenType,
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

TokenSchema.index(
  { created_at: 1 },
  { expireAfterSeconds: 600, name: "expire_at_index" }
);

const Token = model("Token", TokenSchema);
export default Token;
