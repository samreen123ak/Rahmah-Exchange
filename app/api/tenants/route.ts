import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Tenant from "@/lib/models/Tenant"
import User from "@/lib/models/User"
import { requireRole } from "@/lib/role-middleware"
import { sendEmail } from "@/lib/email"
import { generateAdminInviteLink } from "@/lib/admin-invite-utils"
import { escapeHtml } from "@/lib/utils/html-sanitize"

function isValidHexColor(color: unknown) {
  return typeof color === "string" && /^#[0-9a-fA-F]{6}$/.test(color.trim())
}

function isPngLogoUrl(value: unknown) {
  if (value == null || value === "") return true // optional
  if (typeof value !== "string") return false
  const v = value.trim()
  // Allow PNG data URLs (what the super-admin UI currently sends)
  if (v.startsWith("data:")) {
    return v.startsWith("data:image/png;base64,")
  }
  // Allow hosted/static .png URLs
  try {
    const url = new URL(v)
    return url.pathname.toLowerCase().endsWith(".png")
  } catch {
    // If it's not a URL, only allow relative paths ending in .png
    return v.toLowerCase().endsWith(".png")
  }
}

/**
 * GET /api/tenants - List all tenants (super_admin only) or fetch by slug
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const availableOnly = url.searchParams.get("available") === "true"
  const slugParam = url.searchParams.get("slug") // Add slug parameter support

  // If requesting available tenants, allow authenticated staff
  if (availableOnly) {
    const roleCheck = await requireRole(request, ["super_admin", "admin", "caseworker", "donor"])
    if (!roleCheck.authorized) {
      return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
    }

    try {
      const user = roleCheck.user
      await dbConnect()
      // Get all active tenants except the current user's tenant
      const tenants = await Tenant.find({
        isActive: true,
        _id: { $ne: user.tenantId },
      })
        .select("_id name slug")
        .lean()
      return NextResponse.json({ tenants }, { status: 200 })
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
  }

  if (slugParam) {
    try {
      await dbConnect()
      const tenant = await Tenant.findOne({ slug: slugParam }).lean()
      if (!tenant) {
        return NextResponse.json({ message: "Masjid not found" }, { status: 404 })
      }
      return NextResponse.json(tenant, { status: 200 })
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
  }

  // Original behavior for admins listing all tenants
  const roleCheck = await requireRole(request, ["super_admin", "admin"])
  if (!roleCheck.authorized) {
    return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
  }

  try {
    await dbConnect()
    const tenants = await Tenant.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ tenants }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

/**
 * POST /api/tenants - Create new tenant (super_admin only)
 */
export async function POST(request: NextRequest) {
  const roleCheck = await requireRole(request, ["super_admin"])
  if (!roleCheck.authorized) {
    return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
  }

  try {
    const { name, slug, phone, address, adminEmail, adminName, logoUrl, brandColor } = await request.json()

    // Validation
    if (!name) {
      return NextResponse.json({ message: "Masjid name is required" }, { status: 400 })
    }

    if (!adminEmail || !adminName) {
      return NextResponse.json({ message: "Admin email and name are required" }, { status: 400 })
    }

    if (!address || !address.street || !address.city || !address.state || !address.zipCode) {
      return NextResponse.json(
        { message: "Complete address (street, city, state, zipCode) is required" },
        { status: 400 },
      )
    }

    if (!isPngLogoUrl(logoUrl)) {
      return NextResponse.json({ message: "Logo must be a PNG file" }, { status: 400 })
    }

    if (brandColor != null && brandColor !== "" && !isValidHexColor(brandColor)) {
      return NextResponse.json({ message: "Brand color must be a valid hex color like #0d9488" }, { status: 400 })
    }

    await dbConnect()

    // Auto-generate slug from name if not provided
    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    // Check if tenant with slug exists
    const existingTenant = await Tenant.findOne({ slug: generatedSlug })
    if (existingTenant) {
      return NextResponse.json({ message: "A masjid with this name already exists" }, { status: 409 })
    }

    // Create tenant - use adminEmail as the masjid email
    const tenant = await Tenant.create({
      name,
      slug: generatedSlug,
      email: adminEmail, // Use admin email as masjid email
      phone,
      address,
      logoUrl: logoUrl || null,
      brandColor: brandColor || "#0d9488",
    })

    // Admin email is required - create admin user and send invitation
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: adminEmail.toLowerCase() })

      let adminUser
      if (existingUser) {
        // Update existing user to be admin for this tenant
        existingUser.role = "admin"
        existingUser.tenantId = tenant._id
        existingUser.isActive = true
        if (adminName && existingUser.name !== adminName) {
          existingUser.name = adminName
        }
        await existingUser.save()
        adminUser = existingUser
      } else {
        // Create new admin user (without password - they'll set it via invitation)
        adminUser = await User.create({
          name: adminName,
          email: adminEmail.toLowerCase(),
          password: "temp_password_will_be_set_via_invite", // Temporary, will be changed
          role: "admin",
          tenantId: tenant._id,
          isActive: true,
        })
      }

      // Send invitation email
      const baseUrl = new URL(request.url).origin
      const inviteLink = generateAdminInviteLink(adminUser._id.toString(), tenant._id.toString(), tenant.slug, baseUrl)

      await sendEmail({
        to: adminEmail,
        subject: `Welcome to ${name} on Rahmah Exchange - Set Your Password`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">Welcome to Rahmah Exchange</h2>
            <p>Assalamu Alaikum ${escapeHtml(adminName)},</p>
            <p>You have been granted admin access to <strong>${escapeHtml(name)}</strong> on the Rahmah Exchange platform.</p>
            <p>To get started, please set your password by clicking the link below:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Set Your Password
              </a>
            </p>
           
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              <strong>Note:</strong> This link will expire in 7 days. If it expires, please contact the super administrator.
            </p>
            
            <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <strong>Applicant Form Link:</strong> Share the following link with applicants for your masjid:
            </p>
            <p style="text-align: center; margin: 15px 0;">
              <a href="${baseUrl}/${tenant.slug}/form" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Applicant Form for ${escapeHtml(name)}
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              Direct link: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px;">${baseUrl}/${tenant.slug}/form</code>
            </p>
            
            <p style="margin-top: 20px;">After setting your password, you can log in at: <a href="${baseUrl}/${tenant.slug}/staff/login">${baseUrl}/${tenant.slug}/staff/login</a></p>
            <p>Best regards,<br>Rahmah Exchange Team</p>
          </div>
        `,
        text: `Welcome to Rahmah Exchange

            Assalamu Alaikum ${adminName},

            You have been granted admin access to ${name} on the Rahmah Exchange platform.

            To get started, please set your password by clicking this link:
            ${inviteLink}

            Note: This link will expire in 7 days.

            APPLICANT FORM LINK:
            Share the following link with applicants for your masjid:
            ${baseUrl}/${tenant.slug}/staff/form

            After setting your password, you can log in at: ${baseUrl}/${tenant.slug}/staff/login

            Best regards,
            Rahmah Exchange Team`,
                  })
    } catch (userError: any) {
      console.error("Error creating admin user or sending invitation:", userError)
      // Rollback tenant creation if admin setup fails
      await Tenant.findByIdAndDelete(tenant._id)
      return NextResponse.json(
        {
          message: "Failed to create admin user or send invitation",
          error: userError.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ message: "Tenant created successfully", tenant }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
