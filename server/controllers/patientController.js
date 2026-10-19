import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// CREATE PATIENT
export const createPatient = asyncHandler(async (req, res) => {
  const {
    name,
    dob,
    gender,
    phone,
    emergency_contact,
    blood_group,
    email,
    address,
  } = req.body;

  if (!name || !dob || !gender || !phone || !address) {
    const error = new Error("Required fields are missing");
    error.statusCode = 400;
    throw error;
  }

  // Insert patient
  const result = await pool.query(
    `INSERT INTO patients (
      name,
      dob,
      gender,
      phone,
      emergency_contact,
      blood_group,
      email,
      address
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      name,
      dob,
      gender,
      phone,
      emergency_contact,
      blood_group,
      email,
      address,
    ]
  );

  const patient = result.rows[0];

  // Generate Patient Code
  const patientCode = `CC-${new Date().getFullYear()}-${String(
    patient.id
  ).padStart(4, "0")}`;

  // Save Patient Code
  await pool.query(
    `UPDATE patients
     SET patient_code = $1
     WHERE id = $2`,
    [patientCode, patient.id]
  );

  patient.patient_code = patientCode;

  res.status(201).json(patient);
});

// GET ALL PATIENTS
export const getPatients = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT *
     FROM patients
     ORDER BY id DESC`
  );

  res.status(200).json(result.rows);
});

// UPDATE PATIENT
export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    name,
    dob,
    gender,
    phone,
    emergency_contact,
    blood_group,
    email,
    address,
  } = req.body;

  const result = await pool.query(
    `UPDATE patients
     SET
       name = $1,
       dob = $2,
       gender = $3,
       phone = $4,
       emergency_contact = $5,
       blood_group = $6,
       email = $7,
       address = $8,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING *`,
    [
      name,
      dob,
      gender,
      phone,
      emergency_contact,
      blood_group,
      email,
      address,
      id,
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(result.rows[0]);
});

// DELETE PATIENT
export const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM patients
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    message: "Patient deleted successfully",
  });
});