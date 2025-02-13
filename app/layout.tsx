import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Navbar } from "@/components/Navbar"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Acme Chat",
  description: "A real-time chat application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-background">{children}</main>
      </body>
    </html>
  )
}



import './globals.css'