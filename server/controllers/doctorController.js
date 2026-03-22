import pool from "../config/db.js";

// CREATE DOCTOR
export const createDoctor = async (req, res) => {
  try {

    const { name, specialization } = req.body;

    const result = await pool.query(
      `INSERT INTO doctors (name, specialization)
       VALUES ($1, $2)
       RETURNING *`,
      [name, specialization]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL DOCTORS
export const getDoctors = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM doctors ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE DOCTOR
export const updateDoctor = async (req, res) => {
  try {

    const { id } = req.params;
    const { name, specialization } = req.body;

    const result = await pool.query(
      `UPDATE doctors
       SET name=$1, specialization=$2
       WHERE id=$3
       RETURNING *`,
      [name, specialization, id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE DOCTOR
export const deleteDoctor = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM doctors WHERE id=$1",
      [id]
    );

    res.json({ message: "Doctor deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
