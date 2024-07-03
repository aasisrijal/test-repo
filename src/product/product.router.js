import { Router } from "express";
import {
  getProductsList,
  getProductDetails,
  createProduct,
} from "./product.controller.js";
// import { upload } from '@config/upload';
// import handleMulterErrors from '@core/middlewares/multerError.middleware';
import { getAllGlobalMiddleware } from "../core/middlewares/getAllGlobal.middleware.js";
// import { verifyToken } from '@components/auth/v1/auth.middleware';

const router = Router();

// router.get('/', getProductsList);
router.get("/:productId", getProductDetails);
// router.post('/', createProduct);

router
  .route("/")
  .get([getAllGlobalMiddleware], getProductsList)
  .post(createProduct);

export default router;
