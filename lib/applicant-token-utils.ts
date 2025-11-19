import jwt from "jsonwebtoken"

// Use JWT_SECRET as fallback if APPLICANT_JWT_SECRET is not set
const APPLICANT_SECRET = process.env.APPLICANT_JWT_SECRET || process.env.JWT_SECRET || "your-secret-key-change-in-production"

/**
 * Generate a magic link token for applicant portal access
 * Token expires in 30 days (long-lived for convenience)
 */
export function generateApplicantToken(applicantId: string): string {
  return jwt.sign({ applicantId, type: "applicant" }, APPLICANT_SECRET, {
    expiresIn: "30d",
  })
}

/**
 * Verify applicant magic link token
 */
export function verifyApplicantToken(token: string): { applicantId: string } | null {
  // Try verifying with both secrets to handle tokens issued in different environments
  const secretsToTry = [] as string[]
  if (process.env.APPLICANT_JWT_SECRET) secretsToTry.push(process.env.APPLICANT_JWT_SECRET)
  if (process.env.JWT_SECRET && process.env.JWT_SECRET !== process.env.APPLICANT_JWT_SECRET) secretsToTry.push(process.env.JWT_SECRET)
  if (secretsToTry.length === 0) secretsToTry.push(APPLICANT_SECRET)

  for (const secret of secretsToTry) {
    try {
      const decoded = jwt.verify(token, secret) as any
      if (decoded && decoded.type === "applicant" && decoded.applicantId) {
        return { applicantId: decoded.applicantId }
      }
    } catch (err) {
      // ignore and try next secret
    }
  }

  console.error("Token verification failed: invalid or expired applicant token")
  return null
}

/**
 * Generate magic link URL for email
 */
export function generateMagicLink(applicantId: string, baseUrl: string): string {
  const token = generateApplicantToken(applicantId)
  // Ensure baseUrl doesn't have trailing slash
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return `${cleanBaseUrl}/applicant-portal/login?token=${encodeURIComponent(token)}`
}
