"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile } from "lucide-react"

export interface MessageReactionsProps {
  messageId: string
}

export function MessageReactions({ messageId }: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '👏']

  const handleReaction = async (reaction: string) => {
    try {
      const response = await fetch('/api/messages/react', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          reaction,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add reaction')
      }

      setIsOpen(false)
    } catch (error) {
      console.error('Error adding reaction:', error)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1">
        <div className="flex space-x-1">
          {reactions.map((reaction) => (
            <button
              key={reaction}
              className="text-2xl hover:bg-gray-100 rounded p-1"
              onClick={() => handleReaction(reaction)}
            >
              {reaction}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

