const express = require("express")
const { pool } = require("../database/connection")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Get student data (for parents and students themselves)
router.get("/:studentId", authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params
    const { user } = req

    // Check permissions
    if (user.role === "student" && user.id !== Number.parseInt(studentId)) {
      return res.status(403).json({ message: "Access denied" })
    }

    if (user.role === "parent") {
      // Verify this parent is linked to this student
      const [studentCheck] = await pool.execute("SELECT id FROM users WHERE id = ? AND parent_email = ?", [
        studentId,
        user.email,
      ])
      if (studentCheck.length === 0) {
        return res.status(403).json({ message: "Access denied" })
      }
    }

    // Get student basic info
    const [studentRows] = await pool.execute(
      "SELECT id, name, email, class, roll_number, parent_email FROM users WHERE id = ? AND role = 'student'",
      [studentId],
    )

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" })
    }

    const student = studentRows[0]

    // Get attendance data
    const [attendanceRows] = await pool.execute(
      "SELECT date, status, subject FROM attendance WHERE student_id = ? ORDER BY date DESC LIMIT 30",
      [studentId],
    )

    // Get marks data
    const [marksRows] = await pool.execute(
      "SELECT subject, exam_type, marks, total_marks, grade, exam_date FROM marks WHERE student_id = ? ORDER BY exam_date DESC",
      [studentId],
    )

    // Get behavior records
    const [behaviorRows] = await pool.execute(
      `SELECT b.date, b.type, b.description, u.name as teacher_name 
       FROM behavior b 
       JOIN users u ON b.teacher_id = u.id 
       WHERE b.student_id = ? 
       ORDER BY b.date DESC LIMIT 20`,
      [studentId],
    )

    // Calculate attendance percentage
    const totalDays = attendanceRows.length
    const presentDays = attendanceRows.filter((record) => record.status === "present").length
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

    // Calculate average marks
    const totalPercentage = marksRows.reduce((sum, mark) => sum + (mark.marks / mark.total_marks) * 100, 0)
    const averageMarks = marksRows.length > 0 ? Math.round(totalPercentage / marksRows.length) : 0

    res.json({
      student,
      attendance: attendanceRows,
      marks: marksRows,
      behavior: behaviorRows,
      stats: {
        attendancePercentage,
        averageMarks,
        totalSubjects: [...new Set(marksRows.map((m) => m.subject))].length,
      },
    })
  } catch (error) {
    console.error("Get student data error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get all students (for teachers and admin)
router.get("/", authenticateToken, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name, email, class, roll_number, parent_email FROM users WHERE role = 'student' ORDER BY class, roll_number",
    )

    res.json(rows)
  } catch (error) {
    console.error("Get students error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
