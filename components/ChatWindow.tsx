"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageInput } from "@/components/MessageInput"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { MessageReactions } from "@/components/MessageReactions"
import { GroupAdminActions } from "@/components/GroupAdminActions"

type Message = {
  id: string
  senderId: string
  content: string
  timestamp: Date
  isRead: boolean
  reactions: { [key: string]: string[] }
  messageType: "text" | "image" | "audio" | "document"
  filePath?: string
  fileMetadata?: {
    originalFilename: string
    fileSize: number
    mimeType: string
  }
}

type User = {
  id: string
  name: string
  avatar: string
  isTyping?: boolean
}

export function ChatWindow({
  chatId,
  isGroupChat = false,
  isAdmin = false,
}: {
  chatId: string
  isGroupChat?: boolean
  isAdmin?: boolean
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [messagesResponse, usersResponse, currentUserResponse] = await Promise.all([
          fetch(`/api/messages/${chatId}`),
          fetch(`/api/users/${chatId}`),
          fetch("/api/users/me"),
        ])

        if (!messagesResponse.ok || !usersResponse.ok || !currentUserResponse.ok) {
          throw new Error("Failed to fetch initial data")
        }

        const messagesData = await messagesResponse.json()
        const usersData = await usersResponse.json()
        const currentUserData = await currentUserResponse.json()

        setMessages(messagesData)
        setUsers(usersData)
        setCurrentUser(currentUserData)
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }

    const setupSSE = () => {
      const eventSource = new EventSource(`/api/sse/messages/${chatId}`)

      eventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data)
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }

      eventSource.addEventListener("typing", (event) => {
        const typingData = JSON.parse(event.data)
        setTypingUsers(typingData.users)
      })

      eventSource.addEventListener("read", (event) => {
        const readData = JSON.parse(event.data)
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === readData.messageId ? { ...msg, isRead: true } : msg)),
        )
      })

      eventSource.onerror = (error) => {
        console.error("SSE error:", error)
        eventSource.close()
      }

      return () => {
        eventSource.close()
      }
    }

    fetchInitialData()
    const cleanup = setupSSE()

    return cleanup
  }, [chatId])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleSendMessage = async (content: string, file?: File, messageType = "text") => {
    try {
      const formData = new FormData()
      formData.append("chatId", chatId)
      formData.append("content", content)
      formData.append("messageType", messageType)

      if (file) {
        formData.append("file", file)
      }

      const response = await fetch(`/api/messages`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const newMessage = await response.json()
      setMessages((prevMessages) => [...prevMessages, newMessage])
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleReaction = async (messageId: string, reaction: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reaction }),
      })

      if (!response.ok) {
        throw new Error("Failed to add reaction")
      }

      const updatedMessage = await response.json()
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? updatedMessage : msg)))
    } catch (error) {
      console.error("Error adding reaction:", error)
    }
  }

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      })

      if (!response.ok) {
        throw new Error("Failed to edit message")
      }

      const updatedMessage = await response.json()
      setMessages((prevMessages) => prevMessages.map((msg) => (msg.id === messageId ? updatedMessage : msg)))
      setEditingMessageId(null)
    } catch (error) {
      console.error("Error editing message:", error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId))
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  const handleKickUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/kick`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to kick user")
      }

      // Update users list or show a notification
    } catch (error) {
      console.error("Error kicking user:", error)
    }
  }

  const handleBanUser = async (userId: string, duration: "1h" | "1d" | "1w" | "permanent") => {
    try {
      const response = await fetch(`/api/chats/${chatId}/ban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, duration }),
      })

      if (!response.ok) {
        throw new Error("Failed to ban user")
      }

      // Update users list or show a notification
    } catch (error) {
      console.error("Error banning user:", error)
    }
  }

  const renderMessage = (message: Message) => {
    switch (message.messageType) {
      case "image":
        return (
          <img src={message.filePath || "/placeholder.svg"} alt="User uploaded image" className="max-w-xs rounded-lg" />
        )
      case "audio":
        return (
          <audio controls>
            <source src={message.filePath} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )
      case "document":
        return (
          <a href={message.filePath} target="_blank" rel="noopener noreferrer" className="flex items-center">
            <FileText className="mr-2" />
            {message.fileMetadata?.originalFilename}
          </a>
        )
      default:
        return <p>{message.content}</p>
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => {
          const user = users.find((u) => u.id === message.senderId)
          const isCurrentUser = currentUser?.id === message.senderId
          return (
            <div key={message.id} className={`flex items-start mb-4 ${isCurrentUser ? "justify-end" : ""}`}>
              {!isCurrentUser && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className={`relative group ${isCurrentUser ? "items-end" : "items-start"}`}>
                {!isCurrentUser && <p className="font-semibold">{user?.name}</p>}
                {editingMessageId === message.id ? (
                  <MessageInput
                    chatId={chatId}
                    initialContent={message.content}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-2 rounded-lg ${isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {renderMessage(message)}
                  </motion.div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleString()}
                  {message.isRead && " • Read"}
                </p>
                <div className="flex mt-1 space-x-1">
                  {Object.entries(message.reactions).map(([reaction, users]) => (
                    <div key={reaction} className="bg-gray-100 rounded-full px-2 py-1 text-xs">
                      {reaction} {users.length}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MessageReactions messageId={message.id} />
                  {isCurrentUser && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingMessageId(message.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {isGroupChat && isAdmin && !isCurrentUser && (
                    <GroupAdminActions
                      userId={message.senderId}
                      chatId={chatId}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messageEndRef} />
      </div>
      <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-sm text-gray-500 ml-4 mb-2"
          >
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
          </motion.div>
        )}
      </AnimatePresence>
      <MessageInput chatId={chatId} />
    </div>
  )
}

