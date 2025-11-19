import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    // Conversation context
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ZakatApplicant",
      required: true,
      index: true,
    },
    conversationId: {
      type: String,
      required: true,
      index: true,
      // Format: "case_[caseObjectId]"
    },

    // Sender and recipients
   senderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
    required: false, // <-- change this
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ZakatApplicant",
    },
    senderEmail: {
      type: String,
      required: true,
      // Internal email like: john.doe@rahmah.internal
    },
    senderRole: {
      type: String,
      enum: ["applicant", "caseworker", "approver", "treasurer", "admin"],
      required: true,
    },
    senderName: String,

    recipientIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    recipientEmails: [String], // All recipients' internal emails

    // Message content
    subject: String,
    body: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "note", "status_update"],
      default: "text",
    },

    // Attachments
    attachments: [
      {
        filename: String,
        originalname: String,
        mimeType: String,
        size: Number,
        url: String, // Vercel Blob URL
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Message status
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        readAt: Date,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    deletedBy: mongoose.Schema.Types.ObjectId,

    // Metadata
    threadId: mongoose.Schema.Types.ObjectId, // For message replies
    parentMessageId: mongoose.Schema.Types.ObjectId, // For replies
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Indexes for quick queries
messageSchema.index({ caseId: 1, createdAt: -1 })
messageSchema.index({ conversationId: 1, createdAt: -1 })
messageSchema.index({ senderId: 1, createdAt: -1 })
messageSchema.index({ applicantId: 1, createdAt: -1 })
messageSchema.index({ recipientIds: 1, readBy: 1 })
messageSchema.index({ isDeleted: 1 })

export default mongoose.models.Message || mongoose.model("Message", messageSchema)
