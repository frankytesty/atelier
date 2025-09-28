"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, XAxis, YAxis, CartesianGrid, ComposedChart } from "recharts"
import { ShoppingCart } from "lucide-react"

interface OrdersChartProps {
  data: Array<{
    month: string
    orders: number
    quotes: number
    revenue: number
  }>
  stats: {
    totalOrders: number
    totalQuotes: number
    quoteToOrderConversion: number
  }
  timeRange: string
}

const chartConfig = {
  orders: {
    label: "Bestellungen",
    color: "#3B82F6",
  },
  quotes: {
    label: "Angebote",
    color: "#8B5CF6",
  },
}

export function OrdersChart({ data, stats }: OrdersChartProps) {
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0)
  const totalQuotes = data.reduce((sum, item) => sum + item.quotes, 0)
  const averageOrdersPerMonth = totalOrders / data.length
  const averageQuotesPerMonth = totalQuotes / data.length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hauptchart */}
      <Card className="lg:col-span-2 border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
            Bestellungen & Angebote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-sage-200" />
              <XAxis dataKey="month" className="text-sage-600" />
              <YAxis className="text-sage-600" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      value,
                      name === "orders" ? "Bestellungen" : name === "quotes" ? "Angebote" : name,
                    ]}
                  />
                }
              />
              <Bar dataKey="quotes" fill="#8B5CF6" fillOpacity={0.6} />
              <Bar dataKey="orders" fill="#3B82F6" />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Statistiken */}
      <div className="space-y-6">
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-lg text-charcoal-900">Bestellstatistiken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-sage-600 mb-1">Gesamt Bestellungen</p>
              <p className="text-2xl font-display text-charcoal-900">{stats.totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">Ø Bestellungen/Monat</p>
              <p className="text-xl font-display text-charcoal-900">{averageOrdersPerMonth.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">Conversion Rate</p>
              <p className="text-xl font-display text-green-600">{stats.quoteToOrderConversion}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-lg text-charcoal-900">Angebots-Statistiken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-sage-600 mb-1">Gesamt Angebote</p>
              <p className="text-2xl font-display text-charcoal-900">{stats.totalQuotes}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">Ø Angebote/Monat</p>
              <p className="text-xl font-display text-charcoal-900">{averageQuotesPerMonth.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">Erfolgsquote</p>
              <p className="text-xl font-display text-blue-600">
                {totalQuotes > 0 ? ((totalOrders / totalQuotes) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
