import fs from "fs"
import fsPromises from "fs/promises"
import path from "path"
import crypto from "crypto"

type UploadResult = {
  pathname: string
  url: string
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export async function uploadBuffer(
  buffer: Buffer,
  originalName: string,
  baseUrl?: string
): Promise<UploadResult> {
  const useVercelBlob = !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN || !!process.env.VERCEL_BLOB_TOKEN || false

  // Prefer an explicit baseUrl if provided, else use NEXT_PUBLIC_API_URL if set
  const origin = baseUrl || process.env.NEXT_PUBLIC_API_URL || ""

  if (useVercelBlob) {
    try {
      // Dynamically import so local dev without @vercel/blob token won't fail
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
      const { put } = require("@vercel/blob")
      const blob = await put(originalName, buffer, {
        access: "public",
        addRandomSuffix: true,
      })

      return {
        pathname: blob.pathname,
        url: blob.url,
      }
    } catch (err) {
      console.error("Vercel Blob upload failed, falling back to local storage:", err)
      // fall through to local
    }
  }

  // Local storage fallback: save under public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads")
  await fsPromises.mkdir(uploadsDir, { recursive: true })

  const random = crypto.randomBytes(6).toString("hex")
  const safeName = sanitizeFilename(originalName || `upload-${Date.now()}`)
  const filename = `${Date.now()}-${random}-${safeName}`
  const filePath = path.join(uploadsDir, filename)

  await fsPromises.writeFile(filePath, buffer)

  const url = origin ? `${origin.replace(/\/$/, "")}/uploads/${encodeURIComponent(filename)}` : `/uploads/${encodeURIComponent(filename)}`

  return {
    pathname: `uploads/${filename}`,
    url,
  }
}

export async function deleteStored(pathOrUrl: string) {
  const useVercelBlob = !!process.env.VERCEL_BLOB_READ_WRITE_TOKEN || !!process.env.VERCEL_BLOB_TOKEN || false

  if (useVercelBlob) {
    try {
      // Dynamically import
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
      const { del } = require("@vercel/blob")
      await del(pathOrUrl)
      return
    } catch (err) {
      console.error("Vercel Blob deletion failed, will attempt local deletion:", err)
      // fall through
    }
  }

  try {
    // If a full URL is provided, attempt to extract the filename under /uploads/
    let filename = pathOrUrl
    try {
      const maybeUrl = new URL(pathOrUrl)
      const parts = maybeUrl.pathname.split("/")
      filename = parts[parts.length - 1]
    } catch (e) {
      // not a URL
      filename = path.basename(pathOrUrl)
    }

    const filePath = path.join(process.cwd(), "public", "uploads", decodeURIComponent(filename))
    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath)
    }
  } catch (err) {
    console.error("Local file deletion failed:", err)
  }
}
