import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    let partner = null as any
    let partnerError: any = null

    if (user) {
      const { data, error } = await supabase.from("partners").select("*").eq("id", user.id).maybeSingle()
      partner = data
      partnerError = error?.message || null
    }

    return NextResponse.json({
      env: {
        hasUrl: Boolean(process.env["NEXT_PUBLIC_SUPABASE_URL"]),
        hasAnon: Boolean(process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]),
      },
      user,
      userError: userError?.message || null,
      partner,
      partnerError,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unknown" }, { status: 500 })
  }
}


