import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// CREATE DOCTOR
export const createDoctor = asyncHandler(async (req, res) => {

    const { name, specialization, phone, address} = req.body;

    // Backend form validation
    if (!name || !specialization || !phone || !address) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }
    
    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, phone, address)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, specialization, phone, address]
    );

    res.status(201).json(result.rows[0]);

    next();
});


// GET ALL DOCTORS
export const getDoctors = asyncHandler(async (req, res) => {


    const result = await pool.query(
      "SELECT * FROM doctors ORDER BY id DESC"
    );

    res.json(result.rows);

    
});


// UPDATE DOCTOR
export const updateDoctor = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name, specialization, phone, address } = req.body;

    const result = await pool.query(
      `UPDATE doctors
       SET name=$1, specialization=$2, phone=$3, address=$4 
       WHERE id=$5
       RETURNING *`,
      [name, specialization, phone, address, id]
    );

    res.json(result.rows[0]);

  
});


// DELETE DOCTOR
export const deleteDoctor = asyncHandler(async (req, res) => {
  
    const { id } = req.params;

    await pool.query(
      "DELETE FROM doctors WHERE id=$1",
      [id]
    );

    res.json({ message: "Doctor deleted successfully" });

  
});
