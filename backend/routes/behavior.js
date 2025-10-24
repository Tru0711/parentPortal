const express = require("express")
const { pool } = require("../database/connection")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Add behavior record (teachers only)
router.post("/", authenticateToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { studentId, type, description, date } = req.body
    const teacherId = req.user.id

    await pool.execute(
      "INSERT INTO behavior (student_id, teacher_id, date, type, description) VALUES (?, ?, ?, ?, ?)",
      [studentId, teacherId, date, type, description],
    )

    res.json({ message: "Behavior record added successfully" })
  } catch (error) {
    console.error("Add behavior error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get behavior records for a student
router.get("/student/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params
    const { user } = req

    // Check permissions
    if (user.role === "student" && user.id !== Number.parseInt(studentId)) {
      return res.status(403).json({ message: "Access denied" })
    }

    if (user.role === "parent") {
      const [studentCheck] = await pool.execute("SELECT id FROM users WHERE id = ? AND parent_email = ?", [
        studentId,
        user.email,
      ])
      if (studentCheck.length === 0) {
        return res.status(403).json({ message: "Access denied" })
      }
    }

    const [rows] = await pool.execute(
      `SELECT b.*, u.name as teacher_name 
       FROM behavior b 
       JOIN users u ON b.teacher_id = u.id 
       WHERE b.student_id = ? 
       ORDER BY b.date DESC`,
      [studentId],
    )

    res.json(rows)
  } catch (error) {
    console.error("Get behavior records error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
