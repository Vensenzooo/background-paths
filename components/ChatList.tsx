"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Conversation = {
  id: string
  name: string
  avatar: string
  lastMessage: string
  unreadCount: number
  isGroup: boolean
  updatedAt: string
}

export function ChatList() {
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    // Fonction pour récupérer les conversations initiales
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations")
        if (!response.ok) {
          throw new Error("Failed to fetch conversations")
        }
        const data = await response.json()
        setConversations(data)
      } catch (error) {
        console.error("Error fetching conversations:", error)
      }
    }

    // Fonction pour établir une connexion SSE
    const setupSSE = () => {
      const eventSource = new EventSource("/api/conversations/sse")

      eventSource.onmessage = (event) => {
        const updatedConversation = JSON.parse(event.data)
        setConversations((prevConversations) => {
          const index = prevConversations.findIndex((conv) => conv.id === updatedConversation.id)
          if (index !== -1) {
            const newConversations = [...prevConversations]
            newConversations[index] = updatedConversation
            return newConversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          } else {
            return [...prevConversations, updatedConversation].sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
            )
          }
        })
      }

      eventSource.onerror = (error) => {
        console.error("SSE error:", error)
        eventSource.close()
      }

      return () => {
        eventSource.close()
      }
    }

    fetchConversations()
    const cleanup = setupSSE()

    return cleanup
  }, [])

  return (
    <div>
      <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Recent Conversations</div>
      {conversations.map((conversation) => (
        <Link href={`/chat/${conversation.id}`} key={conversation.id}>
          <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{conversation.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{conversation.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
            </div>
            {conversation.unreadCount > 0 && (
              <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

