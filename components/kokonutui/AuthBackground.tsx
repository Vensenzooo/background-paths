"use client"

import { motion } from "framer-motion"
import * as React from "react"
import { cn } from "@/lib/utils"

interface AuthBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AuthBackground = React.forwardRef<HTMLDivElement, AuthBackgroundProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950",
          className
        )}
        {...props}
      >
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="w-full max-w-md mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </div>
    )
  }
)
AuthBackground.displayName = "AuthBackground"

export default AuthBackground

