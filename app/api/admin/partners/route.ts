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

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: partners, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(partners)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { partnerId, status } = await request.json()

    const updateData: any = { status }
    if (status === "approved") {
      updateData.approved_at = new Date().toISOString()
    }

    const { data: partner, error } = await supabase
      .from("partners")
      .update(updateData)
      .eq("id", partnerId)
      .select()
      .single()

    if (error) throw error

    // Erstelle Audit-Log
    await supabase.rpc("create_audit_log", {
      p_action: `Partner ${status}`,
      p_resource_type: "partner",
      p_resource_id: partnerId,
      p_new_values: { status },
    })

    return NextResponse.json(partner)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
