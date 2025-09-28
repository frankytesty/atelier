import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminAuditLogs } from "@/components/admin/admin-audit-logs"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export const dynamic = "force-dynamic"

export default async function AdminAuditPage() {
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

    // Lade Audit-Logs mit Admin-Informationen
    const { data: auditLogs, error } = await supabase
      .from("admin_audit_logs")
      .select(`
        *,
        admin_users(full_name, email, role)
      `)
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      console.error("Error fetching audit logs:", error)
    }

    // Lade Statistiken
    const [totalLogs, todayLogs, thisWeekLogs, thisMonthLogs] = await Promise.all([
      supabase.from("admin_audit_logs").select("id", { count: "exact" }),
      supabase.from("admin_audit_logs").select("id", { count: "exact" }).gte("created_at", new Date().toISOString().split('T')[0]),
      supabase.from("admin_audit_logs").select("id", { count: "exact" }).gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from("admin_audit_logs").select("id", { count: "exact" }).gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    ])

    const stats = {
      total: totalLogs.count || 0,
      today: todayLogs.count || 0,
      thisWeek: thisWeekLogs.count || 0,
      thisMonth: thisMonthLogs.count || 0,
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal-900 mb-2">Audit-Logs</h1>
            <p className="text-sage-600">Aktivitätsverfolgung und System-Überwachung</p>
          </div>

          <AdminAuditLogs 
            auditLogs={auditLogs || []} 
            stats={stats}
            adminUser={adminUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin audit page error:", error)
    redirect("/auth/admin")
  }
}
