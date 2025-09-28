import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminPartnersManagement } from "@/components/admin/admin-partners-management"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export const dynamic = "force-dynamic"

export default async function AdminPartnersPage() {
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

    // Lade alle Partner mit erweiterten Daten
    const { data: partners, error } = await supabase
      .from("partners")
      .select(`
        *,
        orders:orders(count),
        quotes:quotes(count),
        collections:collections(count)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching partners:", error)
    }

    // Lade Statistiken
    const [totalPartners, approvedPartners, pendingPartners, rejectedPartners] = await Promise.all([
      supabase.from("partners").select("id", { count: "exact" }),
      supabase.from("partners").select("id", { count: "exact" }).eq("status", "approved"),
      supabase.from("partners").select("id", { count: "exact" }).eq("status", "pending"),
      supabase.from("partners").select("id", { count: "exact" }).eq("status", "rejected"),
    ])

    const stats = {
      total: totalPartners.count || 0,
      approved: approvedPartners.count || 0,
      pending: pendingPartners.count || 0,
      rejected: rejectedPartners.count || 0,
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal-900 mb-2">Partner-Verwaltung</h1>
            <p className="text-sage-600">Verwalten Sie alle Partner und deren Anträge</p>
          </div>

          <AdminPartnersManagement 
            partners={partners || []} 
            stats={stats}
            adminUser={adminUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin partners page error:", error)
    redirect("/auth/admin")
  }
}