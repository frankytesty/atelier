import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UserQuickMenu } from "@/components/navigation/user-quick-menu"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Lade Partner-Profil
  const { data: partner } = await supabase.from("partners").select("*").eq("id", user.id).single()

  if (!partner) {
    redirect("/auth/login")
  }

  // Lade Dashboard-Statistiken
  const [collectionsResult, ordersResult, quotesResult] = await Promise.all([
    supabase.from("collections").select("id").eq("partner_id", user.id),
    supabase.from("orders").select("id, total_amount, status, created_at").eq("partner_id", user.id),
    supabase.from("quotes").select("id, total_amount, status, created_at").eq("partner_id", user.id),
  ])

  const collections = collectionsResult.data || []
  const orders = ordersResult.data || []
  const quotes = quotesResult.data || []

  // Berechne Statistiken
  const stats = {
    totalCollections: collections.length,
    totalOrders: orders.length,
    totalQuotes: quotes.length,
    totalRevenue: orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + Number.parseFloat(order.total_amount.toString()), 0),
    pendingOrders: orders.filter((order) => ["pending", "confirmed", "in_production"].includes(order.status)).length,
    activeQuotes: quotes.filter((quote) => ["sent", "viewed"].includes(quote.status)).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-sage-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <UserQuickMenu name={partner.contact_person} company={partner.company_name} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardOverview stats={stats} />
            <RecentActivity orders={orders.slice(0, 5)} quotes={quotes.slice(0, 5)} />
          </div>
          <div>
            <QuickActions partner={partner} />
          </div>
        </div>
      </div>
    </div>
  )
}
