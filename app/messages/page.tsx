"use client"

import { useEffect, useState, useRef } from "react"
import { Mail, Send, Paperclip, AlertCircle, CheckCircle2, Archive, Check, CheckCheck } from 'lucide-react'
import Link from "next/link"
import { authenticatedFetch, getAuthToken } from "@/lib/auth-utils"
import Image from "next/image"

interface Conversation {
  _id: string
  conversationId: string
  title: string
  lastMessage: string
  lastMessageAt: string
  messageCount: number
  unreadCount: number
  caseId: {
    caseId: string
    firstName: string
    lastName: string
  }
}

interface Message {
  _id: string
  body: string
  subject?: string
  senderName: string
  senderEmail: string
  senderRole: string
  createdAt: string
  attachments: any[]
  readBy: any[]
  senderId?: string
}

function Toast({ message, type, isVisible }: { message: string; type: "success" | "error"; isVisible: boolean }) {
  if (!isVisible) return null
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg flex items-center gap-2 text-white font-semibold z-50 animate-in fade-in slide-in-from-top-5 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      {message}
    </div>
  )
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const ADMIN_EMAIL = "staff@gmail.com"
  const currentUserEmail = ADMIN_EMAIL

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch conversations
  useEffect(() => {
    fetchConversations()
  }, [showArchived])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await authenticatedFetch(`/api/messages/conversations?archived=${showArchived}`)
      if (!response.ok) throw new Error("Failed to load conversations")
      const data = await response.json()
      setConversations(data.conversations)
    } catch (error: any) {
      console.error("Error fetching conversations:", error)
      showToast("Failed to load conversations", "error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true)
      const response = await authenticatedFetch(`/api/messages/conversations/${conversationId}`)
      if (!response.ok) throw new Error("Failed to load messages")
      const data = await response.json()
      setMessages(data.messages)
    } catch (error: any) {
      console.error("Error fetching messages:", error)
      showToast("Failed to load messages", "error")
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation.conversationId)
    
    markConversationAsRead(conversation.conversationId)
  }

  const markConversationAsRead = async (conversationId: string) => {
    try {
      const token = getAuthToken()
      const headers = new Headers()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("x-admin-email", ADMIN_EMAIL)

      await fetch(`/api/messages/conversations/${conversationId}/mark-read`, {
        method: "POST",
        headers,
      })
    } catch (error) {
      console.error("Error marking conversation as read:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    const messageText = newMessage
    setNewMessage("")

    try {
      const formData = new FormData()
      formData.append("conversationId", selectedConversation.conversationId)
      formData.append("body", messageText)
      formData.append("messageType", "text")

      const token = getAuthToken()
      const headers = new Headers()
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      headers.set("x-admin-email", ADMIN_EMAIL)

      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData?.message || "Failed to send message")
      }

      const result = await response.json()
      
      const newMsg: Message = {
        _id: result._id || Date.now().toString(),
        body: messageText,
        senderName: "You",
        senderEmail: ADMIN_EMAIL,
        senderRole: "caseworker",
        createdAt: new Date().toISOString(),
        attachments: [],
        readBy: [],
        senderId: undefined
 // Assuming senderId is not provided by the API response
      }
      
      setMessages(prev => [...prev, newMsg])
      
      // Update conversation list with new last message
      setConversations(prev =>
        prev.map(conv =>
          conv._id === selectedConversation._id
            ? {
                ...conv,
                lastMessage: messageText,
                lastMessageAt: new Date().toISOString(),
                messageCount: conv.messageCount + 1,
                unreadCount: 0
              }
            : conv
        )
      )

      showToast("Message sent successfully", "success")
    } catch (error: any) {
      console.error("Error sending message:", error)
      // Restore message on error
      setNewMessage(messageText)
      showToast(error.message || "Failed to send message", "error")
    } finally {
      setSending(false)
    }
  }

  const isMessageRead = (msg: Message) => {
    return msg.readBy && msg.readBy.some(r => r.userId !== null)
  }

  const isOwnMessage = (msg: Message) => {
    return msg.senderEmail === currentUserEmail
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />

      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/logo1.svg" alt="Rahmah Exchange Logo" width={170} height={170} priority />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
          >
            <Archive className="w-5 h-5" />
            {showArchived ? "Active" : "Archived"}
          </button>
          <Link href="/staff/dashboard" className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Back to Home
          </Link>
        </div>
      </header>

      <div className="px-8 py-8 max-w-6xl mx-auto h-[calc(100vh-140px)]">
        <div className="flex gap-4 h-full">
          {/* Conversation List */}
          <div className="w-80 bg-white rounded-2xl shadow-sm flex flex-col border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-600" />
                Messages
              </h2>
              <p className="text-xs text-gray-500 mt-1">{conversations.length} conversation(s)</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-sm">No {showArchived ? "archived" : "active"} conversations</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedConversation?._id === conv._id ? "bg-teal-50 border-l-4 border-l-teal-600" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {conv.caseId?.firstName || "Unknown"} {conv.caseId?.lastName || ""}
                        </h3>
                        <p className="text-xs text-gray-500">{conv.caseId?.caseId || "N/A"}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-teal-600 rounded-full shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col border border-gray-200 overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedConversation.caseId?.firstName || "Unknown"} {selectedConversation.caseId?.lastName || ""}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.caseId?.caseId || "N/A"} • {selectedConversation.messageCount} messages
                  </p>
                </div>

                {/* Messages Container */}
                {loadingMessages ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = isOwnMessage(msg)
                        const isRead = isMessageRead(msg)
                        
                        return (
                          <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} gap-2`}>
                            <div className={`flex flex-col max-w-xs ${isOwn ? 'items-end' : 'items-start'}`}>
                              {/* Message Bubble */}
                              <div
                                className={`rounded-2xl px-4 py-2 relative ${
                                  isOwn
                                    ? 'bg-teal-600 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                }`}
                              >
                                {!isOwn && !isRead && (
                                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                                    unread
                                  </span>
                                )}
                                
                                {!isOwn && (
                                  <p className="text-xs font-semibold mb-1 opacity-70">
                                    {msg.senderName}
                                  </p>
                                )}
                                <p className="text-sm break-words">{msg.body}</p>
                                
                                {msg.attachments && msg.attachments.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {msg.attachments.map((att, idx) => (
                                      <a
                                        key={idx}
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-xs underline flex items-center gap-1 ${
                                          isOwn ? 'text-teal-100' : 'text-teal-600'
                                        }`}
                                      >
                                        <Paperclip className="w-3 h-3" />
                                        {att.originalname}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Timestamp and Read Status */}
                              <div className="flex items-center gap-1 mt-1 px-2">
                                <p className="text-xs text-gray-500">
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {isOwn && (
                                  isRead ? (
                                    <CheckCheck className="w-4 h-4 text-teal-600" />
                                  ) : (
                                    <Check className="w-4 h-4 text-gray-400" />
                                  )
                                )}
                                {!isOwn && isRead && (
                                  <span className="text-xs text-teal-600 font-semibold">read</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e as any)
                        }
                      }}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      rows={1}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center h-11 w-11"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-gray-500">
                <div>
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
