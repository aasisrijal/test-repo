import mongoose from 'mongoose';
import { PROVIDER_CREDENTIALS, PROVIDER_FACEBOOK, PROVIDER_GOOGLE } from '../auth/auth.constants.js';

const userSchema = new mongoose.Schema(
  {
    name: String,
    avatar: String,
    address: String,
    email: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    auth_provider: {
      type: String,
      enum: [PROVIDER_CREDENTIALS, PROVIDER_FACEBOOK, PROVIDER_GOOGLE],
      default: PROVIDER_CREDENTIALS,
    },
    auth_provider_id: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },

);



const UserModel = mongoose.model('User', userSchema);

export { UserModel };
