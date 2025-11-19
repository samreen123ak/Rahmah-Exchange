"use client"

import { useEffect, useState, useRef } from "react"
import { Send, Paperclip, AlertCircle, CheckCircle2, Image as ImageIcon, X, Download } from "lucide-react"

interface Message {
  _id: string
  body: string
  senderName: string
  senderEmail: string
  senderRole: string
  createdAt: string
  attachments: any[]
}

interface ApplicantMessagesProps {
  caseId: string
  conversationId: string
  className?: string
  maxHeight?: string
}

function Toast({ message, type, isVisible }: { message: string; type: "success" | "error"; isVisible: boolean }) {
  if (!isVisible) return null
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg flex items-center gap-2 text-white font-semibold z-50 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      {message}
    </div>
  )
}

export default function ApplicantMessages({
  caseId,
  conversationId,
  className = "",
  maxHeight = "h-[500px]",
}: ApplicantMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [participants, setParticipants] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const msgEndRef = useRef<HTMLDivElement | null>(null)

  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000)
  }

  // Auto-scroll to last message
  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    fetchConversationDetails()
    fetchMessages()
  }, [conversationId])

  const fetchConversationDetails = async () => {
    try {
      const token = sessionStorage.getItem("applicantToken")
      const applicantId = sessionStorage.getItem("applicantId")

      if (!applicantId) return

      setCurrentUserId(applicantId)

      const response = await fetch(
        `/api/applicant/messages/conversations/${conversationId}?details=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!response.ok) return

      const data = await response.json()
      if (data.conversation?.participants) {
        setParticipants(data.conversation.participants)
      }
    } catch (error) {
      console.error("Error fetching details", error)
    }
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem("applicantToken")

      const response = await fetch(
        `/api/applicant/messages/conversations/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!response.ok) throw new Error("Failed to load messages")

      const data = await response.json()
      setMessages(data.messages)
    } catch (error) {
      showToast("Failed to load messages", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))
    
    if (imageFiles.length > 0) {
      setSelectedImages((prev) => [...prev, ...imageFiles])
      imageFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedImages.length === 0) return

    setSending(true)

    try {
      const token = sessionStorage.getItem("applicantToken")
      const formData = new FormData()

      formData.append("conversationId", conversationId)
      formData.append("body", newMessage || "")
      formData.append("messageType", "text")

      // Add images
      selectedImages.forEach((image) => {
        formData.append("attachments", image)
      })

      // send only to staff - if no participants loaded, API will handle finding staff
      if (participants.length > 0) {
        participants.forEach((p) => {
          if (p.role !== "applicant" && p.userId) {
            formData.append("recipientIds", p.userId)
          }
        })
      }
      // If no participants, the API will automatically send to all staff in the conversation

      const response = await fetch("/api/applicant/messages/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to send message")

      showToast("Message sent", "success")
      setNewMessage("")
      setSelectedImages([])
      setImagePreviews([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      fetchMessages()
    } catch (error: any) {
      showToast(error.message || "Error sending message", "error")
    } finally {
      setSending(false)
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col ${maxHeight} ${className}`}>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Communication Thread</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#e5ddd5]">
        {loading ? (
          <div className="flex justify-center pt-10">
            <div className="animate-spin h-8 w-8 border-b-2 border-teal-600 rounded-full"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-gray-500 text-center pt-10">No messages yet.</div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderRole === "applicant"

            return (
              <div key={msg._id} className={`w-full flex mb-3 ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end gap-2 max-w-[75%]`}>
                  
                  {/* Avatar for team messages */}
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full bg-gray-400 text-white text-xs font-bold flex items-center justify-center">
                      {getInitials(msg.senderName)}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl shadow text-sm whitespace-pre-wrap break-words ${
                      isMine
                        ? "bg-teal-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.body}

                    {/* Attachments - Images and Files */}
                    {msg.attachments?.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((att: any, i: number) => {
                          const isImage = att.mimeType?.startsWith("image/")
                          return (
                            <div key={i} className="relative">
                              {isImage ? (
                                <div className="relative group">
                                  <img
                                    src={att.url}
                                    alt={att.originalname}
                                    className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90"
                                    onClick={() => window.open(att.url, "_blank")}
                                  />
                                  <a
                                    href={att.url}
                                    download={att.originalname}
                                    className="absolute bottom-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                              ) : (
                                <a
                                  href={att.url}
                                  target="_blank"
                                  download={att.originalname}
                                  className="flex items-center gap-1 text-xs underline hover:text-teal-600"
                                >
                                  <Paperclip className="w-3 h-3" /> {att.originalname}
                                </a>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Time */}
                    <p className={`text-[10px] mt-1 ${isMine ? "text-teal-100" : "text-gray-500"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}

        <div ref={msgEndRef}></div>
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="px-3 pt-3 border-t border-gray-300 bg-white">
          <div className="flex gap-2 flex-wrap">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input - Always visible */}
      <div className="border-t border-gray-300 bg-white">
        <form onSubmit={handleSendMessage} className="p-4 flex gap-2 items-end">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center transition"
            title="Upload images"
          >
            <ImageIcon className="w-5 h-5" />
          </label>
          <div className="flex-1 flex flex-col gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to staff here..."
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
            {participants.length === 0 && (
              <p className="text-xs text-gray-500">Loading staff members...</p>
            )}
          </div>

          <button
            type="submit"
            disabled={sending || (!newMessage.trim() && selectedImages.length === 0)}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 transition"
            title="Send message to staff"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
