import express from "express";

import { getProfile, login, signup } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/me", protect, asyncHandler(getProfile));

export default router;
