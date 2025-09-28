import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  try {
    const supabase = await createClient()

    // Prüfe ob bereits Admin-Benutzer existieren
    const { data: existingAdmins } = await supabase
      .from("admin_users")
      .select("id")
      .limit(1)

    // Wenn keine Admins existieren, zur Setup-Seite weiterleiten
    if (!existingAdmins || existingAdmins.length === 0) {
      redirect("/auth/admin/setup")
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    // Wenn kein Benutzer angemeldet ist, zur Admin-Landing-Seite weiterleiten
    if (!user) redirect("/admin/landing")

    // Prüfe ob bereits ein Admin-Benutzer existiert
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    // Wenn Admin existiert, weiterleiten zum Dashboard
    if (adminUser && adminUser.is_active) {
      redirect("/admin/dashboard")
    }

    // Wenn kein Admin-Benutzer, zur Admin-Landing-Seite weiterleiten
    redirect("/admin/landing")
  } catch (error) {
    console.error("Admin page error:", error)
    redirect("/admin/landing")
  }
}