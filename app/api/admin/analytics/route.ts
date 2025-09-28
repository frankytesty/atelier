import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "30d" // 7d, 30d, 90d, 1y

    // Berechne Zeitraum
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Parallel alle Analytics-Daten laden
    const [
      partnersResult,
      ordersResult,
      quotesResult,
      micrositesResult,
      revenueResult,
      partnerGrowthResult,
      businessTypeResult,
      statusDistributionResult
    ] = await Promise.all([
      // Partner-Statistiken
      supabase
        .from("partners")
        .select("id, status, created_at, business_type")
        .gte("created_at", startDate.toISOString()),
      
      // Bestellungs-Statistiken
      supabase
        .from("orders")
        .select("id, total_amount, status, created_at")
        .gte("created_at", startDate.toISOString()),
      
      // Angebots-Statistiken
      supabase
        .from("quotes")
        .select("id, total_amount, status, created_at")
        .gte("created_at", startDate.toISOString()),
      
      // Microsite-Statistiken
      supabase
        .from("microsites")
        .select("id, is_published, created_at")
        .gte("created_at", startDate.toISOString()),
      
      // Umsatz nach Monaten
      supabase
        .from("orders")
        .select("total_amount, created_at")
        .eq("status", "delivered")
        .gte("created_at", startDate.toISOString()),
      
      // Partner-Wachstum nach Monaten
      supabase
        .from("partners")
        .select("created_at")
        .gte("created_at", startDate.toISOString()),
      
      // Branchenverteilung
      supabase
        .from("partners")
        .select("business_type")
        .not("business_type", "is", null),
      
      // Status-Verteilung
      supabase
        .from("partners")
        .select("status")
    ])

    const partners = partnersResult.data || []
    const orders = ordersResult.data || []
    const quotes = quotesResult.data || []
    const microsites = micrositesResult.data || []
    const revenue = revenueResult.data || []
    const partnerGrowth = partnerGrowthResult.data || []
    const businessTypes = businessTypeResult.data || []
    const statusDistribution = statusDistributionResult.data || []

    // Berechne Metriken
    const totalRevenue = revenue.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const conversionRate = quotes.length > 0 ? (orders.length / quotes.length) * 100 : 0
    const activeMicrosites = microsites.filter(m => m.is_published).length

    // Partner-Wachstum nach Monaten
    const growthByMonth = partnerGrowth.reduce((acc, partner) => {
      const month = new Date(partner.created_at).toISOString().substring(0, 7)
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Umsatz nach Monaten
    const revenueByMonth = revenue.reduce((acc, order) => {
      const month = new Date(order.created_at).toISOString().substring(0, 7)
      acc[month] = (acc[month] || 0) + (order.total_amount || 0)
      return acc
    }, {} as Record<string, number>)

    // Branchenverteilung
    const businessTypeDistribution = businessTypes.reduce((acc, partner) => {
      const type = partner.business_type || "other"
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Status-Verteilung
    const partnerStatusDistribution = statusDistribution.reduce((acc, partner) => {
      acc[partner.status] = (acc[partner.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Chart-Daten formatieren
    const monthlyData = Object.keys(growthByMonth)
      .sort()
      .map(month => ({
        month: new Date(month + "-01").toLocaleDateString("de-DE", { month: "short", year: "2-digit" }),
        partners: growthByMonth[month] || 0,
        revenue: revenueByMonth[month] || 0,
      }))

    const businessTypeChartData = Object.entries(businessTypeDistribution).map(([type, count]) => ({
      name: type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      color: getBusinessTypeColor(type)
    }))

    const statusChartData = Object.entries(partnerStatusDistribution).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: getStatusColor(status)
    }))

    const analytics = {
      overview: {
        totalPartners: partners.length,
        totalOrders: orders.length,
        totalQuotes: quotes.length,
        totalRevenue,
        conversionRate: Math.round(conversionRate * 100) / 100,
        activeMicrosites,
        partnerGrowthRate: calculateGrowthRate(partnerGrowth),
      },
      charts: {
        monthlyData,
        businessTypeDistribution: businessTypeChartData,
        statusDistribution: statusChartData,
      },
      trends: {
        partnerGrowth: calculateTrend(partnerGrowth),
        revenueGrowth: calculateTrend(revenue),
        orderGrowth: calculateTrend(orders),
      }
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Admin analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getBusinessTypeColor(type: string): string {
  const colors: Record<string, string> = {
    wedding_planner: "#8B5CF6",
    venue: "#06B6D4",
    event_manager: "#10B981",
    other: "#6B7280"
  }
  return colors[type] || "#6B7280"
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "#F59E0B",
    approved: "#10B981",
    rejected: "#EF4444"
  }
  return colors[status] || "#6B7280"
}

function calculateGrowthRate(data: any[]): number {
  if (data.length < 2) return 0
  
  const sorted = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2)).length
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2)).length
  
  if (firstHalf === 0) return secondHalf > 0 ? 100 : 0
  
  return Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
}

function calculateTrend(data: any[]): "up" | "down" | "stable" {
  if (data.length < 2) return "stable"
  
  const sorted = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2)).length
  const secondHalf = sorted.slice(Math.floor(sorted.length / 2)).length
  
  if (secondHalf > firstHalf * 1.1) return "up"
  if (secondHalf < firstHalf * 0.9) return "down"
  return "stable"
}
