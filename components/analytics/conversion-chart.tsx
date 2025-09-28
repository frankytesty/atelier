"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Target, TrendingUp, Users } from "lucide-react"

interface ConversionChartProps {
  stats: {
    totalOrders: number
    totalQuotes: number
    quoteToOrderConversion: number
    activeQuotes: number
    pendingOrders: number
  }
  monthlyTrends: Array<{
    month: string
    orders: number
    quotes: number
    revenue: number
  }>
}


export function ConversionChart({ stats, monthlyTrends }: ConversionChartProps) {
  // Conversion Funnel Data
  const funnelData = [
    { name: "Angebote erstellt", value: stats.totalQuotes, color: "#8B5CF6" },
    { name: "Angebote angesehen", value: Math.round(stats.totalQuotes * 0.8), color: "#3B82F6" },
    { name: "Bestellungen erhalten", value: stats.totalOrders, color: "#10B981" },
    { name: "Bestellungen abgeschlossen", value: Math.round(stats.totalOrders * 0.85), color: "#059669" },
  ]

  // Status Distribution
  const statusData = [
    { name: "Abgeschlossen", value: Math.round(stats.totalOrders * 0.7), color: "#10B981" },
    { name: "In Bearbeitung", value: stats.pendingOrders, color: "#F59E0B" },
    { name: "Aktive Angebote", value: stats.activeQuotes, color: "#8B5CF6" },
    {
      name: "Sonstige",
      value: Math.max(0, stats.totalQuotes - stats.activeQuotes - stats.totalOrders),
      color: "#6B7280",
    },
  ]

  // Monthly Conversion Rates
  const conversionTrends = monthlyTrends.map((month) => ({
    month: month.month,
    conversion: month.quotes > 0 ? Math.round((month.orders / month.quotes) * 100) : 0,
    orders: month.orders,
    quotes: month.quotes,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Conversion Funnel */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((item, index) => {
              const percentage = index === 0 ? 100 : Math.round((item.value / (funnelData[0]?.value || 1)) * 100)
              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-charcoal-900">{item.name}</span>
                    <span className="text-sm text-sage-600">
                      {item.value} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-sage-100 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Status Verteilung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-64">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-sage-200 rounded-lg shadow-lg">
                        <p className="font-medium text-charcoal-900">{data.name}</p>
                        <p className="text-sm text-sage-600">{data.value} Einträge</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-sage-600">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Trends */}
      <Card className="lg:col-span-2 border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Conversion Rate Entwicklung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-64">
            <BarChart data={conversionTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-sage-200" />
              <XAxis dataKey="month" className="text-sage-600" />
              <YAxis className="text-sage-600" />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-sage-200 rounded-lg shadow-lg">
                        <p className="font-medium text-charcoal-900">{label}</p>
                        <p className="text-sm text-sage-600">Conversion: {data.conversion}%</p>
                        <p className="text-sm text-sage-600">
                          {data.orders} Bestellungen von {data.quotes} Angeboten
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="conversion" fill="#8B5CF6" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
