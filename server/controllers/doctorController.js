import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// CREATE DOCTOR
export const createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    dob,
    specialization,
    phone,
    address,
    email,
    gender,
    qualification,
    experience_years,
    consultation_fee,
    joining_date,
    status,
  } = req.body;

  if (!name || !dob || !specialization || !phone || !address) {
    const error = new Error("Required fields are missing");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO doctors (
      name,
      dob,
      specialization,
      phone,
      address,
      email,
      gender,
      qualification,
      experience_years,
      consultation_fee,
      joining_date,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
    [
      name,
      dob,
      specialization,
      phone,
      address,
      email,
      gender,
      qualification,
      experience_years,
      consultation_fee,
      joining_date,
      status,
    ]
  );

  const doctor = result.rows[0];

  // Generate Doctor Code
  const doctorCode = `DD-${new Date().getFullYear()}-${String(
    doctor.id
  ).padStart(4, "0")}`;

  // Save Doctor Code
  await pool.query(
    `UPDATE doctors
     SET doctor_code = $1
     WHERE id = $2`,
    [doctorCode, doctor.id]
  );

  doctor.doctor_code = doctorCode;

  res.status(201).json(doctor);
});

// GET ALL DOCTORS
export const getDoctors = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT *
     FROM doctors
     ORDER BY id DESC`
  );

  res.status(200).json(result.rows);
});

// UPDATE DOCTOR
export const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    name,
    dob,
    specialization,
    phone,
    address,
    email,
    gender,
    qualification,
    experience_years,
    consultation_fee,
    joining_date,
    status,
  } = req.body;

  const result = await pool.query(
    `UPDATE doctors
     SET
       name = $1,
       dob=$2,
       specialization = $3,
       phone = $4,
       address = $5,
       email = $6,
       gender = $7,
       qualification = $8,
       experience_years = $9,
       consultation_fee = $10,
       joining_date = $11,
       status = $12,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $13
     RETURNING *`,
    [
      name,
      dob,
      specialization,
      phone,
      address,
      email,
      gender,
      qualification,
      experience_years,
      consultation_fee,
      joining_date,
      status,
      id,
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(result.rows[0]);
});

// DELETE DOCTOR
export const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM doctors
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error("Doctor not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    message: "Doctor deleted successfully",
  });
});