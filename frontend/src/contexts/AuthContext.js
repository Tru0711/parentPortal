"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }, [])

  // Check for existing session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        try {
          // Verify token is still valid
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const response = await axios.get("/api/user/profile")
          setUser(response.data)
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          delete axios.defaults.headers.common["Authorization"]
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      const { user: userData, token } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData)
      const { user: newUser, token } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(newUser))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(newUser)

      return { success: true, user: newUser }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
