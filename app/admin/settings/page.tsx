import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSettings } from "@/components/admin/admin-settings"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export const dynamic = "force-dynamic"

export default async function AdminSettingsPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/auth/admin")

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    if (!adminUser || !adminUser.is_active) {
      redirect("/auth/admin")
    }

    // Lade System-Einstellungen (falls vorhanden)
    const { data: settings } = await supabase
      .from("system_settings")
      .select("*")
      .single()

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal-900 mb-2">System-Einstellungen</h1>
            <p className="text-sage-600">Konfiguration der Plattform und Verwaltungseinstellungen</p>
          </div>

          <AdminSettings 
            settings={settings}
            adminUser={adminUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin settings page error:", error)
    redirect("/auth/admin")
  }
}