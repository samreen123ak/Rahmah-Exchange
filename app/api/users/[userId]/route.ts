import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/lib/models/User"
import { requireRole } from "@/lib/role-middleware"
import { ensureInternalEmail } from "@/lib/internal-email"

/**
 * GET /api/users/[userId] - Get user details
 */
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const roleCheck = await requireRole(request, ["admin", "caseworker", "approver", "treasurer"])
  if (!roleCheck.authorized) {
    return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
  }

  try {
    await dbConnect()
    const user = await User.findById(params.userId, "-password").lean()
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ user }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

/**
 * PATCH /api/users/[userId] - Update user (admin only)
 */
export async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  const roleCheck = await requireRole(request, ["admin"])
  if (!roleCheck.authorized) {
    return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
  }

  try {
    const { name, role, isActive } = await request.json()
    await dbConnect()

    const user = await User.findById(params.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (name) {
      user.name = name
    }
    if (role) {
      const validRoles = ["admin", "caseworker", "approver", "treasurer", "applicant"]
      if (!validRoles.includes(role)) {
        return NextResponse.json({ message: "Invalid role" }, { status: 400 })
      }
      user.role = role
    }
    if (isActive !== undefined) {
      user.isActive = isActive
    }

    await user.save()

    // Ensure internal email is updated if role changed
    if (role) {
      await ensureInternalEmail(user._id.toString())
    }

    const updatedUser = await User.findById(user._id, "-password").lean()
    return NextResponse.json({ user: updatedUser, message: "User updated successfully" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
