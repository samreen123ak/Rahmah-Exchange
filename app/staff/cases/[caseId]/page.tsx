"use client"

import Link from "next/link"
import { Heart, ChevronLeft } from "lucide-react"
import { useState } from "react"

interface CaseDetail {
  id: string
  applicantName: string
  caseId: string
  status: string
  priority: string
  personal: {
    name: string
    phone: string
    address: string
    maritalStatus: string
    preferredLanguage: string
  }
  household: {
    size: number
    dependents: number
  }
  financial: {
    employmentStatus: string
    monthlyExpenses: {
      food: number
      rent: number
      medical: number
      utilities: number
      other: number
    }
    totalDebts: number
  }
  request: {
    type: string
    amount: number
    reason: string
  }
  submittedDate: string
  documents: number
}

export default function CaseDetailPage({ params }: { params: { caseId: string } }) {
  const [caseData] = useState<CaseDetail>({
    id: params.caseId,
    applicantName: "Ahmed Khan",
    caseId: "6f806763",
    status: "Need Info",
    priority: "high",
    personal: {
      name: "Ahmed Khan",
      phone: "+1234567890",
      address: "123 Main Street, Springfield, IL",
      maritalStatus: "N/A",
      preferredLanguage: "English",
    },
    household: {
      size: 4,
      dependents: 2,
    },
    financial: {
      employmentStatus: "N/A",
      monthlyExpenses: {
        food: 600,
        rent: 0,
        medical: 200,
        utilities: 0,
        other: 0,
      },
      totalDebts: 5000,
    },
    request: {
      type: "Zakat",
      amount: 3000,
      reason: "Financial hardship",
    },
    submittedDate: "10/10/2025",
    documents: 0,
  })

  const [updateStatus, setUpdateStatus] = useState(caseData.status)

  return (
    <div className="min-h-screen bg-linear-to-b from-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Caseworker Dashboard</h1>
          </div>
          <Link href="/staff/cases" className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back to Cases
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Case Information */}
          <div className="col-span-2">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{caseData.applicantName}</h1>
                </div>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {caseData.status}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200 mt-6">
                <button className="pb-4 px-2 border-b-2 border-teal-600 text-teal-600 font-medium">Application</button>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="text-gray-900 font-medium">{caseData.personal.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{caseData.personal.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-gray-900 font-medium">{caseData.personal.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Marital Status</p>
                  <p className="text-gray-900 font-medium">{caseData.personal.maritalStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preferred Language</p>
                  <p className="text-gray-900 font-medium">{caseData.personal.preferredLanguage}</p>
                </div>
              </div>
            </div>

            {/* Household Information Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Household Information</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Household Size</p>
                  <p className="text-gray-900 font-medium">{caseData.household.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dependents</p>
                  <p className="text-gray-900 font-medium">{caseData.household.dependents}</p>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Information</h2>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Employment Status</p>
                <p className="text-gray-900 font-medium">{caseData.financial.employmentStatus}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Food</p>
                    <p className="text-gray-900 font-medium">${caseData.financial.monthlyExpenses.food}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rent/Mortgage</p>
                    <p className="text-gray-900 font-medium">${caseData.financial.monthlyExpenses.rent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Medical</p>
                    <p className="text-gray-900 font-medium">${caseData.financial.monthlyExpenses.medical}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Utilities</p>
                    <p className="text-gray-900 font-medium">${caseData.financial.monthlyExpenses.utilities}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 font-medium">Total Debts:</p>
                  <p className="text-gray-900 font-bold text-lg">${caseData.financial.totalDebts}</p>
                </div>
              </div>
            </div>

            {/* Request Type Section */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Request Details</h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Request Type</p>
                  <p className="text-gray-900 font-medium">{caseData.request.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Requested</p>
                  <p className="text-gray-900 font-medium">${caseData.request.amount}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Reason</p>
                  <p className="text-gray-900 font-medium">{caseData.request.reason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Case Actions */}
          <div className="col-span-1">
            {/* Case Actions */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Case Actions</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Update Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="Need Info">Need Info</option>
                  <option value="Ready for Approval">Ready for Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Disbursed">Disbursed</option>
                </select>
              </div>

              <button className="w-full bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition">
                Update Status
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Submitted:</p>
                  <p className="text-gray-900 font-medium">{caseData.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Documents:</p>
                  <p className="text-gray-900 font-medium">{caseData.documents}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
