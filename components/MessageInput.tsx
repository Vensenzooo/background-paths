"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Image, Mic, Paperclip } from "lucide-react"

export interface MessageInputProps {
  chatId: string
  initialContent?: string
}

export function MessageInput({ chatId, initialContent = "" }: MessageInputProps) {
  const [message, setMessage] = useState(initialContent)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      try {
        const response = await fetch("/api/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId,
            content: message,
            messageType: "text"
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

        setMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
      }
    }
  }

  const sendMessage = async (content: string, file?: File, messageType: string = "text") => {
    try {
      const formData = new FormData()
      formData.append("chatId", chatId)
      formData.append("content", content)
      formData.append("messageType", messageType)
      if (file) {
        formData.append("file", file)
      }

      const response = await fetch("/api/messages/send", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      // Optional: Trigger a refresh or update of the messages list
      // You can use Server-Sent Events, WebSocket, or manual refresh here
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const messageType = file.type.startsWith("image/") ? "image" : "document"
      await sendMessage("", file, messageType)
    }
  }

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      setIsRecording(true)
      // Start recording logic here
    } else {
      setIsRecording(false)
      // Stop recording and get the audio blob
      // const audioBlob = await stopRecording()
      // await sendMessage("", new File([audioBlob], "audio.webm", { type: "audio/webm" }), "audio")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white dark:bg-gray-800">
      <Input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 mr-2"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
        <Image className="h-4 w-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={handleVoiceRecording}>
        <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
        <Paperclip className="h-4 w-4" />
      </Button>
      <Button type="submit">
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  )
}

