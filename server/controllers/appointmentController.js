import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// CREATE APPOINTMENT
export const createAppointment = asyncHandler(async(req, res)=> {
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

});

// GET ALL APPOINTMENTS
export const getAppointments = asyncHandler(async(req, res)=>{
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
});

// UPDATE APPOINTMENT STATUS
export const updateAppointmentStatus = asyncHandler(async(req, res)=>{
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
});

// GET APPOINTMENTS FOR LOGGED-IN DOCTOR
export const getDoctorAppointments = asyncHandler(async(req, res)=>{

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
});

// FILTER APPOINTMENTS BY DATE
export const getAppointmentsByDate = asyncHandler(async(req, res)=>{
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
});

// Delete Appointment
export const deleteAppointment = asyncHandler(async(req,res)=>{

  const {id} = req.params;
  const result = await pool.query(
    `DELETE FROM appointments
    WHERE id = 1
    RETURNING*`,
    [id]
  );

  if (result.rows.length ===0){
    return res.status(404).json({
      message:"Appointment not found",
    });
  }
  res.json({
    message: "Appointment deleted successfully",
  })
});

export const updateAppointment = asyncHandler(async(req,res)=>{

  const{id} = req.params;
  const{patient_id,doctor_i,dappointment_date, appointment_time} = req.body;

  const result = await pool.query(
    `UPDATE appointments
    SET patient_id= $1,
        doctor_id = $2,
        appointment_date = $3,
        appointment_time = $4,
        status = $5
        WHERE id = $6
        RETURNING *`,

        [
          patient_id,
          doctor_id,
          appointment_date,
          appointment_time,
          status,
          id,
        ]
  );

  if(result.roe.length ===0){
    return res.status(404).json({
      message: "Appointment not found",
    })
  }

  res.json(result.rows[0]);

})