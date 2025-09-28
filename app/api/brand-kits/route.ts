import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: brandKits, error } = await supabase
      .from("brand_kits")
      .select("*")
      .eq("partner_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(brandKits)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data: brandKit, error } = await supabase
      .from("brand_kits")
      .insert([
        {
          partner_id: user.id,
          ...body,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(brandKit)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
