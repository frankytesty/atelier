import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminUsersManagement } from "@/components/admin/admin-users-management"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
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

    // Lade alle Admin-Benutzer
    const { data: adminUsers, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching admin users:", error)
    }

    // Lade Statistiken
    const [totalAdmins, activeAdmins, superAdmins, regularAdmins] = await Promise.all([
      supabase.from("admin_users").select("id", { count: "exact" }),
      supabase.from("admin_users").select("id", { count: "exact" }).eq("is_active", true),
      supabase.from("admin_users").select("id", { count: "exact" }).eq("role", "super_admin"),
      supabase.from("admin_users").select("id", { count: "exact" }).eq("role", "admin"),
    ])

    const stats = {
      total: totalAdmins.count || 0,
      active: activeAdmins.count || 0,
      superAdmins: superAdmins.count || 0,
      regularAdmins: regularAdmins.count || 0,
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal-900 mb-2">Admin-Benutzer-Verwaltung</h1>
            <p className="text-sage-600">Verwalten Sie alle Administrator-Benutzer und deren Berechtigungen</p>
          </div>

          <AdminUsersManagement 
            adminUsers={adminUsers || []} 
            stats={stats}
            currentAdmin={adminUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin users page error:", error)
    redirect("/auth/admin")
  }
}
