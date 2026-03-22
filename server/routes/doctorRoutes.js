import express from "express";
import {
  createDoctor,
  getDoctors,
  updateDoctor,
  deleteDoctor
} from "../controllers/doctorController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE DOCTOR
router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN"),
  createDoctor
);


// GET ALL DOCTORS
router.get(
  "/",
  verifyToken,
  getDoctors
);


// UPDATE DOCTOR
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN"),
  updateDoctor
);


// DELETE DOCTOR
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("ADMIN"),
  deleteDoctor
);


export default router;
