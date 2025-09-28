import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next")

  console.log("[v0] Auth callback processing:", { code: !!code, next, origin })

  if (code) {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error && data.session) {
        console.log("[v0] Auth callback success:", { userId: data.user?.id })

        const getRedirectUrl = (path: string) => {
          const forwardedHost = request.headers.get("x-forwarded-host")
          const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
          const isLocalEnv = process.env.NODE_ENV === "development"

          if (isLocalEnv) {
            return `${origin}${path}`
          } else if (forwardedHost) {
            return `${forwardedProto}://${forwardedHost}${path}`
          } else {
            return `${origin}${path}`
          }
        }

        // For email confirmations, always go to confirmation page first
        return NextResponse.redirect(getRedirectUrl("/auth/email-confirmed"))
      } else {
        console.error("[v0] Auth callback error:", error)
        return NextResponse.redirect(
          `${origin}/auth/login?error=auth_callback_error&message=${encodeURIComponent(error?.message || "Unknown error")}`,
        )
      }
    } catch (error) {
      console.error("[v0] Auth callback exception:", error)
      return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_exception`)
    }
  }

  console.log("[v0] Auth callback: No code parameter")
  return NextResponse.redirect(`${origin}/auth/login?error=no_auth_code`)
}
