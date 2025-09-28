import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - Alle Partner abrufen
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Prüfe Admin-Berechtigung
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // URL-Parameter für Filterung
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const businessType = searchParams.get("business_type")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Baue Query auf
    let query = supabase
      .from("partners")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    // Filter anwenden
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (businessType && businessType !== "all") {
      query = query.eq("business_type", businessType)
    }

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Paginierung
    query = query.range(offset, offset + limit - 1)

    const { data: partners, error, count } = await query

    if (error) {
      console.error("Error fetching partners:", error)
      return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
    }

    return NextResponse.json({
      partners,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Partner aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Prüfe Admin-Berechtigung
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { partnerId, updates } = body

    if (!partnerId || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Aktualisiere Partner
    const { data: updatedPartner, error } = await supabase
      .from("partners")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", partnerId)
      .select()
      .single()

    if (error) {
      console.error("Error updating partner:", error)
      return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
    }

    // Log die Aktion
    await supabase
      .from("admin_audit_logs")
      .insert({
        admin_id: user.id,
        action: `Partner ${partnerId} aktualisiert`,
        resource_type: "partner",
        resource_id: partnerId,
        new_values: updates
      })

    return NextResponse.json({ partner: updatedPartner })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Partner löschen
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Prüfe Admin-Berechtigung
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const partnerId = searchParams.get("partnerId")

    if (!partnerId) {
      return NextResponse.json({ error: "Missing partner ID" }, { status: 400 })
    }

    // Log die Aktion vor dem Löschen
    await supabase
      .from("admin_audit_logs")
      .insert({
        admin_id: user.id,
        action: `Partner ${partnerId} gelöscht`,
        resource_type: "partner",
        resource_id: partnerId
      })

    // Lösche Partner
    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", partnerId)

    if (error) {
      console.error("Error deleting partner:", error)
      return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
