"use client"

import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/auth-utils"
import { jwtDecode } from "jwt-decode"

interface TenantBranding {
  logoUrl: string | null
  brandColor: string
}

export function useTenantBranding(masjidSlug?: string): TenantBranding {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [brandColor, setBrandColor] = useState<string>("#0d9488")

  useEffect(() => {
    // Check if user is super admin
    const token = getAuthToken()
    let isSuperAdmin = false
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        isSuperAdmin = decoded.role === "super_admin"
      } catch (err) {
        // Token might not exist on login/setup pages - that's ok
      }
    }

    // Super admins always see default branding
    if (isSuperAdmin || !masjidSlug) {
      setLogoUrl(null)
      setBrandColor("#0d9488")
      return
    }

    // Fetch tenant branding for non-super-admin users
    const fetchTenantBranding = async () => {
      try {
        const res = await fetch(`/api/tenants/${masjidSlug}`)
        if (res.ok) {
          const data = await res.json()
          // Only use branding if tenant has it set (not null/empty)
          // If tenant doesn't have branding, use defaults
          setLogoUrl(data.logoUrl || null)
          setBrandColor(data.brandColor || "#0d9488")
        } else {
          // Default to standard branding if tenant not found
          setLogoUrl(null)
          setBrandColor("#0d9488")
        }
      } catch (err) {
        console.error("Failed to fetch tenant branding:", err)
        // Default to standard branding on error
        setLogoUrl(null)
        setBrandColor("#0d9488")
      }
    }

    fetchTenantBranding()
  }, [masjidSlug])

  return { logoUrl, brandColor }
}

