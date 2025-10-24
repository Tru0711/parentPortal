const express = require("express")
const { pool } = require("../database/connection")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Update attendance (teachers only)
router.post("/", authenticateToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { studentId, date, status, subject } = req.body
    const teacherId = req.user.id

    // Check if attendance already exists for this date
    const [existingRows] = await pool.execute("SELECT id FROM attendance WHERE student_id = ? AND date = ?", [
      studentId,
      date,
    ])

    if (existingRows.length > 0) {
      // Update existing record
      await pool.execute(
        "UPDATE attendance SET status = ?, subject = ?, teacher_id = ? WHERE student_id = ? AND date = ?",
        [status, subject, teacherId, studentId, date],
      )
    } else {
      // Insert new record
      await pool.execute(
        "INSERT INTO attendance (student_id, date, status, subject, teacher_id) VALUES (?, ?, ?, ?, ?)",
        [studentId, date, status, subject, teacherId],
      )
    }

    res.json({ message: "Attendance updated successfully" })
  } catch (error) {
    console.error("Update attendance error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get attendance for a specific date range
router.get("/range", authenticateToken, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { startDate, endDate, classFilter } = req.query

    let query = `
      SELECT a.*, u.name as student_name, u.class, u.roll_number 
      FROM attendance a 
      JOIN users u ON a.student_id = u.id 
      WHERE a.date BETWEEN ? AND ?
    `
    const params = [startDate, endDate]

    if (classFilter) {
      query += " AND u.class = ?"
      params.push(classFilter)
    }

    query += " ORDER BY a.date DESC, u.class, u.roll_number"

    const [rows] = await pool.execute(query, params)
    res.json(rows)
  } catch (error) {
    console.error("Get attendance range error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
