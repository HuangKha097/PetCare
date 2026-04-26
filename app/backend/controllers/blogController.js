const pool = require("../config/db");

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, title, excerpt, author, date, image_url, category FROM blogs ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
