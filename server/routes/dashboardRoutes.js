import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

export default router;