const jwt = require("jsonwebtoken")
const { pool } = require("../database/connection")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Verify user still exists in database
    const [rows] = await pool.execute(
      "SELECT id, email, name, role, contact_number, relation, class, roll_number, parent_email FROM users WHERE id = ?",
      [decoded.id],
    )

    if (rows.length === 0) {
      return res.status(403).json({ message: "User not found" })
    }

    req.user = rows[0]
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired" })
    }
    console.error("Auth middleware error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" })
    }

    next()
  }
}

module.exports = {
  authenticateToken,
  authorizeRoles,
}
