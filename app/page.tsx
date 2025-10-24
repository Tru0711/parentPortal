"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { StudentRegistration } from "@/components/auth/student-registration"
import { ParentRegistration } from "@/components/auth/parent-registration"
import { ParentDashboard } from "@/components/dashboards/parent-dashboard"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { MessageCenter } from "@/components/messaging/message-center"
import type { User } from "@/lib/auth"

type AuthView = "login" | "student-register" | "parent-register"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [authView, setAuthView] = useState<AuthView>("login")
  const [showMessages, setShowMessages] = useState(false)

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
  }, [])

  const handleLogin = (userData: User, userToken: string) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", userToken)
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    setShowMessages(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const handleRegister = (userData: User, userToken: string) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", userToken)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authView === "login" && (
            <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setAuthView("student-register")} />
          )}
          {authView === "student-register" && (
            <StudentRegistration
              onRegister={handleRegister}
              onSwitchToLogin={() => setAuthView("login")}
              onSwitchToParent={() => setAuthView("parent-register")}
            />
          )}
          {authView === "parent-register" && (
            <ParentRegistration
              onRegister={handleRegister}
              onSwitchToLogin={() => setAuthView("login")}
              onSwitchToStudent={() => setAuthView("student-register")}
            />
          )}
        </div>
      </div>
    )
  }

  // Show message center if requested
  if (showMessages) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-6xl">
          <MessageCenter
            userEmail={user.email}
            userName={user.name}
            userRole={user.role}
            onClose={() => setShowMessages(false)}
          />
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case "parent":
      return <ParentDashboard user={user} onLogout={handleLogout} />
    case "student":
      return <StudentDashboard user={user} onLogout={handleLogout} />
    case "teacher":
      return <TeacherDashboard user={user} onLogout={handleLogout} />
    case "admin":
      return <AdminDashboard user={user} onLogout={handleLogout} />
    default:
      return <div>Invalid user role</div>
  }
}
