"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
}

export function FriendsList() {
  const [friends, setFriends] = useState<User[]>([])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/friends")
        if (!response.ok) {
          throw new Error("Failed to fetch friends")
        }
        const data = await response.json()
        setFriends(data)
      } catch (error) {
        console.error("Error fetching friends:", error)
      }
    }

    const setupSSE = () => {
      const eventSource = new EventSource("/api/friends/sse")

      eventSource.onmessage = (event) => {
        const updatedFriend = JSON.parse(event.data)
        setFriends((prevFriends) => {
          const index = prevFriends.findIndex((friend) => friend.id === updatedFriend.id)
          if (index !== -1) {
            const newFriends = [...prevFriends]
            newFriends[index] = updatedFriend
            return newFriends
          } else {
            return [...prevFriends, updatedFriend]
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

    fetchFriends()
    const cleanup = setupSSE()

    return cleanup
  }, [])

  return (
    <div>
      <div className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">Friends</div>
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={friend.avatar} alt={friend.name} />
            <AvatarFallback>{friend.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{friend.name}</p>
          </div>
          <div
            className={`ml-auto w-2 h-2 rounded-full ${friend.status === "online" ? "bg-green-500" : "bg-gray-300"}`}
          />
        </div>
      ))}
    </div>
  )
}

