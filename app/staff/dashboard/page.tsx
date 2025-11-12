"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CheckCircle2, TrendingUp, FileText, Heart, LogOut, Shield } from "lucide-react"
import { removeAuthToken, getAuthToken, authenticatedFetch } from "@/lib/auth-utils"
import AdminHeader from "@/components/header-admin"

type ZakatApplicant = {
  id?: string | number
  status?: string
  createdAt?: string
  normalizedStatus?: string
  [key: string]: any
}

type StatCardProps = {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: string
}

type StatusRowProps = {
  label: string
  value: number
  color: string
}

export default function DashboardPage() {
  const [activeTab] = useState("overview")
  const [applicants, setApplicants] = useState<ZakatApplicant[]>([])
  const [totalFromAPI, setTotalFromAPI] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/staff/login")
      return
    }
  }, [router])

  const normalizeStatus = (status?: string) => {
    return (status || "").toString().trim().toLowerCase().replace(/\s+/g, " ")
  }

  const handleLogout = async () => {
    try {
      const token = getAuthToken()
      if (token) {
        await authenticatedFetch(`/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch(() => {})
      }
      removeAuthToken()
      router.push("/staff/login")
    } catch (err) {
      console.error("Logout failed:", err)
      removeAuthToken()
      router.push("/staff/login")
    }
  }

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await authenticatedFetch(`/api/zakat-applicants`)
        const json = await res.json()

        const dataArray: any[] = Array.isArray(json) ? json : json.items || json.data || []

        const normalizedArray: ZakatApplicant[] = dataArray.map((a) => ({
          ...a,
          normalizedStatus: normalizeStatus(a?.status),
        }))

        setApplicants(normalizedArray)

        if (typeof json.total === "number") {
          setTotalFromAPI(json.total)
        } else if (typeof json.totalCount === "number") {
          setTotalFromAPI(json.totalCount)
        } else {
          setTotalFromAPI(normalizedArray.length)
        }
      } catch (error) {
        console.error("Error fetching applicants:", error)
        setApplicants([])
      } finally {
        setLoading(false)
      }
    }

    fetchApplicants()
  }, [])

  const approvedCount = applicants.filter((app) => app.normalizedStatus === "approved").length
  const pendingCount = applicants.filter((app) => app.normalizedStatus === "pending").length
  const rejectedCount = applicants.filter((app) => app.normalizedStatus === "rejected").length

  const todayISO = new Date().toISOString().split("T")[0]
  const todaysSubmissions = applicants.filter((app) => {
    if (!app.createdAt) return false
    try {
      const createdISO = new Date(app.createdAt).toISOString().split("T")[0]
      return createdISO === todayISO
    } catch {
      return app.createdAt?.toString().startsWith(todayISO)
    }
  }).length

  const uniqueStatuses = [...new Set(applicants.map((a) => a.normalizedStatus || ""))]
    .filter(Boolean)
    .sort()
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Case Management System</p>
            </div> */}
                         <Image
                              src="/logo1.svg"
                              alt="Rahmah Exchange Logo"
                              width={170}
                              height={170}
                              priority
                              />
                            
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Here's an overview of pending applications</p>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <StatCard
                    title="Total Applications"
                    value={totalFromAPI ?? applicants.length}
                    icon={<FileText className="w-5 h-5" />}
                    color="from-blue-600 to-cyan-600"
                  />
                  <StatCard
                    title="Pending Review"
                    value={pendingCount}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="from-yellow-600 to-orange-600"
                  />
                  <StatCard
                    title="Approved"
                    value={approvedCount}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    color="from-green-600 to-emerald-600"
                  />
                  <StatCard
                    title="New Today"
                    value={todaysSubmissions}
                    icon={<Shield className="w-5 h-5" />}
                    color="from-teal-600 to-cyan-600"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Application Status</h3>
                    <div className="space-y-6">
                      <StatusRow label="Pending" value={pendingCount} color="from-yellow-500 to-orange-500" />
                      <StatusRow label="Approved" value={approvedCount} color="from-green-500 to-emerald-500" />
                      <StatusRow label="Rejected" value={rejectedCount} color="from-red-500 to-rose-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link href="/staff/cases">
                        <button className="w-full px-6 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition">
                          View All Cases
                        </button>
                      </Link>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">{pendingCount}</span> applications awaiting review
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color = "text-gray-900" }: any) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function StatusRow({ label, value, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className={`px-4 py-2 bg-gradient-to-r ${color} text-white rounded-lg font-semibold`}>{value}</div>
    </div>
  )
}
