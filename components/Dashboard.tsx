"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Users, Settings, LogOut } from "lucide-react"
import { ChatList } from "@/components/ChatList"
import { FriendsList } from "@/components/FriendsList"

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <Button variant="ghost" size="icon" className="mb-4">
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="mb-4">
          <Users className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="mb-4">
          <Settings className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="mt-auto">
          <LogOut className="h-6 w-6" />
        </Button>
      </div>

      {/* Chat List */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <ChatList />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Area (placeholder) */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">Select a conversation to start chatting</p>
        </div>
      </div>

      {/* Friends List */}
      <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        <FriendsList />
      </div>
    </div>
  )
}

