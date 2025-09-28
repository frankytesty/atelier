import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { email, fullName, role = "super_admin" } = await request.json()

    if (!email || !fullName) {
      return NextResponse.json({ error: "E-Mail und Name sind erforderlich" }, { status: 400 })
    }

    // Prüfe ob der Benutzer bereits existiert
    const { data: existingUser } = await supabase.auth.getUser()
    if (!existingUser.user) {
      return NextResponse.json({ error: "Kein authentifizierter Benutzer" }, { status: 401 })
    }

    // Prüfe ob bereits ein Admin-Benutzer existiert
    const { data: existingAdmin } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", existingUser.user.id)
      .single()

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin-Benutzer existiert bereits" }, { status: 400 })
    }

    // Erstelle Admin-Benutzer
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .insert({
        id: existingUser.user.id,
        email: email,
        full_name: fullName,
        role: role,
        permissions: role === "super_admin" ? ["all"] : ["read", "write"],
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Admin-Benutzer erfolgreich erstellt",
      adminUser 
    })

  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
