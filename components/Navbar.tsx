"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-lg dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">Acme Chat</span>
            </Link>
          </div>
          <div className="flex items-center">
            {pathname !== "/login" && pathname !== "/register" && (
              <>
                <Link href="/login" passHref>
                  <Button variant="ghost" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

