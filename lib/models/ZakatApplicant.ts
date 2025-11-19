import mongoose from "mongoose"

const zakatApplicantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    gender: String,
    dateOfBirth: Date,
    mobilePhone: { type: String, required: true },
    homePhone: String,
    email: { type: String, unique: true, sparse: true },
    legalStatus: String,
    referredBy: String,
    referrerPhone: String,
    employmentStatus: String,
    dependentsInfo: String,
    totalMonthlyIncome: Number,
    incomeSources: String,
    rentMortgage: Number,
    utilities: Number,
    food: Number,
    otherExpenses: String,
    totalDebts: Number,
    requestType: { type: String, default: "Zakat" },
    amountRequested: Number,
    whyApplying: String,
    circumstances: String,
    previousZakat: String,
    zakatResourceSource: String,
    reference1: {
      fullName: String,
      phoneNumber: String,
      email: String,
      relationship: String,
    },
    reference2: {
      fullName: String,
      phoneNumber: String,
      email: String,
      relationship: String,
    },
    documents: [
      {
        filename: String,
        originalname: String,
        mimeType: String,
        size: Number,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, default: "Pending", enum: ["Pending", "Approved", "Rejected","Ready for Approval","Need Info","In Review"] },
    caseId: { type: String, unique: true, index: true },
  },
  { timestamps: true }
)

export default mongoose.models.ZakatApplicant || mongoose.model("ZakatApplicant", zakatApplicantSchema)
