"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, GraduationCap, ArrowLeft } from "lucide-react"
import { registerUser, type User } from "@/lib/auth"

interface StudentRegistrationProps {
  onRegister: (user: User, token: string) => void
  onSwitchToLogin: () => void
  onSwitchToParent: () => void
}

export function StudentRegistration({ onRegister, onSwitchToLogin, onSwitchToParent }: StudentRegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    class: "",
    rollNumber: "",
    parentEmail: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required"
    if (!formData.email.trim()) return "Email is required"
    if (!formData.password) return "Password is required"
    if (formData.password !== formData.confirmPassword) return "Passwords do not match"
    if (!formData.class) return "Class is required"
    if (!formData.rollNumber.trim()) return "Roll number is required"
    if (!formData.parentEmail.trim()) return "Parent email is required"
    if (formData.password.length < 6) return "Password must be at least 6 characters"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return "Invalid email format"
    if (!emailRegex.test(formData.parentEmail)) return "Invalid parent email format"

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "student",
        class: formData.class,
        rollNumber: formData.rollNumber,
        parentEmail: formData.parentEmail,
      })

      if (result.success && result.user && result.token) {
        onRegister(result.user, result.token)
      } else {
        setError(result.message || "Registration failed")
      }
    } catch (err) {
      setError("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  const classes = [
    "1A",
    "1B",
    "1C",
    "2A",
    "2B",
    "2C",
    "3A",
    "3B",
    "3C",
    "4A",
    "4B",
    "4C",
    "5A",
    "5B",
    "5C",
    "6A",
    "6B",
    "6C",
    "7A",
    "7B",
    "7C",
    "8A",
    "8B",
    "8C",
    "9A",
    "9B",
    "9C",
    "10A",
    "10B",
    "10C",
    "11A",
    "11B",
    "11C",
    "12A",
    "12B",
    "12C",
  ]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
        <CardDescription>Create your student account to access the portal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                type="text"
                placeholder="Roll no."
                value={formData.rollNumber}
                onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentEmail">Parent Email</Label>
            <Input
              id="parentEmail"
              type="email"
              placeholder="Enter parent's email"
              value={formData.parentEmail}
              onChange={(e) => handleInputChange("parentEmail", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Student Account
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </button>
            <span className="text-muted-foreground">|</span>
            <button onClick={onSwitchToParent} className="text-primary hover:underline font-medium">
              Parent Registration
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
