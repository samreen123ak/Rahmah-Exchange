// "use client"
// import axios from "axios"
// import type React from "react"

// import { useState } from "react"
// import { ChevronLeft, Upload, CheckCircle2, AlertCircle, CheckCircle } from "lucide-react"
// import Link from "next/link"

// function Toast({ message, type, isVisible }: { message: string; type: "success" | "error"; isVisible: boolean }) {
//   if (!isVisible) return null
//   return (
//     <div
//       className={`fixed top-4 right-4 p-4 rounded-lg flex items-center gap-2 text-white font-semibold z-50 animate-in fade-in slide-in-from-top-5 ${
//         type === "success" ? "bg-green-500" : "bg-red-500"
//       }`}
//     >
//       {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//       {message}
//     </div>
//   )
// }

// const STEPS = [
//   { number: 1, label: "Personal" },
//   { number: 2, label: "Employment" },
//   { number: 3, label: "Family" },
//   { number: 4, label: "Financial" },
//   { number: 5, label: "Request" },
//   { number: 6, label: "References" },
//   { number: 7, label: "Documents" },
//   { number: 8, label: "Review" },
// ]

// export default function ApplyPage() {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [isSubmitted, setIsSubmitted] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
//     message: "",
//     type: "success",
//     isVisible: false,
//   })

//   const [formData, setFormData] = useState({
//     // Step 1: Personal
//     firstName: "",
//     lastName: "",
//     streetAddress: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     gender: "",
//     dateOfBirth: "",
//     mobilePhone: "",
//     homePhone: "",
//     email: "",
//     legalStatus: "",
//     referredBy: "",
//     referrerPhone: "",
//     // Step 2: Employment
//     employmentStatus: "",
//     // Step 3: Family
//     dependentsInfo: "",
//     // Step 4: Financial
//     totalMonthlyIncome: "",
//     incomeSources: "",
//     rentMortgage: "",
//     utilities: "",
//     food: "",
//     otherExpenses: "",
//     totalDebts: "",
//     // Step 5: Request
//     requestType: "Zakat",
//     amountRequested: "",
//     whyApplying: "",
//     circumstances: "",
//     previousZakat: "",
//     // Step 6: References
//     reference1: { fullName: "", phoneNumber: "", email: "", relationship: "" },
//     reference2: { fullName: "", phoneNumber: "", email: "", relationship: "" },
//     // Step 7: Documents
//     documents: [] as File[],
//   })

//   const showToast = (message: string, type: "success" | "error") => {
//     setToast({ message, type, isVisible: true })
//     setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000)
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleReferenceChange = (refNumber: 1 | 2, field: string, value: string) => {
//     const refKey = refNumber === 1 ? "reference1" : "reference2"
//     setFormData((prev) => ({
//       ...prev,
//       [refKey]: { ...prev[refKey], [field]: value },
//     }))
//   }

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files
//     if (!files) return

//     const uploadedFiles = Array.from(files)
//     const maxSize = 10 * 1024 * 1024 // 10MB

//     for (const file of uploadedFiles) {
//       if (file.size > maxSize) {
//         showToast(`File ${file.name} exceeds 10MB limit`, "error")
//         return
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       documents: [...prev.documents, ...uploadedFiles],
//     }))
//     showToast(`${uploadedFiles.length} file(s) uploaded successfully`, "success")
//   }

//   const removeDocument = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       documents: prev.documents.filter((_, i) => i !== index),
//     }))
//   }

//   const handleNext = () => {
//     if (currentStep < STEPS.length) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const handleSubmit = async () => {
//     setIsSubmitting(true)
//     try {
//       const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

//       // Create FormData to handle file uploads
//       const submitData = new FormData()

      
//       // Add all form data
//       submitData.append("firstName", formData.firstName)
//       submitData.append("lastName", formData.lastName)
//       submitData.append("streetAddress", formData.streetAddress)
//       submitData.append("city", formData.city)
//       submitData.append("state", formData.state)
//       submitData.append("zipCode", formData.zipCode)
//       submitData.append("gender", formData.gender)
//       submitData.append("dateOfBirth", formData.dateOfBirth)
//       submitData.append("mobilePhone", formData.mobilePhone)
//       submitData.append("homePhone", formData.homePhone)
//       submitData.append("email", formData.email)
//       submitData.append("legalStatus", formData.legalStatus)
//       submitData.append("referredBy", formData.referredBy)
//       submitData.append("referrerPhone", formData.referrerPhone)
//       submitData.append("employmentStatus", formData.employmentStatus)
//       submitData.append("dependentsInfo", formData.dependentsInfo)
//       submitData.append("totalMonthlyIncome", formData.totalMonthlyIncome)
//       submitData.append("incomeSources", formData.incomeSources)
//       submitData.append("rentMortgage", formData.rentMortgage)
//       submitData.append("utilities", formData.utilities)
//       submitData.append("food", formData.food)
//       submitData.append("otherExpenses", formData.otherExpenses)
//       submitData.append("totalDebts", formData.totalDebts)
//       submitData.append("requestType", formData.requestType)
//       submitData.append("amountRequested", formData.amountRequested)
//       submitData.append("whyApplying", formData.whyApplying)
//       submitData.append("circumstances", formData.circumstances)
//       submitData.append("previousZakat", formData.previousZakat)
//       submitData.append("reference1", JSON.stringify(formData.reference1))
//       submitData.append("reference2", JSON.stringify(formData.reference2))

//       // Add documents
//       formData.documents.forEach((file, index) => {
//         submitData.append(`documents`, file)
//       })

//      const response = await axios.post("http://localhost:5000/api/zakatApplicants", formData, {
//   headers: { "Content-Type": "multipart/form-data" },
// });

//       console.log("✅ Application submitted:", response.data)
//       showToast("Application submitted successfully!", "success")
//       setIsSubmitted(true)
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.message || "Something went wrong submitting your application. Please try again."
//       console.error("❌ Error submitting application:", error)
//       showToast(errorMessage, "error")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const isStepCompleted = (step: number) => step < currentStep

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
//         <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
//           <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-teal-600 transition font-medium">
//             <ChevronLeft className="w-5 h-5" />
//             Back to Home
//           </Link>
//         </header>

//         <div className="px-8 py-12 max-w-2xl mx-auto">
//           {/* Success Banner */}
//           <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
//             <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
//             <p className="text-green-800 font-semibold">Application submitted successfully!</p>
//           </div>

//           {/* Status Card */}
//           <div className="bg-white rounded-2xl p-8 shadow-sm">
//             <h1 className="text-3xl font-bold text-gray-900 mb-8">Application Status</h1>

//             {/* Current Status */}
//             <div className="mb-8 pb-8 border-b border-gray-200">
//               <p className="text-gray-600 text-sm font-medium mb-2">Current Status</p>
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
//                 <div className="w-2 h-2 bg-blue-600 rounded-full" />
//                 <span className="text-blue-700 font-semibold text-sm">Submitted</span>
//               </div>
//             </div>

//             {/* Application Details */}
//             <div className="mb-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Details</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-gray-600 text-sm mb-1">Application ID</p>
//                   <p className="text-gray-900 font-semibold">b6b368b5</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm mb-1">Submitted Date</p>
//                   <p className="text-gray-900 font-semibold">03/11/2025</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm mb-1">Applicant Name</p>
//                   <p className="text-gray-900 font-semibold">
//                     {formData.firstName} {formData.lastName}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm mb-1">Request Type</p>
//                   <p className="text-gray-900 font-semibold">{formData.requestType}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Info Box */}
//             <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-blue-900 text-sm">Your application has been received and is pending review.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
//       <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />

//       {/* Header */}
//       <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
//         <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-teal-600 transition font-medium">
//           <ChevronLeft className="w-5 h-5" />
//           Back to Home
//         </Link>
//         <button className="px-6 py-2 text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition">
//           Save Progress
//         </button>
//       </header>

//       {/* Main Content */}
//       <div className="px-8 py-12 max-w-4xl mx-auto">
//         {/* Page Title */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-3">Assistance Application</h1>
//           <p className="text-gray-600">Complete all steps to submit your application for verified support</p>
//         </div>

//         {/* Step Indicator */}
//         <div className="mb-12">
//           <div className="flex justify-between items-start mb-4">
//             {STEPS.map((step) => (
//               <div key={step.number} className="flex flex-col items-center flex-1">
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${
//                     step.number === currentStep
//                       ? "bg-teal-600 text-white"
//                       : isStepCompleted(step.number)
//                         ? "bg-teal-600 text-white"
//                         : "bg-gray-200 text-gray-500"
//                   }`}
//                 >
//                   {isStepCompleted(step.number) ? "✓" : step.number}
//                 </div>
//                 <p className="text-sm text-gray-600 text-center text-balance font-medium">{step.label}</p>
//               </div>
//             ))}
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full bg-gray-300 rounded-full h-1">
//             <div
//               className="bg-gray-900 h-1 rounded-full transition-all duration-300"
//               style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
//             />
//           </div>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl p-8 shadow-sm">
//           {currentStep === 1 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* First Name */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     First Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Last Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>
//               </div>

//               {/* Street Address */}
//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">Street Address</label>
//                 <input
//                   type="text"
//                   name="streetAddress"
//                   value={formData.streetAddress}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                   placeholder=""
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* City */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>

//                 {/* State */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* ZIP Code */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">ZIP Code</label>
//                   <input
//                     type="text"
//                     name="zipCode"
//                     value={formData.zipCode}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Gender</label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-600"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                     <option value="prefer-not">Prefer not to say</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth</label>
//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={formData.dateOfBirth}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                   />
//                 </div>

//                 {/* Mobile Phone */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Mobile Phone <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     name="mobilePhone"
//                     value={formData.mobilePhone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* Home Phone */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Home Phone</label>
//                   <input
//                     type="tel"
//                     name="homePhone"
//                     value={formData.homePhone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                 {/* Legal Status */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Legal Status</label>
//                   <select
//                     name="legalStatus"
//                     value={formData.legalStatus}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-600"
//                   >
//                     <option value="">Select status</option>
//                     <option value="citizen">Citizen</option>
//                     <option value="resident">Resident</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>

//                 {/* Referred By */}
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Referred By</label>
//                   <input
//                     type="text"
//                     name="referredBy"
//                     value={formData.referredBy}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     placeholder=""
//                   />
//                 </div>
//               </div>

//               <div className="mb-8">
//                 {/* Referrer Phone */}
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">Referrer Phone</label>
//                 <input
//                   type="tel"
//                   name="referrerPhone"
//                   value={formData.referrerPhone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                   placeholder=""
//                 />
//               </div>
//             </div>
//           )}

//           {currentStep === 2 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Employment Information</h2>
//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">Employment Status</label>
//                 <select
//                   name="employmentStatus"
//                   value={formData.employmentStatus}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                 >
//                   <option value="">Select status</option>
//                   <option value="employed">Employed</option>
//                   <option value="self-employed">Self-Employed</option>
//                   <option value="unemployed">Unemployed</option>
//                   <option value="retired">Retired</option>
//                   <option value="student">Student</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {currentStep === 3 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Family Information</h2>
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependents Information</h3>
//                 <textarea
//                   name="dependentsInfo"
//                   value={formData.dependentsInfo}
//                   onChange={handleChange}
//                   placeholder="List your dependents with their names, ages, and relationship. Example:&#10;- John Smith, 8 years old, Son&#10;- Mary Smith, 5 years old, Daughter&#10;- Mother-in-law, 65 years old, lives with us"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-48"
//                 />
//                 <p className="text-sm text-gray-500 mt-2">Please list all people who depend on you financially</p>
//               </div>
//             </div>
//           )}

//           {currentStep === 4 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Financial Information</h2>

//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income</h3>
//                 <div className="mb-6">
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Total Monthly Income</label>
//                   <input
//                     type="number"
//                     name="totalMonthlyIncome"
//                     value={formData.totalMonthlyIncome}
//                     onChange={handleChange}
//                     placeholder="0.00"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Income Sources</label>
//                   <textarea
//                     name="incomeSources"
//                     value={formData.incomeSources}
//                     onChange={handleChange}
//                     placeholder="List all income sources: salary, spouse salary, social security, unemployment, child support, etc."
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-32"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Rent/Mortgage</label>
//                     <input
//                       type="number"
//                       name="rentMortgage"
//                       value={formData.rentMortgage}
//                       onChange={handleChange}
//                       placeholder="0.00"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Utilities (Electric, Gas, Water)
//                     </label>
//                     <input
//                       type="number"
//                       name="utilities"
//                       value={formData.utilities}
//                       onChange={handleChange}
//                       placeholder="0.00"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Food</label>
//                     <input
//                       type="number"
//                       name="food"
//                       value={formData.food}
//                       onChange={handleChange}
//                       placeholder="0.00"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Other Expenses</label>
//                     <input
//                       type="text"
//                       name="otherExpenses"
//                       value={formData.otherExpenses}
//                       onChange={handleChange}
//                       placeholder="Transportation, medical, school, etc."
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Total Debts</label>
//                   <input
//                     type="number"
//                     name="totalDebts"
//                     value={formData.totalDebts}
//                     onChange={handleChange}
//                     placeholder="0.00"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {currentStep === 5 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Application Request</h2>

//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">Request Type</label>
//                 <select
//                   name="requestType"
//                   value={formData.requestType}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                 >
//                   <option value="Zakat">Zakat</option>
//                   <option value="Sadaqah">Sadaqah</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">Amount Requested</label>
//                 <input
//                   type="number"
//                   name="amountRequested"
//                   value={formData.amountRequested}
//                   onChange={handleChange}
//                   placeholder="0.00"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                 />
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">
//                   Why Are You Applying for {formData.requestType}?
//                 </label>
//                 <textarea
//                   name="whyApplying"
//                   value={formData.whyApplying}
//                   onChange={handleChange}
//                   placeholder="Please provide detailed information about your situation and why you need assistance..."
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-32"
//                 />
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">Explain Your Circumstances</label>
//                 <textarea
//                   name="circumstances"
//                   value={formData.circumstances}
//                   onChange={handleChange}
//                   placeholder="Explain your circumstances and how the assistance will help"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-32"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-900 mb-2">
//                   Have you received {formData.requestType}/Sadaqa in the past 12 months?
//                 </label>
//                 <select
//                   name="previousZakat"
//                   value={formData.previousZakat}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                 >
//                   <option value="">Select</option>
//                   <option value="yes">Yes</option>
//                   <option value="no">No</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {currentStep === 6 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-3">References (2 Required)</h2>
//               <p className="text-gray-600 mb-8">Please provide two references who can vouch for you</p>

//               {/* Reference 1 */}
//               <div className="mb-8 pb-8 border-b border-gray-200">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-1 h-8 bg-teal-600 rounded" />
//                   <h3 className="text-lg font-bold text-gray-900">Reference 1</h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Full Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.reference1.fullName}
//                       onChange={(e) => handleReferenceChange(1, "fullName", e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Phone Number <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       value={formData.reference1.phoneNumber}
//                       onChange={(e) => handleReferenceChange(1, "phoneNumber", e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
//                     <input
//                       type="email"
//                       value={formData.reference1.email}
//                       onChange={(e) => handleReferenceChange(1, "email", e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       How do you know this person?
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.reference1.relationship}
//                       onChange={(e) => handleReferenceChange(1, "relationship", e.target.value)}
//                       placeholder="e.g., Friend from Masjid, Neighbor"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Reference 2 */}
//               <div>
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-1 h-8 bg-blue-500 rounded" />
//                   <h3 className="text-lg font-bold text-gray-900">Reference 2</h3>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Full Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.reference2.fullName}
//                       onChange={(e) => handleReferenceChange(2, "fullName", e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       Phone Number <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       value={formData.reference2.phoneNumber}
//                       onChange={(e) => handleReferenceChange(2, "phoneNumber", e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
//                     <input
//                       type="email"
//                       value={formData.reference2.email}
//                       onChange={(e) => handleReferenceChange(2, "email", e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">
//                       How do you know this person?
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.reference2.relationship}
//                       onChange={(e) => handleReferenceChange(2, "relationship", e.target.value)}
//                       placeholder="e.g., Family friend, Colleague"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {currentStep === 7 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Supporting Documents</h2>
//               <p className="text-gray-600 mb-6">
//                 Please upload supporting documents such as: ID, bills, pay stubs, bank statements, etc.
//               </p>

//               <div className="mb-6">
//                 <input
//                   type="file"
//                   id="file-upload"
//                   multiple
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   onChange={handleFileUpload}
//                   className="hidden"
//                 />
//                 <label
//                   htmlFor="file-upload"
//                   className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer block"
//                 >
//                   <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                   <p className="text-teal-600 font-semibold text-lg mb-2">Click to upload documents</p>
//                   <p className="text-gray-500">PDF, JPG, PNG up to 10MB</p>
//                 </label>
//               </div>

//               {formData.documents.length > 0 && (
//                 <div className="mt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                     Uploaded Files ({formData.documents.length})
//                   </h3>
//                   <div className="space-y-2">
//                     {formData.documents.map((doc, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
//                       >
//                         <div className="flex items-center gap-2">
//                           <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//                           <span className="text-gray-700 font-medium text-sm">{doc.name}</span>
//                           <span className="text-gray-500 text-xs">({(doc.size / 1024 / 1024).toFixed(2)} MB)</span>
//                         </div>
//                         <button
//                           onClick={() => removeDocument(index)}
//                           className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {currentStep === 8 && (
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-8">Review Your Application</h2>

//               <div className="space-y-8">
//                 {/* Personal Information Section */}
//                 <div className="pb-6 border-b border-gray-200">
//                   <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>
//                       {formData.firstName} {formData.lastName}
//                     </p>
//                     <p>{formData.email}</p>
//                     <p>{formData.mobilePhone}</p>
//                   </div>
//                 </div>

//                 {/* Employment Section */}
//                 <div className="pb-6 border-b border-gray-200">
//                   <h3 className="font-semibold text-gray-900 mb-3">Employment</h3>
//                   <div className="text-sm text-gray-600">
//                     <p>Status: {formData.employmentStatus || "Not provided"}</p>
//                   </div>
//                 </div>

//                 {/* Financial Summary Section */}
//                 <div className="pb-6 border-b border-gray-200">
//                   <h3 className="font-semibold text-gray-900 mb-3">Financial Summary</h3>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>Monthly Income: ${formData.totalMonthlyIncome || "0"}</p>
//                     <p>Monthly Rent: ${formData.rentMortgage || "0"}</p>
//                     <p>Total Debts: ${formData.totalDebts || "0"}</p>
//                   </div>
//                 </div>

//                 {/* Request Details Section */}
//                 <div className="pb-6 border-b border-gray-200">
//                   <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>Type: {formData.requestType}</p>
//                     <p>Amount Requested: ${formData.amountRequested || "0"}</p>
//                     <p>Reason: {formData.whyApplying.substring(0, 100) || "..."}</p>
//                   </div>
//                 </div>

//                 {/* References Section */}
//                 <div className="pb-6 border-b border-gray-200">
//                   <h3 className="font-semibold text-gray-900 mb-3">References</h3>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>1. {formData.reference1.fullName || "-"}</p>
//                     <p>2. {formData.reference2.fullName || "-"}</p>
//                   </div>
//                 </div>

//                 {formData.documents.length > 0 && (
//                   <div className="pb-6 border-b border-gray-200">
//                     <h3 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h3>
//                     <div className="text-sm text-gray-600 space-y-1">
//                       {formData.documents.map((doc, index) => (
//                         <p key={index}>
//                           {index + 1}. {doc.name}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Declaration Section */}
//                 <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                   <p className="text-sm text-blue-900">
//                     <span className="font-semibold">Declaration:</span> I testify that the information provided in this
//                     application is true and accurate to the best of my knowledge. I authorize the verification of this
//                     information to determine my eligibility for {formData.requestType}.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Buttons */}
//           <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
//             <button
//               onClick={handleBack}
//               className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition font-medium disabled:opacity-50"
//               disabled={currentStep === 1}
//             >
//               ← Back
//             </button>
//             {currentStep === STEPS.length ? (
//               <button
//                 onClick={handleSubmit}
//                 disabled={isSubmitting}
//                 className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Application"}
//               </button>
//             ) : (
//               <button
//                 onClick={handleNext}
//                 className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition inline-flex items-center gap-2"
//               >
//                 Next
//                 <span>→</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"
import axios from "axios"
import type React from "react"

import { useState } from "react"
import { ChevronLeft, Upload, CheckCircle2, AlertCircle, CheckCircle } from 'lucide-react'
import Link from "next/link"

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

const STEPS = [
  { number: 1, label: "Personal" },
  { number: 2, label: "Employment" },
  { number: 3, label: "Family" },
  { number: 4, label: "Financial" },
  { number: 5, label: "Request" },
  { number: 6, label: "References" },
  { number: 7, label: "Documents" },
  { number: 8, label: "Review" },
]

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const [formData, setFormData] = useState({
    // Step 1: Personal
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    gender: "",
    dateOfBirth: "",
    mobilePhone: "",
    homePhone: "",
    email: "",
    legalStatus: "",
    referredBy: "",
    referrerPhone: "",
    // Step 2: Employment
    employmentStatus: "",
    // Step 3: Family
    dependentsInfo: "",
    // Step 4: Financial
    totalMonthlyIncome: "",
    incomeSources: "",
    rentMortgage: "",
    utilities: "",
    food: "",
    otherExpenses: "",
    totalDebts: "",
    // Step 5: Request
    requestType: "Zakat",
    amountRequested: "",
    whyApplying: "",
    circumstances: "",
    previousZakat: "",
    // Step 6: References
    reference1: { fullName: "", phoneNumber: "", email: "", relationship: "" },
    reference2: { fullName: "", phoneNumber: "", email: "", relationship: "" },
    // Step 7: Documents
    documents: [] as File[],
  })

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReferenceChange = (refNumber: 1 | 2, field: string, value: string) => {
    const refKey = refNumber === 1 ? "reference1" : "reference2"
    setFormData((prev) => ({
      ...prev,
      [refKey]: { ...prev[refKey], [field]: value },
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const uploadedFiles = Array.from(files)
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of uploadedFiles) {
      if (file.size > maxSize) {
        showToast(`File ${file.name} exceeds 10MB limit`, "error")
        return
      }
    }

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...uploadedFiles],
    }))
    showToast(`${uploadedFiles.length} file(s) uploaded successfully`, "success")
  }

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://rahmah-exchange-backend-production.up.railway.app"

      // Create FormData to handle file uploads
      const submitData = new FormData()

      // Add all form data
      submitData.append("firstName", formData.firstName)
      submitData.append("lastName", formData.lastName)
      submitData.append("streetAddress", formData.streetAddress)
      submitData.append("city", formData.city)
      submitData.append("state", formData.state)
      submitData.append("zipCode", formData.zipCode)
      submitData.append("gender", formData.gender)
      submitData.append("dateOfBirth", formData.dateOfBirth)
      submitData.append("mobilePhone", formData.mobilePhone)
      submitData.append("homePhone", formData.homePhone)
      submitData.append("email", formData.email)
      submitData.append("legalStatus", formData.legalStatus)
      submitData.append("referredBy", formData.referredBy)
      submitData.append("referrerPhone", formData.referrerPhone)
      submitData.append("employmentStatus", formData.employmentStatus)
      submitData.append("dependentsInfo", formData.dependentsInfo)
      submitData.append("totalMonthlyIncome", formData.totalMonthlyIncome)
      submitData.append("incomeSources", formData.incomeSources)
      submitData.append("rentMortgage", formData.rentMortgage)
      submitData.append("utilities", formData.utilities)
      submitData.append("food", formData.food)
      submitData.append("otherExpenses", formData.otherExpenses)
      submitData.append("totalDebts", formData.totalDebts)
      submitData.append("requestType", formData.requestType)
      submitData.append("amountRequested", formData.amountRequested)
      submitData.append("whyApplying", formData.whyApplying)
      submitData.append("circumstances", formData.circumstances)
      submitData.append("previousZakat", formData.previousZakat)
      submitData.append("reference1", JSON.stringify(formData.reference1))
      submitData.append("reference2", JSON.stringify(formData.reference2))

      // Add documents
      formData.documents.forEach((file, index) => {
        submitData.append(`documents`, file)
      })

      const response = await axios.post("https://rahmah-exchange-backend-production.up.railway.app", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      console.log("✅ Application submitted:", response.data)
      showToast("Application submitted successfully!", "success")
      setIsSubmitted(true)
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong submitting your application. Please try again."
      console.error("❌ Error submitting application:", error)
      showToast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepCompleted = (step: number) => step < currentStep

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
        <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
          <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-teal-600 transition font-medium">
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </header>

        <div className="px-8 py-12 max-w-2xl mx-auto">
          {/* Success Banner */}
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-semibold">Application submitted successfully!</p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Application Status</h1>

            {/* Current Status */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-gray-600 text-sm font-medium mb-2">Current Status</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <span className="text-blue-700 font-semibold text-sm">Submitted</span>
              </div>
            </div>

            {/* Application Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Application Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Application ID</p>
                  <p className="text-gray-900 font-semibold">b6b368b5</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Submitted Date</p>
                  <p className="text-gray-900 font-semibold">03/11/2025</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Applicant Name</p>
                  <p className="text-gray-900 font-semibold">
                    {formData.firstName} {formData.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Request Type</p>
                  <p className="text-gray-900 font-semibold">{formData.requestType}</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 text-sm">Your application has been received and is pending review.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-blue-50">
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <Link href="/" className="flex items-center gap-2 text-gray-900 hover:text-teal-600 transition font-medium">
          <ChevronLeft className="w-5 h-5" />
          Back to Home
        </Link>
        <button className="px-6 py-2 text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition">
          Save Progress
        </button>
      </header>

      {/* Main Content */}
      <div className="px-8 py-12 max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Assistance Application</h1>
          <p className="text-gray-600">Complete all steps to submit your application for verified support</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-4">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${
                    step.number === currentStep
                      ? "bg-teal-600 text-white"
                      : isStepCompleted(step.number)
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isStepCompleted(step.number) ? "✓" : step.number}
                </div>
                <p className="text-sm text-gray-600 text-center text-balance font-medium">{step.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-1">
            <div
              className="bg-gray-900 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder=""
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* ZIP Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-600"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Home Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Home Phone</label>
                  <input
                    type="tel"
                    name="homePhone"
                    value={formData.homePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Legal Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Legal Status</label>
                  <select
                    name="legalStatus"
                    value={formData.legalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-600"
                  >
                    <option value="">Select status</option>
                    <option value="citizen">Citizen</option>
                    <option value="resident">Resident</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Referred By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Referred By</label>
                  <input
                    type="text"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="mb-8">
                {/* Referrer Phone */}
                <label className="block text-sm font-semibold text-gray-900 mb-2">Referrer Phone</label>
                <input
                  type="tel"
                  name="referrerPhone"
                  value={formData.referrerPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder=""
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Employment Information</h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Employment Status</label>
                <select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="">Select status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Family Information</h2>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dependents Information</h3>
                <textarea
                  name="dependentsInfo"
                  value={formData.dependentsInfo}
                  onChange={handleChange}
                  placeholder="List your dependents with their names, ages, and relationship. Example:&#10;- John Smith, 8 years old, Son&#10;- Mary Smith, 5 years old, Daughter&#10;- Mother-in-law, 65 years old, lives with us"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-48"
                />
                <p className="text-sm text-gray-500 mt-2">Please list all people who depend on you financially</p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Financial Information</h2>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Income</h3>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Total Monthly Income</label>
                  <input
                    type="number"
                    name="totalMonthlyIncome"
                    value={formData.totalMonthlyIncome}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Income Sources</label>
                  <textarea
                    name="incomeSources"
                    value={formData.incomeSources}
                    onChange={handleChange}
                    placeholder="List all income sources: salary, spouse salary, social security, unemployment, child support, etc."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-32"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Rent/Mortgage</label>
                    <input
                      type="number"
                      name="rentMortgage"
                      value={formData.rentMortgage}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Utilities (Electric, Gas, Water)
                    </label>
                    <input
                      type="number"
                      name="utilities"
                      value={formData.utilities}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Food</label>
                    <input
                      type="number"
                      name="food"
                      value={formData.food}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Other Expenses</label>
                    <input
                      type="text"
                      name="otherExpenses"
                      value={formData.otherExpenses}
                      onChange={handleChange}
                      placeholder="Transportation, medical, school, etc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Total Debts</label>
                  <input
                    type="number"
                    name="totalDebts"
                    value={formData.totalDebts}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Application Request</h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Request Type</label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Zakat">Zakat</option>
                  <option value="Sadaqah">Sadaqah</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Amount Requested</label>
                <input
                  type="number"
                  name="amountRequested"
                  value={formData.amountRequested}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Why Are You Applying for {formData.requestType}?
                </label>
                <textarea
                  name="whyApplying"
                  value={formData.whyApplying}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about your situation and why you need assistance..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-32"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Explain Your Circumstances</label>
                <textarea
                  name="circumstances"
                  value={formData.circumstances}
                  onChange={handleChange}
                  placeholder="Explain your circumstances and how the assistance will help"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Have you received {formData.requestType}/Sadaqa in the past 12 months?
                </label>
                <select
                  name="previousZakat"
                  value={formData.previousZakat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">References (2 Required)</h2>
              <p className="text-gray-600 mb-8">Please provide two references who can vouch for you</p>

              {/* Reference 1 */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-teal-600 rounded" />
                  <h3 className="text-lg font-bold text-gray-900">Reference 1</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.reference1.fullName}
                      onChange={(e) => handleReferenceChange(1, "fullName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.reference1.phoneNumber}
                      onChange={(e) => handleReferenceChange(1, "phoneNumber", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.reference1.email}
                      onChange={(e) => handleReferenceChange(1, "email", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      How do you know this person?
                    </label>
                    <input
                      type="text"
                      value={formData.reference1.relationship}
                      onChange={(e) => handleReferenceChange(1, "relationship", e.target.value)}
                      placeholder="e.g., Friend from Masjid, Neighbor"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>

              {/* Reference 2 */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-blue-500 rounded" />
                  <h3 className="text-lg font-bold text-gray-900">Reference 2</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.reference2.fullName}
                      onChange={(e) => handleReferenceChange(2, "fullName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.reference2.phoneNumber}
                      onChange={(e) => handleReferenceChange(2, "phoneNumber", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.reference2.email}
                      onChange={(e) => handleReferenceChange(2, "email", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      How do you know this person?
                    </label>
                    <input
                      type="text"
                      value={formData.reference2.relationship}
                      onChange={(e) => handleReferenceChange(2, "relationship", e.target.value)}
                      placeholder="e.g., Family friend, Colleague"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Supporting Documents</h2>
              <p className="text-gray-600 mb-6">
                Please upload supporting documents such as: ID, bills, pay stubs, bank statements, etc.
              </p>

              <div className="mb-6">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer block"
                >
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-teal-600 font-semibold text-lg mb-2">Click to upload documents</p>
                  <p className="text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </label>
              </div>

              {formData.documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Uploaded Files ({formData.documents.length})
                  </h3>
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium text-sm">{doc.name}</span>
                          <span className="text-gray-500 text-xs">({(doc.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <button
                          onClick={() => removeDocument(index)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 8 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Review Your Application</h2>

              <div className="space-y-8">
                {/* Personal Information Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p>{formData.email}</p>
                    <p>{formData.mobilePhone}</p>
                  </div>
                </div>

                {/* Employment Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Employment</h3>
                  <div className="text-sm text-gray-600">
                    <p>Status: {formData.employmentStatus || "Not provided"}</p>
                  </div>
                </div>

                {/* Financial Summary Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Financial Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Monthly Income: ${formData.totalMonthlyIncome || "0"}</p>
                    <p>Monthly Rent: ${formData.rentMortgage || "0"}</p>
                    <p>Total Debts: ${formData.totalDebts || "0"}</p>
                  </div>
                </div>

                {/* Request Details Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Type: {formData.requestType}</p>
                    <p>Amount Requested: ${formData.amountRequested || "0"}</p>
                    <p>Reason: {formData.whyApplying.substring(0, 100) || "..."}</p>
                  </div>
                </div>

                {/* References Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">References</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>1. {formData.reference1.fullName || "-"}</p>
                    <p>2. {formData.reference2.fullName || "-"}</p>
                  </div>
                </div>

                {formData.documents.length > 0 && (
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      {formData.documents.map((doc, index) => (
                        <p key={index}>
                          {index + 1}. {doc.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Declaration Section */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Declaration:</span> I testify that the information provided in this
                    application is true and accurate to the best of my knowledge. I authorize the verification of this
                    information to determine my eligibility for {formData.requestType}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition font-medium disabled:opacity-50"
              disabled={currentStep === 1}
            >
              ← Back
            </button>
            {currentStep === STEPS.length ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition inline-flex items-center gap-2"
              >
                Next
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
