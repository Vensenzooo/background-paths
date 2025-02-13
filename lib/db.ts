import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export async function connectToDatabase() {
  try {
    await prisma.$connect()
    console.log("Connected to the database successfully")
  } catch (error) {
    console.error("Failed to connect to the database:", error)
    throw error
  }
}

export async function disconnectFromDatabase() {
  try {
    await prisma.$disconnect()
    console.log("Disconnected from the database successfully")
  } catch (error) {
    console.error("Failed to disconnect from the database:", error)
    throw error
  }
}

export async function query<T>(queryFn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
  try {
    await connectToDatabase()
    const result = await queryFn(prisma)
    return result
  } catch (error) {
    console.error("Error executing database query:", error)
    throw error
  } finally {
    await disconnectFromDatabase()
  }
}

