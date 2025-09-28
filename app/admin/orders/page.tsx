import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminOrdersManagement } from "@/components/admin/admin-orders-management"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
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

    // Lade alle Bestellungen mit Partner-Informationen
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        partners(company_name, contact_person, email),
        order_items(
          *,
          product:products(name, base_price, images)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
    }

    // Lade Statistiken
    const [totalOrders, pendingOrders, confirmedOrders, deliveredOrders] = await Promise.all([
      supabase.from("orders").select("id", { count: "exact" }),
      supabase.from("orders").select("id", { count: "exact" }).eq("status", "pending"),
      supabase.from("orders").select("id", { count: "exact" }).eq("status", "confirmed"),
      supabase.from("orders").select("id", { count: "exact" }).eq("status", "delivered"),
    ])

    const stats = {
      total: totalOrders.count || 0,
      pending: pendingOrders.count || 0,
      confirmed: confirmedOrders.count || 0,
      delivered: deliveredOrders.count || 0,
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal-900 mb-2">Bestellungen-Verwaltung</h1>
            <p className="text-sage-600">Verwalten Sie alle Bestellungen und deren Status</p>
          </div>

          <AdminOrdersManagement 
            orders={orders || []} 
            stats={stats}
            adminUser={adminUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin orders page error:", error)
    redirect("/auth/admin")
  }
}