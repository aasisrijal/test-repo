import httpStatus from "http-status";
import { Router } from "express";

const router = Router();
router.all("*", (req, res) => {
  const resBody = "errors:not_found";
  res.status(httpStatus.NOT_FOUND).json({ ok: false, message: resBody });
});

export default router;
