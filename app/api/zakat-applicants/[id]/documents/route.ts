import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import ZakatApplicant from "@/lib/models/ZakatApplicant"
import DocumentAudit from "@/lib/models/DocumentAudit"
import { verifyApplicantToken } from "@/lib/applicant-token-utils"
import { uploadBuffer } from "@/lib/storage"
import { requireRole } from "@/lib/role-middleware"

// POST - Upload new documents (applicant OR caseworker on behalf of applicant)
export async function POST(request: NextRequest, context: any) {
  try {
    const { params } = context
    const applicantId = (await params).id

    const authHeader = request.headers.get("authorization")
    let uploadedBy = ""
    let actionBy = "applicant"

    if (authHeader?.startsWith("Bearer ")) {
      // Staff member uploading on behalf of applicant
      const roleCheck = await requireRole(request, ["admin", "caseworker"])
      if (!roleCheck.authorized) {
        return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
      }
      actionBy = "caseworker"
      uploadedBy = roleCheck.user?.email || "caseworker"
    } else {
      // Applicant uploading their own documents
      const token = new URL(request.url).searchParams.get("token")
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const decoded = verifyApplicantToken(token)
      if (!decoded || decoded.applicantId !== applicantId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      uploadedBy = decoded.applicantEmail || "applicant"
    }

    const formData = await request.formData()
    const uploadedFiles = formData.getAll("documents") as any[]

    await dbConnect()

    const applicant = await ZakatApplicant.findById(applicantId)
    if (!applicant) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const documentMetadata: any[] = []
    const uploadErrors: string[] = []

    // Upload each file to Vercel Blob
    for (const f of uploadedFiles) {
      if (f && typeof f === "object" && typeof f.arrayBuffer === "function") {
        const originalName = (f as any).name || `upload-${Date.now()}`
        
        try {
          const buffer = Buffer.from(await (f as any).arrayBuffer())
          const blob = await uploadBuffer(buffer, originalName, new URL(request.url).origin)

          const docMetadata = {
            filename: blob.pathname,
            originalname: originalName,
            mimeType: f.type || "application/octet-stream",
            size: buffer.length,
            url: blob.url,
            uploadedAt: new Date(),
            // Don't set _id - Mongoose will auto-generate ObjectId for subdocuments
          }

          documentMetadata.push(docMetadata)

          const audit = new DocumentAudit({
            applicantId,
            documentId: blob.pathname,
            action: "uploaded",
            actionBy,
            uploadedBy,
            originalFilename: originalName,
            fileSize: buffer.length,
            mimeType: f.type || "application/octet-stream",
          })
          await audit.save()

          console.log(`Document uploaded: ${blob.pathname} by ${uploadedBy}`)
        } catch (err: any) {
          console.error(`File upload error for ${originalName}:`, err)
          uploadErrors.push(`${originalName}: ${err.message || "Upload failed"}`)
        }
      } else {
        uploadErrors.push("Invalid file object")
      }
    }

    if (documentMetadata.length === 0 && uploadedFiles.length > 0) {
      return NextResponse.json(
        { error: "Failed to upload documents", details: uploadErrors },
        { status: 400 }
      )
    }

    // Add documents to applicant
    if (documentMetadata.length > 0) {
      applicant.documents.push(...documentMetadata)
      await applicant.save()
    }

    if (uploadErrors.length > 0 && documentMetadata.length > 0) {
      return NextResponse.json(
        { 
          message: `Documents uploaded successfully, but some failed: ${uploadErrors.join(", ")}`, 
          applicant 
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: "Documents uploaded successfully", applicant },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("POST documents error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = context
    const applicantId = (await params).id

    // Verify auth (applicant token OR caseworker role)
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const roleCheck = await requireRole(request, ["admin", "caseworker"])
      if (!roleCheck.authorized) {
        return NextResponse.json({ message: roleCheck.error }, { status: roleCheck.statusCode })
      }
    } else {
      const token = new URL(request.url).searchParams.get("token")
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const decoded = verifyApplicantToken(token)
      if (!decoded || decoded.applicantId !== applicantId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    await dbConnect()
    const applicant = await ZakatApplicant.findById(applicantId, "documents")
    if (!applicant) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Get audit trail for all documents
    const auditLogs = await DocumentAudit.find({ applicantId }).sort({ createdAt: -1 })

    return NextResponse.json(
      { documents: applicant.documents, auditLogs },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
