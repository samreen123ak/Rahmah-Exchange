"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Share2, LogOut } from "lucide-react"
import { getAuthToken, removeAuthToken } from "@/lib/auth-utils"
import SharedProfilesList from "@/components/shared-profiles-list"

export default function SharedProfilesPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (!token) router.push("/staff/login")
    else setLoading(false)
  }, [router])

  const handleLogout = () => {
    removeAuthToken()
    router.push("/staff/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/staff/dashboard" className="flex items-center gap-3">
            <Image src="/logo1.svg" alt="Rahmah Exchange Logo" width={140} height={140} priority />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/staff/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium">
                Dashboard
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Share2 className="w-8 h-8 text-teal-600" />
            <h2 className="text-3xl font-bold text-gray-900">Shared Profiles</h2>
          </div>
          <p className="text-gray-600">Profiles shared with your organization</p>
        </div>

        <SharedProfilesList />
      </div>
    </div>
  )
}
