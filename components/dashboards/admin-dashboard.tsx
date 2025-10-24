"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, UserPlus, BarChart3, Shield, Trash2, Edit, Download, CheckCircle } from "lucide-react"
import type { User as AuthUser } from "@/lib/auth"

interface AdminDashboardProps {
  user: AuthUser
  onLogout: () => void
}

interface SystemUser {
  id: string
  name: string
  email: string
  role: "parent" | "student" | "teacher" | "admin"
  status: "active" | "inactive"
  createdAt: string
}

// Mock users data for admin management
const mockSystemUsers: SystemUser[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@school.edu",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "teacher@school.edu",
    role: "teacher",
    status: "active",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "John Smith",
    email: "parent@example.com",
    role: "parent",
    status: "active",
    createdAt: "2024-01-03",
  },
  {
    id: "4",
    name: "Emma Smith",
    email: "student@example.com",
    role: "student",
    status: "active",
    createdAt: "2024-01-04",
  },
  {
    id: "5",
    name: "Mike Davis",
    email: "mike.teacher@school.edu",
    role: "teacher",
    status: "inactive",
    createdAt: "2024-01-05",
  },
]

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [users, setUsers] = useState<SystemUser[]>(mockSystemUsers)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "" as "parent" | "student" | "teacher" | "admin" | "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      return
    }

    const user: SystemUser = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "" })
    setSuccessMessage("User created successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
    setSuccessMessage("User deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)))
    setSuccessMessage("User status updated!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const generateReport = () => {
    const reportData = {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.status === "active").length,
      usersByRole: {
        admin: users.filter((u) => u.role === "admin").length,
        teacher: users.filter((u) => u.role === "teacher").length,
        parent: users.filter((u) => u.role === "parent").length,
        student: users.filter((u) => u.role === "student").length,
      },
      generatedAt: new Date().toISOString(),
    }

    console.log("Generated Report:", reportData)
    setSuccessMessage("Report generated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    students: users.filter((u) => u.role === "student").length,
    parents: users.filter((u) => u.role === "parent").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {successMessage && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.total}</div>
              <p className="text-xs text-muted-foreground">{userStats.active} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.teachers}</div>
              <p className="text-xs text-muted-foreground">Faculty members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.students}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parents</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.parents}</div>
              <p className="text-xs text-muted-foreground">Parent accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <Button onClick={generateReport} size="sm" className="w-full">
                <Download className="mr-1 h-3 w-3" />
                Generate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="create">Create User</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>System Users</span>
                </CardTitle>
                <CardDescription>Manage all users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((systemUser) => (
                    <div key={systemUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">{systemUser.name}</p>
                            <p className="text-sm text-muted-foreground">{systemUser.email}</p>
                          </div>
                          <Badge
                            variant={
                              systemUser.role === "admin"
                                ? "destructive"
                                : systemUser.role === "teacher"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {systemUser.role}
                          </Badge>
                          <Badge variant={systemUser.status === "active" ? "default" : "secondary"}>
                            {systemUser.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Created: {systemUser.createdAt}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleUserStatus(systemUser.id)}
                          disabled={systemUser.role === "admin"}
                        >
                          {systemUser.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(systemUser)}
                          disabled={systemUser.role === "admin"}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(systemUser.id)}
                          disabled={systemUser.role === "admin"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Create New User</span>
                </CardTitle>
                <CardDescription>Add a new user to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-name">Full Name</Label>
                      <Input
                        id="user-name"
                        value={newUser.name}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email Address</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "parent" | "student" | "teacher" | "admin") =>
                        setNewUser((prev) => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleCreateUser} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>System Reports</span>
                </CardTitle>
                <CardDescription>Generate and view system analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">User Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Total Users:</span>
                            <span className="font-bold">{userStats.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Active Users:</span>
                            <span className="font-bold text-green-600">{userStats.active}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Teachers:</span>
                            <span className="font-bold">{userStats.teachers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Students:</span>
                            <span className="font-bold">{userStats.students}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Parents:</span>
                            <span className="font-bold">{userStats.parents}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">System Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>System Status:</span>
                            <Badge variant="default">Online</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Database:</span>
                            <Badge variant="default">Connected</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Backup:</span>
                            <span className="text-sm">2024-01-25</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Uptime:</span>
                            <span className="text-sm">99.9%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={generateReport}>
                      <Download className="mr-2 h-4 w-4" />
                      Generate Full Report
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
