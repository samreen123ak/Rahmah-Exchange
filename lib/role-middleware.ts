import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { authenticateRequest } from "./auth-middleware"

/**
 * Role-based access control middleware
 * Checks if user has required role(s)
 */
export async function requireRole(request: NextRequest, allowedRoles: string[]) {
  const { user, error } = await authenticateRequest(request)

  if (error || !user) {
    return {
      authorized: false,
      error: "Unauthorized",
      statusCode: 401,
    }
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      error: `This action requires one of: ${allowedRoles.join(", ")}`,
      statusCode: 403,
    }
  }

  return {
    authorized: true,
    user,
    error: null,
    statusCode: 200,
  }
}

/**
 * Higher-order function for role-protected API routes
 */
export function withRoleProtection(handler: Function, allowedRoles: string[]) {
  return async (request: NextRequest, ...args: any[]) => {
    const roleCheck = await requireRole(request, allowedRoles)

    if (!roleCheck.authorized) {
      return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
    }

    // Pass user to handler via request context
    (request as any).user = roleCheck.user
    return handler(request, ...args)
  }
}
