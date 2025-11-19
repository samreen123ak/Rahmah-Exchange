import type { NextRequest } from "next/server"
import { dbConnect } from "./db"
import BlacklistedToken from "./models/BlacklistedToken"
import User from "./models/User"
import { verifyToken } from "./jwt-utils"

// Local interface for authenticated user
interface AuthenticatedUser {
  _id: string
  name: string
  email: string
  role: string
}

export async function authenticateRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { user: null, error: "No token provided" }
    }

    const token = authHeader.substring(7)

    await dbConnect()

    const blacklistedToken = await BlacklistedToken.findOne({ token })
    if (blacklistedToken) {
      return { user: null, error: "Token is blacklisted" }
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.id) {
      return { user: null, error: "Invalid or expired token" }
    }

    // Explicitly type the user
    const user = (await User.findById(decoded.id).lean()) as AuthenticatedUser | null
    if (!user) {
      return { user: null, error: "User not found" }
    }

    // Ensure role exists
    if (!user.role) user.role = "user"

    return { user, error: null }
  } catch (error) {
    console.error("Authentication error:", error)
    return { user: null, error: "Authentication failed" }
  }
}
