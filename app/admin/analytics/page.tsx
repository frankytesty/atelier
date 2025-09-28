import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TenantsAnalytics } from "@/components/admin/tenants-analytics"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export const dynamic = "force-dynamic"

export default async function AdminAnalyticsPage() {
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

    // Lade alle Partner für Analytics
    const { data: partners, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading partners:", error)
      throw error
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <TenantsAnalytics partners={partners || []} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Analytics page error:", error)
    redirect("/auth/admin")
  }
}