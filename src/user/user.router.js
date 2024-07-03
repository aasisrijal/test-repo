import { Router } from "express";
import { getMyProfile } from "./user.controller.js";
import { verifyToken } from "../auth/auth.middleware.js";

const router = Router();

router.get("/me", verifyToken, getMyProfile);

export default router;
