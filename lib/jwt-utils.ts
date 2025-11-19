import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Allow full payload instead of only id
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30d",
  })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function decodeToken(token: string): any {
  return jwt.decode(token)
}
