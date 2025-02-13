import { ChatWindow } from "@/components/ChatWindow"

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat Room</h1>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatWindow chatId={params.id} />
      </main>
    </div>
  )
}

