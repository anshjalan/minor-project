import express from "express";

import {
  createIssue,
  getDashboardStats,
  getIssueById,
  getIssues,
  updateIssueStatus
} from "../controllers/issueController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", protect, asyncHandler(getIssues));
router.get("/stats", protect, requireRole("admin"), asyncHandler(getDashboardStats));
router.get("/:id", protect, asyncHandler(getIssueById));
router.post("/", protect, upload.single("image"), asyncHandler(createIssue));
router.patch("/:id", protect, requireRole("admin"), asyncHandler(updateIssueStatus));

export default router;
