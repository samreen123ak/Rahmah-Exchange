import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/lib/models/User"
import { requireRole } from "@/lib/role-middleware"
import { ensureInternalEmail } from "@/lib/internal-email"
import { getTenantFilter, requireTenant } from "@/lib/tenant-middleware"

/**
 * GET /api/users - List all users (admin only)
 */
export async function GET(request: NextRequest) {
  const roleCheck = await requireRole(request, ["admin", "super_admin"])
  if (!roleCheck.authorized) {
    return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
  }

  try {
    await dbConnect()
    
    // Super admin sees only admins from all masjids, regular admin sees all users from their tenant
    let filter: any = {}
    if (roleCheck.user.role === "super_admin") {
      // Super admin sees only admins from all masjids
      filter.role = "admin"
    } else {
      // Regular admin sees all users from their tenant
      const tenantCheck = await requireTenant(request)
      if (tenantCheck.tenantId) {
        filter.tenantId = tenantCheck.tenantId
      }
    }
    
    const users = await User.find(filter, "-password").lean()
    return NextResponse.json({ users }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

/**
 * POST /api/users - Create new user (admin only)
 */
export async function POST(request: NextRequest) {
  const roleCheck = await requireRole(request, ["admin"])
  if (!roleCheck.authorized) {
    return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
  }

  try {
    const { name, email, password, role, tenantId } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const validRoles = ["admin", "caseworker", "approver", "treasurer", "super_admin"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role. Must be admin, caseworker, approver, treasurer, or super_admin" }, { status: 400 })
    }

    await dbConnect()

    // Get tenantId from request if not provided (for regular admins, use their tenant)
    let userTenantId = tenantId
    if (!userTenantId && roleCheck.user.role !== "super_admin") {
      const tenantCheck = await requireTenant(request)
      if (tenantCheck.tenantId) {
        userTenantId = tenantCheck.tenantId
      }
    }

    // Super admin can create users without tenant, others must have tenant
    if (!userTenantId && roleCheck.user.role !== "super_admin") {
      return NextResponse.json({ message: "tenantId is required" }, { status: 400 })
    }

    // Check for duplicate email within tenant (or globally for super_admin)
    const emailFilter: any = { email }
    if (userTenantId) {
      emailFilter.tenantId = userTenantId
    }
    const existingUser = await User.findOne(emailFilter)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const userData: any = { name, email, password, role }
    if (userTenantId) {
      userData.tenantId = userTenantId
    }

    const user = await User.create(userData)

    // Ensure internal email is generated
    await ensureInternalEmail(user._id.toString())
    const updatedUser = await User.findById(user._id, "-password").lean()

    return NextResponse.json(
      {
        message: "User created successfully",
        user: updatedUser,
      },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
