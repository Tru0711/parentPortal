const mysql = require("mysql2/promise")
require("dotenv").config()

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "parent_portal",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool for better performance
const pool = mysql.createPool(dbConfig)

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Database connected successfully")
    connection.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

module.exports = {
  pool,
  testConnection,
}
