import mongoose from "mongoose"

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // Mosque name
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      // URL-friendly identifier (e.g., "masjid-al-noor")
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Subscription settings (future-ready)
    subscriptionStatus: {
      type: String,
      enum: ["active", "trial", "expired", "cancelled"],
      default: "active",
    },
    subscriptionExpiresAt: Date,
    // Settings
    settings: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Branding (per-tenant / per-masjid)
    // logoUrl can be a hosted URL or a data URL (PNG only enforced at API layer)
    logoUrl: {
      type: String,
      required: false,
      default: null,
    },
    // Hex color (e.g. #0d9488)
    brandColor: {
      type: String,
      required: false,
      default: "#0d9488",
    },
  },
  { timestamps: true },
)

tenantSchema.index({ isActive: 1 })

export default mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema)
