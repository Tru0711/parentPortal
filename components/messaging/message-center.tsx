"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Send, Mail, MailOpen, ArrowLeft, Plus, CheckCircle, User } from "lucide-react"
import {
  getMessageThreads,
  sendMessage,
  markMessageAsRead,
  formatMessageTime,
  type MessageThread,
} from "@/lib/messaging"

interface MessageCenterProps {
  userEmail: string
  userName: string
  userRole: "parent" | "teacher" | "student" | "admin"
  onClose: () => void
}

export function MessageCenter({ userEmail, userName, userRole, onClose }: MessageCenterProps) {
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    content: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [userEmail])

  const loadMessages = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    const userThreads = getMessageThreads(userEmail)
    setThreads(userThreads)
    setLoading(false)
  }

  const handleSendMessage = async () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.content) {
      return
    }

    try {
      await sendMessage(userEmail, newMessage.to, newMessage.subject, newMessage.content)
      setNewMessage({ to: "", subject: "", content: "" })
      setShowCompose(false)
      setSuccessMessage("Message sent successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
      loadMessages() // Refresh messages
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleSelectThread = (thread: MessageThread) => {
    setSelectedThread(thread)
    // Mark messages as read
    thread.messages.forEach((message) => {
      if (!message.read && message.to === userEmail) {
        markMessageAsRead(message.id)
      }
    })
    loadMessages() // Refresh to update read status
  }

  const getRecipientOptions = () => {
    if (userRole === "parent") {
      return [
        { value: "teacher@school.edu", label: "Sarah Johnson (Teacher)" },
        { value: "admin@school.edu", label: "School Administration" },
      ]
    } else if (userRole === "teacher") {
      return [
        { value: "parent@example.com", label: "John Smith (Parent)" },
        { value: "admin@school.edu", label: "School Administration" },
      ]
    }
    return []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] flex flex-col">
      {successMessage && (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <Button size="sm" onClick={() => setShowCompose(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Thread List */}
        <div className="w-1/3 border-r">
          <ScrollArea className="h-full">
            <div className="p-2">
              {threads.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                threads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 mb-2 ${
                      selectedThread?.id === thread.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleSelectThread(thread)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {thread.unreadCount > 0 ? (
                            <Mail className="h-4 w-4 text-primary" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium text-sm">
                            {thread.participants.find((p) => p !== userEmail)?.split("@")[0] || "Unknown"}
                          </span>
                        </div>
                        {thread.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatMessageTime(thread.lastMessageTime)}</span>
                    </div>
                    <p className="text-sm font-medium mb-1 truncate">{thread.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Message View */}
        <div className="flex-1 flex flex-col">
          {showCompose ? (
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Compose Message</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message-to">To</Label>
                  <select
                    id="message-to"
                    className="w-full p-2 border rounded-md"
                    value={newMessage.to}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, to: e.target.value }))}
                  >
                    <option value="">Select recipient</option>
                    {getRecipientOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message-subject">Subject</Label>
                  <Input
                    id="message-subject"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message-content">Message</Label>
                  <Textarea
                    id="message-content"
                    value={newMessage.content}
                    onChange={(e) => setNewMessage((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Type your message here..."
                    rows={8}
                  />
                </div>

                <Button onClick={handleSendMessage} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          ) : selectedThread ? (
            <div className="flex-1 flex flex-col">
              {/* Thread Header */}
              <div className="p-4 border-b">
                <h3 className="font-semibold">{selectedThread.subject}</h3>
                <p className="text-sm text-muted-foreground">
                  Conversation with{" "}
                  {selectedThread.participants.find((p) => p !== userEmail)?.split("@")[0] || "Unknown"}
                </p>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedThread.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.from === userEmail ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.from === userEmail ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {message.from === userEmail ? "You" : message.from.split("@")[0]}
                          </span>
                          <span className="text-xs opacity-70">{formatMessageTime(message.timestamp)}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Quick Reply */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a quick reply..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        const content = e.currentTarget.value.trim()
                        const recipient = selectedThread.participants.find((p) => p !== userEmail) || ""
                        sendMessage(userEmail, recipient, `Re: ${selectedThread.subject}`, content)
                        e.currentTarget.value = ""
                        loadMessages()
                      }
                    }}
                  />
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
