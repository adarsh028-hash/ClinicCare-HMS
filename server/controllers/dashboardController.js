import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler (async (req, res) => {

    const totalPatients = await pool.query(
      "SELECT COUNT(*) FROM patients"
    );

    const totalDoctors = await pool.query(
      "SELECT COUNT(*) FROM doctors"
    );

    const todayAppointments = await pool.query(
      `SELECT COUNT(*) FROM appointments
       WHERE appointment_date = CURRENT_DATE`
    );

    const completedAppointments = await pool.query(
      `SELECT COUNT(*) FROM appointments
       WHERE status = 'COMPLETED'`
    );

    res.json({
      total_patients: totalPatients.rows[0].count,
      total_doctors: totalDoctors.rows[0].count,
      today_appointments: todayAppointments.rows[0].count,
      completed_appointments: completedAppointments.rows[0].count
    });
});