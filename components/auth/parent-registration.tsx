"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Users, ArrowLeft } from "lucide-react"
import { registerUser, type User } from "@/lib/auth"

interface ParentRegistrationProps {
  onRegister: (user: User, token: string) => void
  onSwitchToLogin: () => void
  onSwitchToStudent: () => void
}

export function ParentRegistration({ onRegister, onSwitchToLogin, onSwitchToStudent }: ParentRegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    relation: "",
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
    if (!formData.contactNumber.trim()) return "Contact number is required"
    if (!formData.relation) return "Relation to student is required"
    if (formData.password.length < 6) return "Password must be at least 6 characters"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return "Invalid email format"

    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.contactNumber.replace(/\s/g, ""))) {
      return "Invalid contact number format"
    }

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
        role: "parent",
        contactNumber: formData.contactNumber,
        relation: formData.relation,
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

  const relations = ["Father", "Mother", "Guardian", "Grandfather", "Grandmother", "Uncle", "Aunt", "Other"]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Parent Registration</CardTitle>
        <CardDescription>Create your parent account to monitor your child's progress</CardDescription>
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

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              type="tel"
              placeholder="Enter your contact number"
              value={formData.contactNumber}
              onChange={(e) => handleInputChange("contactNumber", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation">Relation to Student</Label>
            <Select value={formData.relation} onValueChange={(value) => handleInputChange("relation", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation} value={relation}>
                    {relation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            Create Parent Account
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </button>
            <span className="text-muted-foreground">|</span>
            <button onClick={onSwitchToStudent} className="text-primary hover:underline font-medium">
              Student Registration
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Note:</p>
          <p className="text-xs text-muted-foreground">
            After registration, you can link your account with your child's student account using their registered email
            address.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
