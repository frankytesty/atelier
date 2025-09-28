"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Building2, 
  DollarSign,
  Target,
  Award,
  AlertTriangle,
  Star,
  Bell
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"

interface DashboardWidgetsProps {
  stats: any
  partners: any[]
  orders: any[]
  quotes: any[]
  microsites: any[]
}

export function DashboardWidgets({ stats, partners, orders, quotes, microsites }: DashboardWidgetsProps) {
  // Erweiterte Analytics-Daten
  const generatePerformanceData = () => {
    return [
      { metric: "Partner-Zufriedenheit", value: 94, max: 100 },
      { metric: "System-Performance", value: 98, max: 100 },
      { metric: "API-Response", value: 95, max: 100 },
      { metric: "Datenbank-Performance", value: 97, max: 100 },
      { metric: "Sicherheits-Score", value: 99, max: 100 },
      { metric: "Verfügbarkeit", value: 99.9, max: 100 }
    ]
  }

  const performanceData = generatePerformanceData()

  // Branchen-Analyse
  const businessTypeAnalysis = partners.reduce((acc, partner) => {
    const type = partner.business_type === "wedding_planner" ? "Hochzeitsplaner" :
                 partner.business_type === "venue" ? "Veranstaltungsorte" :
                 partner.business_type === "event_manager" ? "Event-Manager" : "Sonstiges"
    
    if (!acc[type]) {
      acc[type] = { count: 0, revenue: 0, orders: 0 }
    }
    acc[type].count++
    
    // Simuliere Umsatz und Bestellungen
    const partnerOrders = orders.filter(o => o.partner_id === partner.id)
    acc[type].orders += partnerOrders.length
    acc[type].revenue += partnerOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
    
    return acc
  }, {} as Record<string, { count: number, revenue: number, orders: number }>)

  const businessTypeData = Object.entries(businessTypeAnalysis).map(([type, data]) => ({
    name: type,
    partners: (data as { count: number, revenue: number, orders: number }).count,
    revenue: (data as { count: number, revenue: number, orders: number }).revenue,
    orders: (data as { count: number, revenue: number, orders: number }).orders,
    color: type === "Hochzeitsplaner" ? "#3b82f6" :
           type === "Veranstaltungsorte" ? "#10b981" :
           type === "Event-Manager" ? "#f59e0b" : "#ef4444"
  }))

  // Zeitreihen-Daten für Trends
  const generateTrendData = () => {
    const data = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      data.push({
        month: date.toLocaleDateString("de-DE", { month: "short" }),
        year: date.getFullYear(),
        partners: Math.floor(Math.random() * 50) + 20,
        orders: Math.floor(Math.random() * 100) + 30,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        quotes: Math.floor(Math.random() * 80) + 20,
        microsites: Math.floor(Math.random() * 30) + 10
      })
    }
    return data
  }

  const trendData = generateTrendData()

  // Top-Performer berechnen
  const topPerformers = partners
    .filter(p => p.status === "approved")
    .map(partner => {
      const partnerOrders = orders.filter(o => o.partner_id === partner.id)
      const partnerQuotes = quotes.filter(q => q.partner_id === partner.id)
      const partnerMicrosites = microsites.filter(m => m.partner_id === partner.id)
      
      const revenue = partnerOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      const conversionRate = partnerQuotes.length > 0 ? (partnerOrders.length / partnerQuotes.length) * 100 : 0
      const activityScore = (partnerOrders.length * 2) + (partnerMicrosites.length * 3) + (conversionRate / 10)
      
      return {
        ...partner,
        revenue,
        orders: partnerOrders.length,
        quotes: partnerQuotes.length,
        microsites: partnerMicrosites.length,
        conversionRate,
        activityScore: Math.round(activityScore)
      }
    })
    .sort((a, b) => b.activityScore - a.activityScore)
    .slice(0, 5)

  // Intelligente Insights
  const generateInsights = () => {
    const insights = []
    
    if (stats.pendingPartners > 5) {
      insights.push({
        type: "warning",
        title: "Hohe Anzahl ausstehender Anträge",
        message: `${stats.pendingPartners} Partner warten auf Genehmigung`,
        action: "Anträge prüfen",
        icon: AlertTriangle
      })
    }
    
    if (stats.newPartnersThisMonth > stats.totalPartners * 0.1) {
      insights.push({
        type: "success",
        title: "Starkes Wachstum",
        message: `${stats.newPartnersThisMonth} neue Partner diesen Monat (+${Math.round((stats.newPartnersThisMonth / stats.totalPartners) * 100)}%)`,
        action: "Wachstum analysieren",
        icon: TrendingUp
      })
    }
    
    if (stats.conversionRate > 25) {
      insights.push({
        type: "success",
        title: "Hohe Konversionsrate",
        message: `${stats.conversionRate.toFixed(1)}% Quote-zu-Bestellung Konversion`,
        action: "Erfolgsfaktoren analysieren",
        icon: Target
      })
    }
    
    if (stats.totalRevenue > 0 && stats.averageOrderValue > 1000) {
      insights.push({
        type: "info",
        title: "Hoher durchschnittlicher Bestellwert",
        message: `€${stats.averageOrderValue.toFixed(0)} pro Bestellung`,
        action: "Premium-Strategien prüfen",
        icon: DollarSign
      })
    }
    
    return insights
  }

  const insights = generateInsights()

  return (
    <div className="space-y-6">
      {/* Performance-Radar-Chart */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RadarChart className="w-5 h-5 text-indigo-600" />
            System-Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Branchen-Analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Branchen-Analyse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-sage-50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-medium text-charcoal-900">{item.name}</p>
                      <p className="text-sm text-sage-600">{item.partners} Partner</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-charcoal-900">{item.orders}</p>
                    <p className="text-xs text-sage-600">Bestellungen</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top-Performer */}
        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Top-Performer
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              Aktivitäts-Score
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((partner, index) => (
                <div key={partner.id} className="flex items-center justify-between p-3 rounded-lg bg-sage-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">{partner.company_name}</p>
                      <p className="text-sm text-sage-600">{partner.contact_person}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-charcoal-900">{partner.activityScore}</span>
                    </div>
                    <p className="text-xs text-green-600">
                      {partner.conversionRate.toFixed(1)}% Konversion
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligente Insights */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Intelligente Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    insight.type === "warning" ? "bg-orange-50 border-orange-200" :
                    insight.type === "success" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === "warning" ? "bg-orange-100" :
                      insight.type === "success" ? "bg-green-100" : "bg-blue-100"
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        insight.type === "warning" ? "text-orange-600" :
                        insight.type === "success" ? "text-green-600" : "text-blue-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        insight.type === "warning" ? "text-orange-900" :
                        insight.type === "success" ? "text-green-900" : "text-blue-900"
                      }`}>
                        {insight.title}
                      </h4>
                      <p className={`text-sm ${
                        insight.type === "warning" ? "text-orange-700" :
                        insight.type === "success" ? "text-green-700" : "text-blue-700"
                      }`}>
                        {insight.message}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className={`mt-2 ${
                          insight.type === "warning" ? "border-orange-200 text-orange-700 hover:bg-orange-100" :
                          insight.type === "success" ? "border-green-200 text-green-700 hover:bg-green-100" : "border-blue-200 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Erweiterte Trends */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Erweiterte Trend-Analyse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }} 
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="partners" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="Neue Partner"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="orders" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Bestellungen"
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                stroke="#f59e0b" 
                fill="none"
                strokeWidth={3}
                name="Umsatz (€)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
