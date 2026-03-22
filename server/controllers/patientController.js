import pool from "../config/db.js";

// CREATE PATIENT
export const createPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, address } = req.body;

    const result = await pool.query(
      `INSERT INTO patients (name, age, gender, phone, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, age, gender, phone, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PATIENTS
export const getPatients = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patients ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE PATIENT
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, phone, address } = req.body;

    const result = await pool.query(
      `UPDATE patients
       SET name=$1, age=$2, gender=$3, phone=$4, address=$5
       WHERE id=$6
       RETURNING *`,
      [name, age, gender, phone, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE PATIENT
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM patients WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};