export interface Message {
  id: string
  from: string
  to: string
  subject: string
  content: string
  timestamp: string
  read: boolean
  type: "teacher-to-parent" | "parent-to-teacher" | "admin-broadcast"
}

export interface MessageThread {
  id: string
  participants: string[]
  subject: string
  messages: Message[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

// Mock messaging data
const mockMessages: Message[] = [
  {
    id: "1",
    from: "teacher@school.edu",
    to: "parent@example.com",
    subject: "Emma's Progress Update",
    content:
      "Emma has been doing exceptionally well in Mathematics. She shows great problem-solving skills and actively participates in class discussions. Keep up the excellent work!",
    timestamp: "2024-01-25T10:30:00Z",
    read: false,
    type: "teacher-to-parent",
  },
  {
    id: "2",
    from: "teacher@school.edu",
    to: "parent@example.com",
    subject: "Science Project Reminder",
    content:
      "Please remind Emma about the science project due next week. She has chosen an interesting topic on renewable energy. If she needs any materials, please let me know.",
    timestamp: "2024-01-24T14:15:00Z",
    read: true,
    type: "teacher-to-parent",
  },
  {
    id: "3",
    from: "parent@example.com",
    to: "teacher@school.edu",
    subject: "Re: Science Project Reminder",
    content:
      "Thank you for the reminder. Emma is very excited about her project. We'll make sure she has all the materials she needs. Is there a specific format for the presentation?",
    timestamp: "2024-01-24T16:45:00Z",
    read: true,
    type: "parent-to-teacher",
  },
  {
    id: "4",
    from: "admin@school.edu",
    to: "all-parents",
    subject: "Parent-Teacher Meeting Schedule",
    content:
      "Dear Parents, we are pleased to announce the upcoming Parent-Teacher meetings scheduled for February 15-16, 2024. Please check the school portal for your assigned time slots.",
    timestamp: "2024-01-23T09:00:00Z",
    read: true,
    type: "admin-broadcast",
  },
]

export function getMessagesForUser(userEmail: string): Message[] {
  return mockMessages.filter((msg) => msg.to === userEmail || msg.from === userEmail || msg.to === "all-parents")
}

export function getMessageThreads(userEmail: string): MessageThread[] {
  const userMessages = getMessagesForUser(userEmail)
  const threads: { [key: string]: MessageThread } = {}

  userMessages.forEach((message) => {
    const otherParticipant = message.from === userEmail ? message.to : message.from
    const threadKey = [userEmail, otherParticipant].sort().join("-")

    if (!threads[threadKey]) {
      threads[threadKey] = {
        id: threadKey,
        participants: [userEmail, otherParticipant],
        subject: message.subject,
        messages: [],
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0,
      }
    }

    threads[threadKey].messages.push(message)

    // Update thread metadata
    if (new Date(message.timestamp) > new Date(threads[threadKey].lastMessageTime)) {
      threads[threadKey].lastMessage = message.content.substring(0, 100) + "..."
      threads[threadKey].lastMessageTime = message.timestamp
    }

    if (!message.read && message.to === userEmail) {
      threads[threadKey].unreadCount++
    }
  })

  // Sort messages within each thread by timestamp
  Object.values(threads).forEach((thread) => {
    thread.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  })

  return Object.values(threads).sort(
    (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime(),
  )
}

export function sendMessage(from: string, to: string, subject: string, content: string): Message {
  const newMessage: Message = {
    id: (mockMessages.length + 1).toString(),
    from,
    to,
    subject,
    content,
    timestamp: new Date().toISOString(),
    read: false,
    type: from.includes("teacher") ? "teacher-to-parent" : "parent-to-teacher",
  }

  mockMessages.push(newMessage)
  return newMessage
}

export function markMessageAsRead(messageId: string): void {
  const message = mockMessages.find((msg) => msg.id === messageId)
  if (message) {
    message.read = true
  }
}

export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString()
  }
}
