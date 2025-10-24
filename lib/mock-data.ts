// Mock data for the Parent Portal application
export interface StudentData {
  id: string
  name: string
  class: string
  rollNumber: string
  parentEmail: string
  attendance: AttendanceRecord[]
  marks: MarkRecord[]
  behavior: BehaviorRecord[]
  messages: MessageRecord[]
}

export interface AttendanceRecord {
  date: string
  status: "present" | "absent" | "late"
  subject?: string
}

export interface MarkRecord {
  subject: string
  examType: string
  marks: number
  totalMarks: number
  date: string
  grade: string
}

export interface BehaviorRecord {
  date: string
  type: "positive" | "negative" | "neutral"
  description: string
  teacher: string
}

export interface MessageRecord {
  id: string
  from: string
  to: string
  subject: string
  message: string
  date: string
  read: boolean
}

// Mock student data
export const mockStudentData: StudentData = {
  id: "4",
  name: "Emma Smith",
  class: "10A",
  rollNumber: "101",
  parentEmail: "parent@example.com",
  attendance: [
    { date: "2024-01-15", status: "present" },
    { date: "2024-01-16", status: "present" },
    { date: "2024-01-17", status: "absent" },
    { date: "2024-01-18", status: "present" },
    { date: "2024-01-19", status: "late" },
    { date: "2024-01-22", status: "present" },
    { date: "2024-01-23", status: "present" },
    { date: "2024-01-24", status: "present" },
    { date: "2024-01-25", status: "present" },
    { date: "2024-01-26", status: "absent" },
  ],
  marks: [
    { subject: "Mathematics", examType: "Unit Test 1", marks: 85, totalMarks: 100, date: "2024-01-20", grade: "A" },
    { subject: "Science", examType: "Unit Test 1", marks: 92, totalMarks: 100, date: "2024-01-21", grade: "A+" },
    { subject: "English", examType: "Unit Test 1", marks: 78, totalMarks: 100, date: "2024-01-22", grade: "B+" },
    { subject: "History", examType: "Unit Test 1", marks: 88, totalMarks: 100, date: "2024-01-23", grade: "A" },
    { subject: "Geography", examType: "Unit Test 1", marks: 82, totalMarks: 100, date: "2024-01-24", grade: "A-" },
  ],
  behavior: [
    {
      date: "2024-01-25",
      type: "positive",
      description: "Excellent participation in class discussion",
      teacher: "Ms. Johnson",
    },
    {
      date: "2024-01-24",
      type: "positive",
      description: "Helped classmate with mathematics problem",
      teacher: "Mr. Davis",
    },
    {
      date: "2024-01-22",
      type: "neutral",
      description: "Submitted assignment on time",
      teacher: "Ms. Wilson",
    },
  ],
  messages: [
    {
      id: "1",
      from: "Ms. Johnson",
      to: "parent@example.com",
      subject: "Emma's Progress Update",
      message: "Emma has been doing exceptionally well in Mathematics. She shows great problem-solving skills.",
      date: "2024-01-25",
      read: false,
    },
    {
      id: "2",
      from: "Mr. Davis",
      to: "parent@example.com",
      subject: "Science Project Reminder",
      message: "Please remind Emma about the science project due next week. She has chosen an interesting topic.",
      date: "2024-01-24",
      read: true,
    },
  ],
}

export function getStudentDataByParentEmail(parentEmail: string): StudentData | null {
  // In a real application, this would query the database
  if (parentEmail === "parent@example.com") {
    return mockStudentData
  }
  return null
}

export function calculateAttendancePercentage(attendance: AttendanceRecord[]): number {
  const totalDays = attendance.length
  const presentDays = attendance.filter((record) => record.status === "present").length
  return totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
}

export function calculateAverageMarks(marks: MarkRecord[]): number {
  if (marks.length === 0) return 0
  const totalPercentage = marks.reduce((sum, mark) => sum + (mark.marks / mark.totalMarks) * 100, 0)
  return Math.round(totalPercentage / marks.length)
}
