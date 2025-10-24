const express = require("express")
const { pool } = require("../database/connection")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Add or update marks (teachers only)
router.post("/", authenticateToken, authorizeRoles("teacher"), async (req, res) => {
  try {
    const { studentId, subject, examType, marks, totalMarks, examDate } = req.body
    const teacherId = req.user.id

    // Calculate grade
    const percentage = (marks / totalMarks) * 100
    let grade = "F"
    if (percentage >= 90) grade = "A+"
    else if (percentage >= 80) grade = "A"
    else if (percentage >= 70) grade = "B+"
    else if (percentage >= 60) grade = "B"
    else if (percentage >= 50) grade = "C"

    await pool.execute(
      "INSERT INTO marks (student_id, subject, exam_type, marks, total_marks, grade, exam_date, teacher_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [studentId, subject, examType, marks, totalMarks, grade, examDate, teacherId],
    )

    res.json({ message: "Marks added successfully", grade })
  } catch (error) {
    console.error("Add marks error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get marks by class and subject
router.get("/class/:className", authenticateToken, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { className } = req.params
    const { subject, examType } = req.query

    let query = `
      SELECT m.*, u.name as student_name, u.roll_number 
      FROM marks m 
      JOIN users u ON m.student_id = u.id 
      WHERE u.class = ?
    `
    const params = [className]

    if (subject) {
      query += " AND m.subject = ?"
      params.push(subject)
    }

    if (examType) {
      query += " AND m.exam_type = ?"
      params.push(examType)
    }

    query += " ORDER BY m.exam_date DESC, u.roll_number"

    const [rows] = await pool.execute(query, params)
    res.json(rows)
  } catch (error) {
    console.error("Get class marks error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
