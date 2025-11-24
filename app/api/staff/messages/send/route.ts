import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import { authenticateRequest } from "@/lib/auth-middleware"
import Message from "@/lib/models/Message"
import Conversation from "@/lib/models/Conversation"
import User from "@/lib/models/User"
import { sendEmail } from "@/lib/email"

/**
 * POST /api/staff/messages/send - Send a message in a staff conversation
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status: 401 })
    }

    // Only staff can send messages
    const allowedRoles = ["admin", "caseworker", "approver", "treasurer"]
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ message: "Only staff can send messages" }, { status: 403 })
    }

    const formData = await request.formData()
    const conversationId = formData.get("conversationId")?.toString()
    const body = formData.get("body")?.toString()

    if (!conversationId || !body) {
      return NextResponse.json({ message: "conversationId and body are required" }, { status: 400 })
    }

    await dbConnect()

    // Verify conversation exists and user is a participant
    const conversation = await Conversation.findOne({
      conversationId,
      "participants.userId": user._id,
    })

    if (!conversation) {
      return NextResponse.json({ message: "Conversation not found or access denied" }, { status: 404 })
    }

    // Get all participants except sender
    const recipients = conversation.participants.filter(
      (p: any) => p.userId.toString() !== user._id.toString()
    )

    // Create message (caseId is optional for staff conversations)
    const message = await Message.create({
      conversationId,
      caseId: conversation.caseId || undefined, // Optional for staff conversations
      senderId: user._id,
      senderEmail: user.internalEmail || user.email,
      senderRole: user.role,
      senderName: user.name,
      body,
      messageType: "text",
      recipientIds: recipients.map((p: any) => p.userId),
      recipientEmails: recipients.map((p: any) => p.email || p.internalEmail),
      readBy: [
        {
          userId: user._id,
          readAt: new Date(),
        },
      ],
    })

    // Update conversation
    await Conversation.updateOne(
      { _id: conversation._id },
      {
        $set: {
          lastMessage: body,
          lastMessageAt: new Date(),
        },
        $inc: {
          messageCount: 1,
        },
      }
    )

    // Send email notifications to recipients
    for (const recipient of recipients) {
      try {
        const recipientUser = await User.findById(recipient.userId).lean()
        if (recipientUser && recipientUser.emailOnNewMessage) {
          await sendEmail({
            to: recipientUser.email,
            subject: `New message from ${user.name} - Staff Chat`,
            html: `
              <p>You have a new message from <strong>${user.name}</strong>:</p>
              <p>${body}</p>
              <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/staff/messages">View Message</a></p>
            `,
          })
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
      }
    }

    const formattedMessage = {
      _id: message._id.toString(),
      body: message.body,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      senderRole: message.senderRole,
      senderId: message.senderId.toString(),
      createdAt: message.createdAt,
      readBy: message.readBy || [],
    }

    return NextResponse.json({ message: formattedMessage }, { status: 201 })
  } catch (error: any) {
    console.error("Error sending staff message:", error)
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 })
  }
}

