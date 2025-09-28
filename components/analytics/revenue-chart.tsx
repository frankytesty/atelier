"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp } from "lucide-react"

interface RevenueChartProps {
  data: Array<{
    month: string
    orders: number
    quotes: number
    revenue: number
  }>
  timeRange: string
}

const chartConfig = {
  revenue: {
    label: "Umsatz",
    color: "#D4AF37",
  },
  orders: {
    label: "Bestellungen",
    color: "#8B7355",
  },
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const averageRevenue = totalRevenue / data.length
  const growth = data.length > 1 ? ((data[data.length - 1]?.revenue || 0) - (data[0]?.revenue || 0)) / (data[0]?.revenue || 1) * 100 : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hauptchart */}
      <Card className="lg:col-span-2 border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-gold-600" />
            Umsatzentwicklung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-sage-200" />
              <XAxis dataKey="month" className="text-sage-600" />
              <YAxis tickFormatter={formatCurrency} className="text-sage-600" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      name === "revenue" ? formatCurrency(value as number) : value,
                      name === "revenue" ? "Umsatz" : "Bestellungen",
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D4AF37"
                fill="#D4AF37"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Statistiken */}
      <div className="space-y-6">
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-lg text-charcoal-900">Umsatz-Statistiken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-sage-600 mb-1">Gesamtumsatz</p>
              <p className="text-2xl font-display text-charcoal-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">Durchschnitt/Monat</p>
              <p className="text-xl font-display text-charcoal-900">{formatCurrency(averageRevenue)}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">Wachstum</p>
              <p className={`text-xl font-display ${growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {growth >= 0 ? "+" : ""}
                {growth.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-lg text-charcoal-900">Top Monate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3)
                .map((item, index) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          index === 0 ? "bg-gold-500" : index === 1 ? "bg-sage-500" : "bg-sage-300"
                        }`}
                      />
                      <span className="text-sm text-charcoal-900">{item.month}</span>
                    </div>
                    <span className="text-sm font-medium text-charcoal-900">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
