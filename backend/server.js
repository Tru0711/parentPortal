const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MySQL connection
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "parent_portal",
}

let db

async function initializeDatabase() {
  try {
    db = await mysql.createConnection(dbConfig)
    console.log("Connected to MySQL database")
  } catch (error) {
    console.error("Database connection failed:", error)
    process.exit(1)
  }
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" })
    }
    req.user = user
    next()
  })
}

const studentsRoutes = require("./routes/students")
const attendanceRoutes = require("./routes/attendance")
const marksRoutes = require("./routes/marks")
const behaviorRoutes = require("./routes/behavior")
const messagesRoutes = require("./routes/messages")

// Routes
app.get("/api/health", (req, res) => {
  res.json({ message: "Parent Portal API is running" })
})

// Auth routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email])

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const user = rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    const { password: _, ...userWithoutPassword } = user
    res.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      role,
      contactNumber,
      relation,
      class: studentClass,
      rollNumber,
      parentEmail,
    } = req.body

    // Check if user already exists
    const [existingUsers] = await db.execute("SELECT id FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const [result] = await db.execute(
      "INSERT INTO users (email, password, name, role, contact_number, relation, class, roll_number, parent_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, name, role, contactNumber, relation, studentClass, rollNumber, parentEmail],
    )

    const token = jwt.sign({ id: result.insertId, email, role }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "24h",
    })

    res.status(201).json({
      success: true,
      user: {
        id: result.insertId,
        email,
        name,
        role,
        contactNumber,
        relation,
        class: studentClass,
        rollNumber,
        parentEmail,
      },
      token,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Protected routes
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, email, name, role, contact_number, relation, class, roll_number, parent_email FROM users WHERE id = ?",
      [req.user.id],
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(rows[0])
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

app.use("/api/students", studentsRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/marks", marksRoutes)
app.use("/api/behavior", behaviorRoutes)
app.use("/api/messages", messagesRoutes)

// Start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
