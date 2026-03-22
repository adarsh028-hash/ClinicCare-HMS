import express from "express";
import {createPatient,getPatients,updatePatient,deletePatient} from "../controllers/patientController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only ADMIN & RECEPTIONIST can create
router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  createPatient
);
// All logged-in users can view
router.get("/", verifyToken, getPatients);

// UPDATE (ADMIN & RECEPTIONIST)
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  updatePatient
);

// DELETE (ADMIN ONLY)
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN"),
  deletePatient
);

export default router;