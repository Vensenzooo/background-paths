export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
}

export interface Chat {
  id: string
  participants: User[]
  messages: Message[]
}

