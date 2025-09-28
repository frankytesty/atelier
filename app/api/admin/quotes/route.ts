import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    let query = supabase
      .from("quotes")
      .select(`
        *,
        partners(
          company_name,
          contact_person,
          email
        ),
        quote_items(
          *,
          product:products(
            name,
            base_price,
            images
          )
        )
      `, { count: "exact" })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`
        quote_number.ilike.%${search}%,
        client_name.ilike.%${search}%,
        client_email.ilike.%${search}%,
        partners.company_name.ilike.%${search}%
      `)
    }

    const { data: quotes, error, count } = await query
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      quotes: quotes || [], 
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error("Admin quotes API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { quoteId, updates } = body

    if (!quoteId || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Aktualisiere Angebot
    const { data: quote, error } = await supabase
      .from("quotes")
      .update(updates)
      .eq("id", quoteId)
      .select(`
        *,
        partners(
          company_name,
          contact_person,
          email
        ),
        quote_items(
          *,
          product:products(
            name,
            base_price,
            images
          )
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Erstelle Audit-Log
    await supabase.from("admin_audit_logs").insert({
      admin_id: user.id,
      action: "update",
      resource_type: "quote",
      resource_id: quoteId,
      new_values: updates,
    })

    return NextResponse.json({ quote })
  } catch (error) {
    console.error("Admin quotes update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
