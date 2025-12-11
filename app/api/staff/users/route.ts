import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import User from "@/lib/models/User"
import { requireRole } from "@/lib/role-middleware"

/**
 * GET /api/staff/users - List all staff users (for messaging)
 * - Super admin: sees only admins from all masjids
 * - Regular staff: sees all staff from their masjid
 */
export async function GET(request: NextRequest) {
  const roleCheck = await requireRole(request, ["admin", "caseworker", "approver", "treasurer", "super_admin"])
  if (!roleCheck.authorized) {
    return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
  }

  try {
    await dbConnect()
    
    // Build filter based on user role
    let filter: any = { isActive: { $ne: false } }
    
    if (roleCheck.user.role === "super_admin") {
      // Super admin sees only admins from all masjids
      filter.role = "admin"
    } else {
      // Regular staff sees all staff from their masjid
      filter.role = { $in: ["admin", "caseworker", "approver", "treasurer"] }
      
      // Filter by tenant if user has tenantId
      if (roleCheck.user.tenantId) {
        filter.tenantId = roleCheck.user.tenantId
      }
    }
    
    const users = await User.find(filter, "-password").lean()
    
    return NextResponse.json({ users }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

