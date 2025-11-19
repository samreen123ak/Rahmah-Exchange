// import { NextRequest, NextResponse } from "next/server"
// import { dbConnect } from "@/lib/db"
// import ZakatApplicant from "@/lib/models/ZakatApplicant"
// import { authenticateRequest } from "@/lib/auth-middleware"

// // GET by ID – public
// export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params
//     await dbConnect()
//     const applicant = await ZakatApplicant.findById(id)
//     if (!applicant) return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
//     return NextResponse.json(applicant)
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

// // PUT – requires auth
// export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params
//     const { error } = await authenticateRequest(request)
//     if (error) return NextResponse.json({ message: error }, { status: 401 })

//     const body = await request.json()
//     await dbConnect()

//     // Prevent duplicate email
//     if (body.email) {
//       const existing = await ZakatApplicant.findOne({ email: body.email, _id: { $ne: id } })
//       if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 })
//     }

//     const updated = await ZakatApplicant.findByIdAndUpdate(id, body, { new: true, runValidators: true })
//     if (!updated) return NextResponse.json({ error: "Applicant not found" }, { status: 404 })

//     return NextResponse.json({ message: "Applicant updated successfully", applicant: updated })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

// // DELETE – requires auth
// export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params
//     const { error } = await authenticateRequest(request)
//     if (error) return NextResponse.json({ message: error }, { status: 401 })

//     await dbConnect()
//     const deleted = await ZakatApplicant.findByIdAndDelete(id)
//     if (!deleted) return NextResponse.json({ error: "Applicant not found" }, { status: 404 })

//     return NextResponse.json({ message: "Applicant deleted successfully" })
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import ZakatApplicant from "@/lib/models/ZakatApplicant"
import DocumentAudit from "@/lib/models/DocumentAudit"
import { authenticateRequest } from "@/lib/auth-middleware"
import { verifyApplicantToken } from "@/lib/applicant-token-utils"
import { sendEmail } from "@/lib/email"

// GET by ID – supports both public access and applicant portal access with token
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = new URL(request.url).searchParams.get("token")

    // If token is provided, verify applicant access
    if (token) {
      const decoded = verifyApplicantToken(token)
      if (!decoded || decoded.applicantId !== id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    await dbConnect()
    const applicant = await ZakatApplicant.findById(id)
    if (!applicant) return NextResponse.json({ error: "Applicant not found" }, { status: 404 })

    // If token was used, also return document logs
    if (token) {
      const documentLogs = await DocumentAudit.find({ applicantId: id }).sort({ createdAt: -1 })
      return NextResponse.json({ applicant, documentLogs }, { status: 200 })
    }

    return NextResponse.json(applicant)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT – requires auth
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await authenticateRequest(request)
    if (error) return NextResponse.json({ message: error }, { status: 401 })

    const body = await request.json()
    await dbConnect()

    // Prevent duplicate email
    if (body.email) {
      const existing = await ZakatApplicant.findOne({ email: body.email, _id: { $ne: id } })
      if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const currentApplicant = await ZakatApplicant.findById(id)
    if (!currentApplicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }
    
    const statusChanged = currentApplicant && body.status && currentApplicant.status !== body.status

    // Don't overwrite documents if they're not provided in the body
    // Documents should be managed separately via the documents API
    const updateBody = { ...body }
    // Only preserve documents if they're explicitly provided and not empty
    // If documents field is missing or is an empty array, don't include it in the update
    if (!updateBody.hasOwnProperty('documents') || (Array.isArray(updateBody.documents) && updateBody.documents.length === 0)) {
      // Preserve existing documents by not including documents in the update
      delete updateBody.documents
    }

    const updated = await ZakatApplicant.findByIdAndUpdate(id, updateBody, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ error: "Applicant not found" }, { status: 404 })

    if (statusChanged && updated.email && (body.status === "Approved" || body.status === "Rejected")) {
      const isApproved = body.status === "Approved"
      const subject = isApproved ? "Your Rahmah Application - Approved" : "Your Rahmah Application - Update"
      const htmlContent = generateStatusEmailTemplate(updated, isApproved)

      await sendEmail({
        to: updated.email,
        subject,
        html: htmlContent,
      })
    }

    return NextResponse.json({ message: "Applicant updated successfully", applicant: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE – requires auth
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await authenticateRequest(request)
    if (error) return NextResponse.json({ message: error }, { status: 401 })

    await dbConnect()
    const deleted = await ZakatApplicant.findByIdAndDelete(id)
    if (!deleted) return NextResponse.json({ error: "Applicant not found" }, { status: 404 })

    return NextResponse.json({ message: "Applicant deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function generateStatusEmailTemplate(applicant: any, isApproved: boolean): string {
  const firstName = applicant.firstName || "Applicant"
  const caseId = applicant.caseId || "N/A"
  const amountRequested = applicant.amountRequested || "N/A"

  if (isApproved) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .success-badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
            strong { color: #0d9488; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Good News!</h1>
            </div>
            <div class="content">
              <p>Dear ${firstName},</p>
              <p>We are pleased to inform you that your application for assistance has been <strong>approved</strong>.</p>
              <div class="success-badge">✓ APPROVED</div>
              <p><strong>Application Details:</strong></p>
              <ul>
                <li><strong>Case ID:</strong> ${caseId}</li>
                <li><strong>Amount Requested:</strong> $${amountRequested}</li>
              </ul>
              <p>Our team will be in touch with you shortly with next steps regarding your grant. If you have any questions, please don't hesitate to reach out.</p>
              <p>Thank you for choosing Rahmah Exchange.</p>
              <p>Warm regards,<br><strong>Rahmah Support Team</strong></p>
              <div class="footer">
                <p>© 2025 Rahmah Exchange. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  } else {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
            strong { color: #6366f1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${firstName},</p>
              <p>Thank you for submitting your application for assistance. After careful review, we regret to inform you that your application has been <strong>rejected</strong> at this time.</p>
              <p><strong>Application Details:</strong></p>
              <ul>
                <li><strong>Case ID:</strong> ${caseId}</li>
                <li><strong>Amount Requested:</strong> $${amountRequested}</li>
              </ul>
              <p>This decision was made based on our review criteria and available resources. We appreciate your understanding and encourage you to apply again in the future if your circumstances change.</p>
              <p>If you have any questions about this decision, our support team is here to help.</p>
              <p>Thank you for your patience.</p>
              <p>Warm regards,<br><strong>Rahmah Support Team</strong></p>
              <div class="footer">
                <p>© 2025 Rahmah Exchange. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }
}
