import pool from "../config/db.js"

export const getProfile = async (req, res) => {
  try {
    // console.log("REQ.USER:", req.user);

    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, name, email, role FROM users WHERE id = $1`,
      [userId]
    );

    // console.log("DB RESULT:", result.rows);

    res.json(result.rows[0]);

  } catch (error) {
    console.error("🔥 ERROR:", error); 
    res.status(500).json({ error: error.message });
  }
};

