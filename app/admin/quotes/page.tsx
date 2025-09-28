import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminQuotesManagement } from "@/components/admin/admin-quotes-management"

export const dynamic = "force-dynamic"

export default async function AdminQuotesPage() {
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

    // Lade alle Angebote mit Partner-Informationen
    const { data: quotes, error } = await supabase
      .from("quotes")
      .select(`
        *,
        partners(company_name, contact_person, email),
        quote_items(
          *,
          product:products(name, base_price, images)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching quotes:", error)
    }

    // Lade Statistiken
    const [totalQuotes, pendingQuotes, acceptedQuotes, expiredQuotes] = await Promise.all([
      supabase.from("quotes").select("id", { count: "exact" }),
      supabase.from("quotes").select("id", { count: "exact" }).eq("status", "pending"),
      supabase.from("quotes").select("id", { count: "exact" }).eq("status", "accepted"),
      supabase.from("quotes").select("id", { count: "exact" }).eq("status", "expired"),
    ])

    const stats = {
      total: totalQuotes.count || 0,
      pending: pendingQuotes.count || 0,
      accepted: acceptedQuotes.count || 0,
      expired: expiredQuotes.count || 0,
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal-900 mb-2">Angebote-Verwaltung</h1>
            <p className="text-sage-600">Verwalten Sie alle Angebote und deren Status</p>
          </div>

          <AdminQuotesManagement 
            quotes={quotes || []} 
            stats={stats}
            adminUser={adminUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin quotes page error:", error)
    redirect("/auth/admin")
  }
}
