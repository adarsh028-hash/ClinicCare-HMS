import pool from "../config/db.js";

// CREATE APPOINTMENT
export const createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    // Check if patient exists
    const patientCheck = await pool.query(
      "SELECT * FROM patients WHERE id=$1",
      [patient_id]
    );

    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if doctor exists
    const doctorCheck = await pool.query(
      "SELECT * FROM doctors WHERE id=$1",
      [doctor_id]
    );

    if (doctorCheck.rows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Prevent duplicate appointment (same doctor, same date & time)
    const conflictCheck = await pool.query(
      `SELECT * FROM appointments
       WHERE doctor_id=$1 AND appointment_date=$2 AND appointment_time=$3`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, appointment_time]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL APPOINTMENTS
export const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
             p.name AS patient_name,
             d.name AS doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE APPOINTMENT STATUS
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ["SCHEDULED", "COMPLETED", "CANCELLED"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status=$1
       WHERE id=$2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET APPOINTMENTS FOR LOGGED-IN DOCTOR
export const getDoctorAppointments = async (req, res) => {
  try {

    const doctorId = req.query.id;

    const result = await pool.query(`
      SELECT a.*,
             p.name AS patient_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date ASC
    `, [doctorId]);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FILTER APPOINTMENTS BY DATE
export const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const result = await pool.query(`
      SELECT a.*,
             p.name AS patient_name,
             d.name AS doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.appointment_date = $1
    `, [date]);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};