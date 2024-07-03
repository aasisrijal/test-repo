import { Router } from "express";

import auth from "../auth/auth.router.js";
import user from "../user/user.router.js";
import { verifyToken } from "../auth/auth.middleware.js";
import product from "../product/product.router.js";

const router = Router();
router.use("/auth", auth);
router.use("/user", verifyToken, user);
router.use("/products", product);

export default router;
