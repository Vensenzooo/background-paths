"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserMinus, UserX, Clock } from "lucide-react"
import { toast } from "sonner"

type BanDuration = "1h" | "1d" | "1w" | "permanent"

interface GroupAdminActionsProps {
  userId: string
  chatId: string
}

export function GroupAdminActions({ userId, chatId }: GroupAdminActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleKick = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/chats/${chatId}/users/${userId}/kick`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to kick user')
      }

      toast.success('User kicked successfully')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to kick user')
      console.error('Error kicking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBan = async (duration: BanDuration) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/chats/${chatId}/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration }),
      })

      if (!response.ok) {
        throw new Error('Failed to ban user')
      }

      toast.success(`User banned for ${duration}`)
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to ban user')
      console.error('Error banning user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isLoading}>
          Admin Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleKick} disabled={isLoading}>
          <UserMinus className="mr-2 h-4 w-4" />
          Kick User
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBan("1h")} disabled={isLoading}>
          <Clock className="mr-2 h-4 w-4" />
          Ban for 1 hour
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBan("1d")} disabled={isLoading}>
          <Clock className="mr-2 h-4 w-4" />
          Ban for 1 day
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBan("1w")} disabled={isLoading}>
          <Clock className="mr-2 h-4 w-4" />
          Ban for 1 week
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBan("permanent")} disabled={isLoading}>
          <UserX className="mr-2 h-4 w-4" />
          Ban permanently
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

