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
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
      .from("admin_users")
      .select("*", { count: "exact" })

    if (role && role !== "all") {
      query = query.eq("role", role)
    }

    if (status && status !== "all") {
      query = query.eq("is_active", status === "active")
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    const { data: adminUsers, error, count } = await query
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      adminUsers: adminUsers || [], 
      total: count || 0
    })
  } catch (error) {
    console.error("Admin users API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung - nur Super Admins können neue Admins erstellen
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active || adminUser.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { email, full_name, role, permissions, is_active } = body

    if (!email || !full_name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Erstelle Auth-Benutzer
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: "temp_password_123", // Temporäres Passwort
      email_confirm: true,
      user_metadata: {
        full_name,
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    if (!authUser.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Erstelle Admin-Benutzer
    const { data: newAdminUser, error: adminError } = await supabase
      .from("admin_users")
      .insert({
        id: authUser.user.id,
        email,
        full_name,
        role,
        permissions: permissions || ["partner_management"],
        is_active: is_active !== false,
      })
      .select()
      .single()

    if (adminError) {
      // Rollback: Lösche Auth-Benutzer falls Admin-Erstellung fehlschlägt
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: adminError.message }, { status: 500 })
    }

    // Erstelle Audit-Log
    await supabase.from("admin_audit_logs").insert({
      admin_id: user.id,
      action: "create",
      resource_type: "admin_user",
      resource_id: newAdminUser.id,
      new_values: { email, full_name, role, permissions },
    })

    return NextResponse.json({ adminUser: newAdminUser })
  } catch (error) {
    console.error("Admin users create API error:", error)
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
    const { userId, updates } = body

    if (!userId || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Lade aktuellen Benutzer
    const { data: targetUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .single()

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Berechtigungsprüfung
    if (adminUser.role !== "super_admin" && targetUser.role !== "moderator") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Aktualisiere Admin-Benutzer
    const { data: updatedUser, error } = await supabase
      .from("admin_users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Erstelle Audit-Log
    await supabase.from("admin_audit_logs").insert({
      admin_id: user.id,
      action: "update",
      resource_type: "admin_user",
      resource_id: userId,
      old_values: targetUser,
      new_values: updates,
    })

    return NextResponse.json({ adminUser: updatedUser })
  } catch (error) {
    console.error("Admin users update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung - nur Super Admins können Admins löschen
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active || adminUser.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    // Kann sich nicht selbst löschen
    if (userId === user.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
    }

    // Lade Benutzer für Audit-Log
    const { data: targetUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .single()

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Lösche Admin-Benutzer
    const { error: deleteError } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", userId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Lösche Auth-Benutzer
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Failed to delete auth user:", authError)
    }

    // Erstelle Audit-Log
    await supabase.from("admin_audit_logs").insert({
      admin_id: user.id,
      action: "delete",
      resource_type: "admin_user",
      resource_id: userId,
      old_values: targetUser,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin users delete API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
