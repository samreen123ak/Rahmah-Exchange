"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, AlertCircle } from "lucide-react"

interface Case {
  _id: string
  firstName: string
  lastName: string
  requestType: string
  amountRequested: number | null
  status: string
  createdAt: string
}

interface ApiResponse {
  items: Case[]
  total: number
  page: number
  limit: number
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch("https://rahmah-exchange-backend-production.up.railway.app/api/zakatApplicants", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error(`API error: ${res.status} ${res.statusText}`)
        }

        const result: ApiResponse = await res.json()
        console.log("[v0] Fetched data:", result)

        const caseData = Array.isArray(result.items) ? result.items : []
        setCases(caseData)
        setError(null)
      } catch (error) {
        console.error("[v0] Error fetching cases:", error)
        setError(`Failed to load cases: ${error instanceof Error ? error.message : "Unknown error"}`)
        setCases([])
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

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
          <Link href="/staff/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
            Back to Overview
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Case Queue</h2>
          <p className="text-gray-600">Welcome, System</p>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-600">Loading cases...</p>}

        {/* Error */}
        {error && <p className="text-red-600 bg-red-50 p-4 rounded">{error}</p>}

        {/* No Cases */}
        {!loading && !error && cases.length === 0 && <p className="text-gray-600">No cases found.</p>}

        {/* Cases List */}
        <div className="space-y-6">
          {cases.map((caseItem) => (
            <div key={caseItem._id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {caseItem.firstName} {caseItem.lastName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        caseItem.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : caseItem.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {caseItem.status}
                    </span>

                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">High Priority</span>
                    </div>
                  </div>
                </div>

                <Link href={`/staff/cases/${caseItem._id}`}>
                  <button className="px-4 py-2 text-teal-600 font-medium hover:text-teal-700 transition">
                    View Case
                  </button>
                </Link>
              </div>

              {/* Case Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Case ID</p>
                  <p className="font-semibold text-gray-900">{caseItem._id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Request Type</p>
                  <p className="font-semibold text-gray-900">{caseItem.requestType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount Requested</p>
                  <p className="font-semibold text-gray-900">
                    {caseItem.amountRequested ? `$${caseItem.amountRequested}` : "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Submitted</p>
                  <p className="font-semibold text-gray-900">{new Date(caseItem.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
