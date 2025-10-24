export interface User {
  id: string
  email: string
  name: string
  role: "parent" | "student" | "teacher" | "admin"
  contactNumber?: string
  relation?: string
  class?: string
  rollNumber?: string
  parentEmail?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

// Mock user database - In production, this would be a real database
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@school.edu",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "teacher@school.edu",
    name: "Sarah Johnson",
    role: "teacher",
  },
  {
    id: "3",
    email: "parent@example.com",
    name: "John Smith",
    role: "parent",
    contactNumber: "+1234567890",
    relation: "Father",
  },
  {
    id: "4",
    email: "student@example.com",
    name: "Emma Smith",
    role: "student",
    class: "10A",
    rollNumber: "101",
    parentEmail: "parent@example.com",
  },
]

export async function authenticateUser(email: string, password: string): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email)

  if (!user) {
    return { success: false, message: "User not found" }
  }

  // In production, verify password hash
  if (password !== "password123") {
    return { success: false, message: "Invalid password" }
  }

  // Generate mock JWT token
  const token = `mock-jwt-${user.id}-${Date.now()}`

  return {
    success: true,
    user,
    token,
    message: "Login successful",
  }
}

export async function registerUser(userData: Partial<User> & { password: string }): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === userData.email)
  if (existingUser) {
    return { success: false, message: "User already exists" }
  }

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email: userData.email!,
    name: userData.name!,
    role: userData.role!,
    contactNumber: userData.contactNumber,
    relation: userData.relation,
    class: userData.class,
    rollNumber: userData.rollNumber,
    parentEmail: userData.parentEmail,
  }

  mockUsers.push(newUser)

  // Generate mock JWT token
  const token = `mock-jwt-${newUser.id}-${Date.now()}`

  return {
    success: true,
    user: newUser,
    token,
    message: "Registration successful",
  }
}

export function verifyToken(token: string): User | null {
  // In production, verify JWT token
  const userId = token.split("-")[2]
  return mockUsers.find((u) => u.id === userId) || null
}
