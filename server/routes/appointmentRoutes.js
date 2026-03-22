import express from "express";
import {createAppointment,getAppointments,updateAppointmentStatus,getDoctorAppointments,getAppointmentsByDate} from "../controllers/appointmentController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All logged-in users can view
router.get("/", verifyToken, getAppointments);

// ADMIN & RECEPTIONIST can create
router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMIN", "RECEPTIONIST"),
  createAppointment
);

// UPDATE STATUS
router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("ADMIN", "DOCTOR"),
  updateAppointmentStatus
);

// DOCTOR VIEW OWN APPOINTMENTS
router.get(
  "/doctor",
  verifyToken,
  authorizeRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
  getDoctorAppointments
);

router.get(
  "/by-date",
  verifyToken,
  getAppointmentsByDate
);

export default router;