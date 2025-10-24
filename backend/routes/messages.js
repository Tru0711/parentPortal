const express = require("express")
const { pool } = require("../database/connection")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

// Send message
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { toUserId, studentId, subject, message } = req.body
    const fromUserId = req.user.id

    await pool.execute(
      "INSERT INTO messages (from_user_id, to_user_id, student_id, subject, message) VALUES (?, ?, ?, ?, ?)",
      [fromUserId, toUserId, studentId, subject, message],
    )

    res.json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Send message error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get messages for user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { type = "received" } = req.query

    let query
    if (type === "sent") {
      query = `
        SELECT m.*, 
               u_to.name as to_name, 
               u_student.name as student_name 
        FROM messages m 
        JOIN users u_to ON m.to_user_id = u_to.id 
        LEFT JOIN users u_student ON m.student_id = u_student.id 
        WHERE m.from_user_id = ? 
        ORDER BY m.created_at DESC
      `
    } else {
      query = `
        SELECT m.*, 
               u_from.name as from_name, 
               u_student.name as student_name 
        FROM messages m 
        JOIN users u_from ON m.from_user_id = u_from.id 
        LEFT JOIN users u_student ON m.student_id = u_student.id 
        WHERE m.to_user_id = ? 
        ORDER BY m.created_at DESC
      `
    }

    const [rows] = await pool.execute(query, [userId])
    res.json(rows)
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Mark message as read
router.patch("/:messageId/read", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params
    const userId = req.user.id

    await pool.execute("UPDATE messages SET is_read = TRUE WHERE id = ? AND to_user_id = ?", [messageId, userId])

    res.json({ message: "Message marked as read" })
  } catch (error) {
    console.error("Mark message read error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get parent email by student ID (for teachers to send messages)
router.get("/parent/:studentId", authenticateToken, authorizeRoles("teacher", "admin"), async (req, res) => {
  try {
    const { studentId } = req.params

    const [studentRows] = await pool.execute("SELECT parent_email FROM users WHERE id = ? AND role = 'student'", [
      studentId,
    ])

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" })
    }

    const [parentRows] = await pool.execute("SELECT id, name, email FROM users WHERE email = ? AND role = 'parent'", [
      studentRows[0].parent_email,
    ])

    if (parentRows.length === 0) {
      return res.status(404).json({ message: "Parent not found" })
    }

    res.json(parentRows[0])
  } catch (error) {
    console.error("Get parent info error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
