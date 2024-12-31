import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);
router.get("/:username", protectRoute, getPublicProfile);

router.put("/profile", protectRoute, updateProfile);

export default router;
