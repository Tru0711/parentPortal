"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LogOut,
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  MailOpen,
  GraduationCap,
} from "lucide-react"
import type { User as AuthUser } from "@/lib/auth"
import { mockStudentData, calculateAttendancePercentage, calculateAverageMarks } from "@/lib/mock-data"

interface StudentDashboardProps {
  user: AuthUser
  onLogout: () => void
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const attendancePercentage = calculateAttendancePercentage(mockStudentData.attendance)
  const averageMarks = calculateAverageMarks(mockStudentData.marks)
  const unreadMessages = mockStudentData.messages.filter((msg) => !msg.read).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Student Portal</h1>
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
        {/* Student Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{user.class}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-medium">{user.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
              <Progress value={attendancePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMarks}%</div>
              <Progress value={averageMarks} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessages}</div>
              <p className="text-xs text-muted-foreground mt-2">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="marks">My Marks</TabsTrigger>
            <TabsTrigger value="behavior">Feedback</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>My Attendance Record</CardTitle>
                <CardDescription>Your daily attendance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStudentData.attendance.slice(-10).map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {record.status === "present" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {record.status === "absent" && <XCircle className="h-5 w-5 text-red-500" />}
                        {record.status === "late" && <Clock className="h-5 w-5 text-yellow-500" />}
                        <span className="font-medium">{record.date}</span>
                      </div>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "absent"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marks">
            <Card>
              <CardHeader>
                <CardTitle>My Test Scores</CardTitle>
                <CardDescription>Your academic performance across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudentData.marks.map((mark, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{mark.subject}</span>
                          <Badge variant="outline">{mark.examType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{mark.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {mark.marks}/{mark.totalMarks}
                        </div>
                        <Badge
                          variant={
                            mark.grade.includes("A")
                              ? "default"
                              : mark.grade.includes("B")
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {mark.grade}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Feedback</CardTitle>
                <CardDescription>Comments and feedback from your teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudentData.behavior.map((behavior, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {behavior.type === "positive" && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {behavior.type === "negative" && <XCircle className="h-5 w-5 text-red-500" />}
                          {behavior.type === "neutral" && <Clock className="h-5 w-5 text-blue-500" />}
                          <span className="font-medium">{behavior.teacher}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{behavior.date}</span>
                      </div>
                      <p className="text-sm">{behavior.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Messages from your teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudentData.messages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {message.read ? (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Mail className="h-4 w-4 text-primary" />
                          )}
                          <span className="font-medium">{message.from}</span>
                          {!message.read && <Badge variant="default">New</Badge>}
                        </div>
                        <span className="text-sm text-muted-foreground">{message.date}</span>
                      </div>
                      <h4 className="font-medium mb-2">{message.subject}</h4>
                      <p className="text-sm text-muted-foreground">{message.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
