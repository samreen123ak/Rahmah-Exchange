import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const { filename } = await params

    if (filename.startsWith("http")) {
      return NextResponse.redirect(filename, 302)
    }

    // For legacy support - fetch from Blob by pathname
    // This endpoint can now just redirect to the blob storage URL
    const blobUrl = `https://blob.vercel-storage.com/${filename}`

    return NextResponse.redirect(blobUrl, 302)

    // Security: Ensure file is within uploads directory
    // const uploadsDir = path.join(process.cwd(), "public", "uploads")
    // let filePath = path.join(uploadsDir, filename)

    // // If not found in public/uploads, check ephemeral /tmp/uploads (serverless)
    // try {
    //   const tmpPath = path.join("/tmp/uploads", filename)
    //   // prefer tmp if exists
    //   const { existsSync } = require("fs")
    //   if (existsSync(tmpPath)) {
    //     filePath = tmpPath
    //   }
    // } catch (e) {}

    // // Security: Ensure file is within uploads directory
    // if (!filePath.startsWith(uploadsDir)) {
    //   return NextResponse.json({ error: "Invalid file path" }, { status: 403 })
    // }

    // const fileBuffer = await readFile(filePath)
    // const ext = filename.split(".").pop()?.toLowerCase()

    // const mimeTypes: Record<string, string> = {
    //   pdf: "application/pdf",
    //   png: "image/png",
    //   jpg: "image/jpeg",
    //   jpeg: "image/jpeg",
    //   gif: "image/gif",
    //   doc: "application/msword",
    //   docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // }

    // const contentType = mimeTypes[ext || ""] || "application/octet-stream"

    // return new NextResponse(fileBuffer, {
    //   headers: {
    //     "Content-Type": contentType,
    //     "Content-Disposition": `inline; filename="${filename}"`,
    //     "Cache-Control": "public, max-age=31536000",
    //   },
    // })
  } catch (error) {
    console.error("Document fetch error:", error)
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }
}
