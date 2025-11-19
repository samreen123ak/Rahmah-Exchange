"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, CheckCircle, AlertCircle, FileText, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ApplicantMessages from "@/components/applicant-messages"

interface Document {
  _id: string
  filename: string
  originalname: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
}

interface DocumentLog {
  _id: string
  action: string
  actionBy: string
  uploadedBy: string
  originalFilename: string
  fileSize: number
  uploadedAt: string
  notes?: string
}

interface Applicant {
  _id: string
  firstName: string
  lastName: string
  email: string
  mobilePhone: string
  caseId: string
  status: string
  requestType: string
  amountRequested: number
  documents: Document[]
  createdAt: string
}

function Toast({ message, type, isVisible }: { message: string; type: "success" | "error"; isVisible: boolean }) {
  if (!isVisible) return null
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg flex items-center gap-2 text-white font-semibold z-50 animate-in fade-in slide-in-from-top-5 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      {message}
    </div>
  )
}

export default function ApplicantPortalPage() {
  const params = useParams()
  const router = useRouter()
  const applicantId = params.id as string

  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [documentLogs, setDocumentLogs] = useState<DocumentLog[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [creatingConversation, setCreatingConversation] = useState(false)
  const [conversationError, setConversationError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  useEffect(() => {
    // Verify token exists
    const token = sessionStorage.getItem("applicantToken")
    const storedId = sessionStorage.getItem("applicantId")

    if (!token || storedId !== applicantId) {
      router.push("/applicant-portal/login")
      return
    }

    fetchApplicant()
  }, [applicantId, router])

  // Create conversation after applicant data is loaded
  useEffect(() => {
    if (applicant && !conversationId && !creatingConversation) {
      createOrGetConversation()
    }
  }, [applicant, conversationId, creatingConversation])

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000)
  }

  const fetchApplicant = async () => {
    try {
      const token = sessionStorage.getItem("applicantToken")
      const response = await fetch(`/api/zakat-applicants/${applicantId}?token=${token}`)

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/applicant-portal/login")
        }
        throw new Error("Failed to fetch application")
      }

      const data = await response.json()
      setApplicant(data.applicant)
      setDocumentLogs(data.documentLogs || [])
    } catch (error: any) {
      console.error("Fetch error:", error)
      showToast("Failed to load application", "error")
    } finally {
      setLoading(false)
    }
  }

  const createOrGetConversation = async () => {
    try {
      setCreatingConversation(true)
      setConversationError(null)
      const token = sessionStorage.getItem("applicantToken")
      
      if (!token) {
        setConversationError("Authentication token not found. Please log in again.")
        return
      }
      
      // Create conversation using applicant-specific endpoint
      const response = await fetch("/api/applicant/messages/conversations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: `applicant-${applicantId}`,
          title: `Application Communication - Case ${applicantId}`,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const convId = data.conversationId || data.conversation?.conversationId
        if (convId) {
          setConversationId(convId)
          setConversationError(null)
        } else {
          setConversationError("Conversation created but ID not returned. Please try again.")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMsg = errorData.error || errorData.message || `Failed to create conversation (${response.status})`
        setConversationError(errorMsg)
        console.error("Failed to create conversation:", response.status, errorData)
      }
    } catch (error: any) {
      const errorMsg = error.message || "Network error. Please check your connection and try again."
      setConversationError(errorMsg)
      console.error("Error creating conversation:", error)
    } finally {
      setCreatingConversation(false)
    }
  }

  // Document upload and deletion removed - applicants can only view documents
  // To add or update documents, applicants should contact staff through messages

  const handleLogout = () => {
    sessionStorage.removeItem("applicantToken")
    sessionStorage.removeItem("applicantId")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    )
  }

  if (!applicant) {
    return (
      <div className="min-h-screen bg-linear-to-b from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your application. Please check your link.</p>
          <Link href="/" className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-50 border-yellow-200 text-yellow-800",
    Approved: "bg-green-50 border-green-200 text-green-800",
    Rejected: "bg-red-50 border-red-200 text-red-800",
  }

  const statusIcon: Record<string, React.ReactNode> = {
    Pending: <Clock className="w-5 h-5" />,
    Approved: <CheckCircle className="w-5 h-5" />,
    Rejected: <AlertCircle className="w-5 h-5" />,
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-teal-50 to-blue-50">
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />

      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo1.svg" alt="Rahmah Exchange Logo" width={170} height={170} priority />
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition"
        >
          Logout
        </button>
      </header>

      <div className="px-8 py-12 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-4">
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Application Portal</h1>
          <p className="text-gray-600">Manage your Zakat assistance application</p>
        </div>

        {/* Application Status Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-medium">Case ID:</span> {applicant.caseId}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {applicant.firstName} {applicant.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {applicant.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {applicant.mobilePhone}
                </p>
                <p>
                  <span className="font-medium">Request Type:</span> {applicant.requestType}
                </p>
                <p>
                  <span className="font-medium">Amount Requested:</span> ${applicant.amountRequested}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h2>
              <div
                className={`p-4 border rounded-lg flex items-center gap-3 ${
                  statusColors[applicant.status] || statusColors.Pending
                }`}
              >
                {statusIcon[applicant.status] || statusIcon.Pending}
                <div>
                  <p className="font-semibold">{applicant.status}</p>
                  <p className="text-sm">
                    Submitted: {new Date(applicant.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section - View Only */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Documents</h2>
            <p className="text-sm text-gray-600 mb-6">
              View your uploaded documents. To add or update documents, please contact the Rahmah team through the messages section below.
            </p>

            {applicant.documents.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Uploaded Files ({applicant.documents.length})
                </h3>
                <div className="space-y-2">
                  {applicant.documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                        <div>
                          <p className="text-gray-700 font-medium text-sm">{doc.originalname}</p>
                          <p className="text-gray-500 text-xs">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-teal-600 hover:bg-teal-50 rounded transition text-sm font-medium"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No documents uploaded yet.</p>
                <p className="text-sm mt-2">Contact the Rahmah team through messages if you need to add documents.</p>
              </div>
            )}
          </div>
        </div>

        {/* Messaging Section */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          </div>
          <p className="text-gray-600 mb-6">Communicate with the Rahmah team about your application. You can send messages and images here.</p>
          {conversationId && !creatingConversation ? (
            <ApplicantMessages caseId={applicant.caseId || applicant._id} conversationId={conversationId} maxHeight="h-[600px]" />
          ) : creatingConversation ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="ml-3 text-gray-600">Setting up messaging...</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">Unable to load messaging</p>
              {conversationError && (
                <p className="text-sm text-gray-600 mb-4">{conversationError}</p>
              )}
              <button
                onClick={createOrGetConversation}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Document Audit Log */}
        {/* {documentLogs.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Document Activity Log</h2>
            <div className="space-y-4">
              {documentLogs.map((log) => (
                <div key={log._id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.action === "uploaded"
                          ? "Document Uploaded"
                          : log.action === "updated"
                            ? "Document Updated"
                            : "Document Deleted"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {log.originalFilename} ({(log.fileSize / 1024 / 1024).toFixed(2)} MB)
                      </p>
                      {log.notes && <p className="text-sm text-gray-500 mt-2">Note: {log.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{log.uploadedBy}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}
