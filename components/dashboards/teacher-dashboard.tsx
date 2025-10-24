"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  LogOut,
  Users,
  Calendar,
  BookOpen,
  MessageSquare,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  GraduationCap,
} from "lucide-react"
import type { User as AuthUser } from "@/lib/auth"

interface TeacherDashboardProps {
  user: AuthUser
  onLogout: () => void
}

interface Student {
  id: string
  name: string
  rollNumber: string
  class: string
  email: string
  parentEmail: string
}

interface AttendanceEntry {
  studentId: string
  status: "present" | "absent" | "late"
}

interface MarkEntry {
  studentId: string
  subject: string
  examType: string
  marks: number
  totalMarks: number
}

interface BehaviorEntry {
  studentId: string
  type: "positive" | "negative" | "neutral"
  description: string
}

interface MessageEntry {
  to: string
  subject: string
  message: string
}

// Mock students data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Emma Smith",
    rollNumber: "101",
    class: "10A",
    email: "emma@student.com",
    parentEmail: "parent@example.com",
  },
  {
    id: "2",
    name: "John Doe",
    rollNumber: "102",
    class: "10A",
    email: "john@student.com",
    parentEmail: "john.parent@example.com",
  },
  {
    id: "3",
    name: "Sarah Wilson",
    rollNumber: "103",
    class: "10A",
    email: "sarah@student.com",
    parentEmail: "sarah.parent@example.com",
  },
  {
    id: "4",
    name: "Mike Johnson",
    rollNumber: "104",
    class: "10A",
    email: "mike@student.com",
    parentEmail: "mike.parent@example.com",
  },
]

export function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const [students] = useState<Student[]>(mockStudents)
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([])
  const [markEntry, setMarkEntry] = useState<MarkEntry>({
    studentId: "",
    subject: "",
    examType: "",
    marks: 0,
    totalMarks: 100,
  })
  const [behaviorEntry, setBehaviorEntry] = useState<BehaviorEntry>({
    studentId: "",
    type: "positive",
    description: "",
  })
  const [messageEntry, setMessageEntry] = useState<MessageEntry>({
    to: "",
    subject: "",
    message: "",
  })
  const [successMessage, setSuccessMessage] = useState("")

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendance((prev) => {
      const existing = prev.find((entry) => entry.studentId === studentId)
      if (existing) {
        return prev.map((entry) => (entry.studentId === studentId ? { ...entry, status } : entry))
      }
      return [...prev, { studentId, status }]
    })
  }

  const submitAttendance = () => {
    // In a real app, this would send data to the backend
    console.log("Submitting attendance:", { date: attendanceDate, attendance })
    setSuccessMessage("Attendance submitted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const submitMarks = () => {
    // In a real app, this would send data to the backend
    console.log("Submitting marks:", markEntry)
    setSuccessMessage("Marks submitted successfully!")
    setMarkEntry({
      studentId: "",
      subject: "",
      examType: "",
      marks: 0,
      totalMarks: 100,
    })
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const submitBehavior = () => {
    // In a real app, this would send data to the backend
    console.log("Submitting behavior:", behaviorEntry)
    setSuccessMessage("Behavior report submitted successfully!")
    setBehaviorEntry({
      studentId: "",
      type: "positive",
      description: "",
    })
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const sendMessage = () => {
    // In a real app, this would send data to the backend
    console.log("Sending message:", messageEntry)
    setSuccessMessage("Message sent successfully!")
    setMessageEntry({
      to: "",
      subject: "",
      message: "",
    })
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Physics", "Chemistry", "Biology"]
  const examTypes = ["Unit Test 1", "Unit Test 2", "Mid Term", "Final Exam", "Assignment", "Project"]

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
              <h1 className="text-xl font-bold">Teacher Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Class 10A</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendance.filter((a) => a.status === "present").length}</div>
              <p className="text-xs text-muted-foreground">Out of {students.length} students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendance.filter((a) => a.status === "absent").length}</div>
              <p className="text-xs text-muted-foreground">Students absent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Today</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendance.filter((a) => a.status === "late").length}</div>
              <p className="text-xs text-muted-foreground">Students late</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="marks">Marks</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Mark Attendance</span>
                </CardTitle>
                <CardDescription>Record daily attendance for your students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="attendance-date">Date:</Label>
                    <Input
                      id="attendance-date"
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-auto"
                    />
                  </div>

                  <div className="space-y-3">
                    {students.map((student) => {
                      const studentAttendance = attendance.find((a) => a.studentId === student.id)
                      return (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === "present" ? "default" : "outline"}
                              onClick={() => handleAttendanceChange(student.id, "present")}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === "absent" ? "destructive" : "outline"}
                              onClick={() => handleAttendanceChange(student.id, "absent")}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Absent
                            </Button>
                            <Button
                              size="sm"
                              variant={studentAttendance?.status === "late" ? "secondary" : "outline"}
                              onClick={() => handleAttendanceChange(student.id, "late")}
                            >
                              <Clock className="mr-1 h-4 w-4" />
                              Late
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button onClick={submitAttendance} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Add Marks</span>
                </CardTitle>
                <CardDescription>Record test scores and grades for students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-select">Student</Label>
                      <Select
                        value={markEntry.studentId}
                        onValueChange={(value) => setMarkEntry((prev) => ({ ...prev, studentId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.rollNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject-select">Subject</Label>
                      <Select
                        value={markEntry.subject}
                        onValueChange={(value) => setMarkEntry((prev) => ({ ...prev, subject: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exam-type-select">Exam Type</Label>
                      <Select
                        value={markEntry.examType}
                        onValueChange={(value) => setMarkEntry((prev) => ({ ...prev, examType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam type" />
                        </SelectTrigger>
                        <SelectContent>
                          {examTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marks">Marks Obtained</Label>
                      <Input
                        id="marks"
                        type="number"
                        value={markEntry.marks}
                        onChange={(e) => setMarkEntry((prev) => ({ ...prev, marks: Number(e.target.value) }))}
                        placeholder="Enter marks"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total-marks">Total Marks</Label>
                      <Input
                        id="total-marks"
                        type="number"
                        value={markEntry.totalMarks}
                        onChange={(e) => setMarkEntry((prev) => ({ ...prev, totalMarks: Number(e.target.value) }))}
                        placeholder="Enter total marks"
                      />
                    </div>
                  </div>

                  <Button onClick={submitMarks} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Marks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Behavior Report</span>
                </CardTitle>
                <CardDescription>Record student behavior and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="behavior-student">Student</Label>
                      <Select
                        value={behaviorEntry.studentId}
                        onValueChange={(value) => setBehaviorEntry((prev) => ({ ...prev, studentId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.rollNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="behavior-type">Behavior Type</Label>
                      <Select
                        value={behaviorEntry.type}
                        onValueChange={(value: "positive" | "negative" | "neutral") =>
                          setBehaviorEntry((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="behavior-description">Description</Label>
                    <Textarea
                      id="behavior-description"
                      value={behaviorEntry.description}
                      onChange={(e) => setBehaviorEntry((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the student's behavior..."
                      rows={3}
                    />
                  </div>

                  <Button onClick={submitBehavior} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Behavior Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Send Message</span>
                </CardTitle>
                <CardDescription>Communicate with parents about their child's progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message-to">Send to Parent</Label>
                    <Select
                      value={messageEntry.to}
                      onValueChange={(value) => setMessageEntry((prev) => ({ ...prev, to: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.parentEmail}>
                            {student.name}'s Parent ({student.parentEmail})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message-subject">Subject</Label>
                    <Input
                      id="message-subject"
                      value={messageEntry.subject}
                      onChange={(e) => setMessageEntry((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter message subject"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message-content">Message</Label>
                    <Textarea
                      id="message-content"
                      value={messageEntry.message}
                      onChange={(e) => setMessageEntry((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Type your message here..."
                      rows={5}
                    />
                  </div>

                  <Button onClick={sendMessage} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
