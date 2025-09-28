import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Zeitraum für Statistiken (letzten 30 Tage)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Parallel alle Statistiken laden
    const [collectionsResult, ordersResult, quotesResult, micrositesResult, recentOrdersResult, recentQuotesResult] =
      await Promise.all([
        // Kollektionen
        supabase
          .from("collections")
          .select("id, created_at")
          .eq("partner_id", user.id),

        // Bestellungen
        supabase
          .from("orders")
          .select("id, total_amount, status, created_at")
          .eq("partner_id", user.id),

        // Angebote
        supabase
          .from("quotes")
          .select("id, total_amount, status, created_at")
          .eq("partner_id", user.id),

        // Microsites
        supabase
          .from("microsites")
          .select(`
          id,
          title,
          is_published,
          created_at,
          microsite_visits(created_at)
        `)
          .eq("partner_id", user.id),

        // Letzte Bestellungen
        supabase
          .from("orders")
          .select("id, total_amount, status, created_at, client_name")
          .eq("partner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),

        // Letzte Angebote
        supabase
          .from("quotes")
          .select("id, total_amount, status, created_at, client_name")
          .eq("partner_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5),
      ])

    const collections = collectionsResult.data || []
    const orders = ordersResult.data || []
    const quotes = quotesResult.data || []
    const microsites = micrositesResult.data || []
    const recentOrders = recentOrdersResult.data || []
    const recentQuotes = recentQuotesResult.data || []

    // Berechne Statistiken
    const stats = {
      // Grundstatistiken
      totalCollections: collections.length,
      totalOrders: orders.length,
      totalQuotes: quotes.length,
      totalMicrosites: microsites.length,

      // Umsatz
      totalRevenue: orders
        .filter((order) => order.status === "delivered")
        .reduce((sum, order) => sum + Number.parseFloat(order.total_amount.toString()), 0),

      // Status-basierte Zählungen
      pendingOrders: orders.filter((order) => ["pending", "confirmed", "in_production"].includes(order.status)).length,

      activeQuotes: quotes.filter((quote) => ["sent", "viewed"].includes(quote.status)).length,

      publishedMicrosites: microsites.filter((site) => site.is_published).length,

      // Wachstum (letzten 30 Tage)
      newCollectionsThisMonth: collections.filter((c) => new Date(c.created_at) >= thirtyDaysAgo).length,

      newOrdersThisMonth: orders.filter((o) => new Date(o.created_at) >= thirtyDaysAgo).length,

      newQuotesThisMonth: quotes.filter((q) => new Date(q.created_at) >= thirtyDaysAgo).length,

      // Microsite Besuche
      totalMicrositeVisits: microsites.reduce((total, site) => {
        return total + (site.microsite_visits?.length || 0)
      }, 0),

      // Conversion Rates
      quoteToOrderConversion: quotes.length > 0 ? Math.round((orders.length / quotes.length) * 100) : 0,
    }

    // Monatliche Trends (letzten 6 Monate)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.created_at)
        return orderDate >= monthStart && orderDate <= monthEnd
      })

      const monthQuotes = quotes.filter((quote) => {
        const quoteDate = new Date(quote.created_at)
        return quoteDate >= monthStart && quoteDate <= monthEnd
      })

      monthlyTrends.push({
        month: date.toLocaleDateString("de-DE", { month: "short", year: "numeric" }),
        orders: monthOrders.length,
        quotes: monthQuotes.length,
        revenue: monthOrders
          .filter((order) => order.status === "delivered")
          .reduce((sum, order) => sum + Number.parseFloat(order.total_amount.toString()), 0),
      })
    }

    return NextResponse.json({
      stats,
      monthlyTrends,
      recentActivity: {
        orders: recentOrders,
        quotes: recentQuotes,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
