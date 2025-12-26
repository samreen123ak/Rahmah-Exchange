"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { setAuthToken } from "@/lib/auth-utils"

function StaffLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccess(message)
      // Clear URL parameter
      router.replace("/staff/login", { scroll: false })
    }
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const apiUrl = `/api/auth/login`
      console.log("Login API URL:", apiUrl)

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", res.status)

      const data = await res.json()
      console.log("Login response data:", data)

      if (!res.ok) {
        // Show specific error message for inactive accounts
        if (res.status === 403) {
          setError(data.message || "Your profile is currently inactive. Please contact an administrator.")
        } else {
          setError(data.message || "Invalid credentials")
        }
        setLoading(false)
        return
      }

      setAuthToken(data.token)
      router.push("/staff/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl justify-center items-center">
      <div className="flex items-center justify-center py-4">
        <Image src="/logo1.svg" alt="Rahmah Exchange Logo" width={170} height={170} priority />
      </div>
      {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Login</h2> */}
      {/*<p className="text-gray-600 mb-8">Access the admin dashboard</p> */}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* <p className="text-center text-gray-600 text-sm mt-8">
        Don't have an account?{" "}
        <Link href="/staff/signup" className="text-teal-600 font-semibold hover:text-teal-700 transition">
          Contact administrator
        </Link>
      </p> */}
    </div>
  )
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-600 flex flex-col">
      <header className="px-8 py-6 bg-white/5 backdrop-blur-sm">
        <Link href="/" className="text-white font-medium hover:text-teal-100 flex items-center gap-2 transition">
          <span>←</span> Back to Home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-6 bg-white rounded-full px-6 py-3 shadow-lg">
              <Image
                           src="/logo1.svg"
                           alt="Rahmah Exchange Logo"
                           width={170}
                           height={170}
                           priority
                         />
            </div>
            <p className="text-white/80 text-sm">Staff Administration Portal</p>
          </div> */}

          <Suspense fallback={<div className="bg-white rounded-2xl p-8 shadow-2xl h-96 animate-pulse" />}>
            <StaffLoginForm />
          </Suspense>

          <p className="text-center text-white/60 text-xs mt-6">Protected area. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  )
}
