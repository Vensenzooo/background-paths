import "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    avatar?: string
  }

  interface Session {
    user: User & {
      id: string
      email: string
      name: string
      avatar?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    avatar?: string
  }
}
