import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MasterDashboard } from "@/components/admin/master-dashboard"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
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

    // Lade erweiterte Dashboard-Daten mit mehr Details
    const [
      partnersResult, 
      ordersResult, 
      quotesResult, 
      micrositesResult, 
      recentActivityResult,
      collectionsResult,
      brandKitsResult
    ] = await Promise.all([
      supabase.from("partners").select(`
        id, status, created_at, company_name, contact_person, email, business_type, approved_at,
        years_experience, average_events_per_year, specialties
      `).order("created_at", { ascending: false }),
      supabase.from("orders").select(`
        id, order_number, partner_id, status, total_amount, created_at, 
        partners!inner(company_name, contact_person)
      `).order("created_at", { ascending: false }),
      supabase.from("quotes").select(`
        id, quote_number, partner_id, status, total_amount, created_at, valid_until,
        partners!inner(company_name, contact_person)
      `).order("created_at", { ascending: false }),
      supabase.from("microsites").select(`
        id, title, partner_id, is_published, created_at, subdomain, custom_domain,
        partners!inner(company_name, contact_person)
      `).order("created_at", { ascending: false }),
      supabase
        .from("admin_audit_logs")
        .select("*, admin_users(full_name)")
        .order("created_at", { ascending: false })
        .limit(15),
      supabase.from("collections").select("id, partner_id, name, created_at").order("created_at", { ascending: false }),
      supabase.from("brand_kits").select("id, partner_id, name, is_active, created_at").order("created_at", { ascending: false })
    ])

    const partners = partnersResult.data || []
    
    // Transform orders to match the expected interface
    const orders = (ordersResult.data || []).map(order => ({
      ...order,
      partners: Array.isArray(order.partners) ? order.partners[0] : order.partners || { company_name: "Unbekannt", contact_person: "Unbekannt" }
    }))
    
    // Transform quotes to match the expected interface
    const quotes = (quotesResult.data || []).map(quote => ({
      ...quote,
      partners: Array.isArray(quote.partners) ? quote.partners[0] : quote.partners || { company_name: "Unbekannt", contact_person: "Unbekannt" }
    }))
    
    // Transform microsites to match the expected interface
    const microsites = (micrositesResult.data || []).map(microsite => ({
      ...microsite,
      partners: Array.isArray(microsite.partners) ? microsite.partners[0] : microsite.partners || { company_name: "Unbekannt", contact_person: "Unbekannt" }
    }))
    const recentActivity = recentActivityResult.data || []
    const collections = collectionsResult.data || []
    const brandKits = brandKitsResult.data || []

    // Erweiterte Statistiken mit mehr Metriken
    const totalRevenue = orders
      .filter(o => o.status === "delivered")
      .reduce((sum, order) => sum + (order.total_amount || 0), 0)

    const activeMicrosites = microsites.filter(m => m.is_published).length
    const activeBrandKits = brandKits.filter(b => b.is_active).length

    // Berechne Wachstumsraten (simuliert für Demo)
    const currentMonth = new Date().getMonth()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    
    const currentMonthPartners = partners.filter(p => {
      const created = new Date(p.created_at)
      return created.getMonth() === currentMonth
    }).length

    const previousMonthPartners = partners.filter(p => {
      const created = new Date(p.created_at)
      return created.getMonth() === previousMonth
    }).length

    const partnerGrowthRate = previousMonthPartners > 0 
      ? Math.round(((currentMonthPartners - previousMonthPartners) / previousMonthPartners) * 100)
      : currentMonthPartners > 0 ? 100 : 0

    const stats = {
      totalPartners: partners.length,
      approvedPartners: partners.filter((p) => p.status === "approved").length,
      pendingPartners: partners.filter((p) => p.status === "pending").length,
      rejectedPartners: partners.filter((p) => p.status === "rejected").length,
      newPartnersThisMonth: partners.filter((p) => {
        const created = new Date(p.created_at)
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return created >= monthAgo
      }).length,
      totalOrders: orders.length,
      totalRevenue,
      totalQuotes: quotes.length,
      totalMicrosites: microsites.length,
      activeMicrosites,
      totalCollections: collections.length,
      activeBrandKits,
      partnerGrowthRate,
      // Zusätzliche Metriken
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      conversionRate: quotes.length > 0 ? (orders.length / quotes.length) * 100 : 0,
      partnerRetentionRate: 87.5, // Simuliert
      systemUptime: 99.9 // Simuliert
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <MasterDashboard
            adminUser={adminUser}
            stats={stats}
            recentPartners={partners.slice(0, 15)}
            recentOrders={orders.slice(0, 15)}
            recentQuotes={quotes.slice(0, 15)}
            recentMicrosites={microsites.slice(0, 15)}
            recentActivity={recentActivity}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin dashboard error:", error)
    redirect("/auth/admin")
  }
}
