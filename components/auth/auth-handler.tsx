"use client"

import { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export function AuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isProcessing = useRef(false)

  useEffect(() => {
    const code = searchParams.get("code")

    if (code && !isProcessing.current) {
      isProcessing.current = true
      console.log("[v0] Processing auth code:", code)

      const supabase = createBrowserClient(
        process.env['NEXT_PUBLIC_SUPABASE_URL']!,
        process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
      )

      // Exchange the code for a session
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            console.error("[v0] Auth code exchange error:", error)
            router.push("/auth/login?error=auth_failed")
          } else if (data.session) {
            console.log("[v0] Auth successful, redirecting to partner dashboard")
            window.location.href = "/partner/dashboard"
          }
          isProcessing.current = false
        })
        .catch((err) => {
          console.error("[v0] Auth exchange failed:", err)
          router.push("/auth/login?error=auth_failed")
          isProcessing.current = false
        })
    }
  }, [searchParams, router])

  return null // This component doesn't render anything
}
