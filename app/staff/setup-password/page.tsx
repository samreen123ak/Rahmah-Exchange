"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"

function SetupPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string>("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null)
  const [tokenValid, setTokenValid] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
      verifyToken(tokenParam)
    } else {
      setLoading(false)
      setError("No invitation token provided")
    }
  }, [searchParams])

  const verifyToken = async (tokenValue: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/setup-password?token=${encodeURIComponent(tokenValue)}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Invalid or expired invitation link")
        setTokenValid(false)
        return
      }

      setUserInfo(data.user)
      setTokenValid(true)
    } catch (err: any) {
      setError("Failed to verify invitation link")
      setTokenValid(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch("/api/admin/setup-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Failed to set password")
        return
      }

      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/staff/login?message=Password set successfully. Please log in.")
      }, 2000)
    } catch (err: any) {
      setError("Failed to set password. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-gray-600">Verifying invitation link...</p>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation Link</h1>
          <p className="text-gray-600 mb-6">{error || "This invitation link is invalid or has expired."}</p>
          <p className="text-sm text-gray-500">
            Please contact your super administrator to request a new invitation link.
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Set Successfully!</h1>
          <p className="text-gray-600 mb-6">Your password has been set. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Image src="/logo1.svg" alt="Rahmah Exchange" width={120} height={120} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Set Your Password</h1>
          {userInfo && (
            <p className="text-gray-600">
              Welcome, <strong>{userInfo.name}</strong> ({userInfo.email})
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">Please set a secure password to access your admin account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your password (min. 6 characters)"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Setting Password..." : "Set Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          After setting your password, you can log in at{" "}
          <a href="/staff/login" className="text-teal-600 hover:text-teal-700">
            /staff/login
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SetupPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SetupPasswordContent />
    </Suspense>
  )
}
