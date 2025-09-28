"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  FileText,
  Euro,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Users,
  Target,
  Clock,
} from "lucide-react"

interface AnalyticsMetricsProps {
  stats: {
    totalCollections: number
    totalOrders: number
    totalQuotes: number
    totalMicrosites: number
    totalRevenue: number
    pendingOrders: number
    activeQuotes: number
    publishedMicrosites: number
    newCollectionsThisMonth: number
    newOrdersThisMonth: number
    newQuotesThisMonth: number
    totalMicrositeVisits: number
    quoteToOrderConversion: number
  }
}

export function AnalyticsMetrics({ stats }: AnalyticsMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }


  const metrics = [
    {
      title: "Gesamtumsatz",
      value: formatCurrency(stats.totalRevenue),
      icon: Euro,
      description: "Abgeschlossene Bestellungen",
      color: "text-gold-600",
      bgColor: "bg-gold-100",
      growth: 12, // Mock growth data
      isAmount: true,
    },
    {
      title: "Bestellungen",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: `${stats.pendingOrders} in Bearbeitung`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      growth: stats.newOrdersThisMonth > 0 ? 8 : 0,
    },
    {
      title: "Angebote",
      value: stats.totalQuotes,
      icon: FileText,
      description: `${stats.activeQuotes} aktiv`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      growth: stats.newQuotesThisMonth > 0 ? 15 : 0,
    },
    {
      title: "Kollektionen",
      value: stats.totalCollections,
      icon: Package,
      description: "Erstellte Kollektionen",
      color: "text-sage-600",
      bgColor: "bg-sage-100",
      growth: stats.newCollectionsThisMonth > 0 ? 5 : 0,
    },
    {
      title: "Microsites",
      value: stats.totalMicrosites,
      icon: ExternalLink,
      description: `${stats.publishedMicrosites} veröffentlicht`,
      color: "text-green-600",
      bgColor: "bg-green-100",
      growth: 20, // Mock growth
    },
    {
      title: "Website-Besuche",
      value: stats.totalMicrositeVisits,
      icon: Users,
      description: "Gesamte Microsite-Besuche",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      growth: 25, // Mock growth
    },
    {
      title: "Conversion Rate",
      value: `${stats.quoteToOrderConversion}%`,
      icon: Target,
      description: "Angebot zu Bestellung",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      growth: stats.quoteToOrderConversion > 50 ? 3 : -2,
      isPercentage: true,
    },
    {
      title: "Ø Bearbeitungszeit",
      value: "3.2 Tage",
      icon: Clock,
      description: "Angebot bis Bestellung",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      growth: -10, // Negative is good for processing time
      isTime: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const isPositiveGrowth = metric.growth > 0
        const GrowthIcon = isPositiveGrowth ? TrendingUp : TrendingDown

        return (
          <Card key={metric.title} className="border-sage-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-charcoal-700">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display text-charcoal-900 mb-1">
                {metric.isAmount || metric.isPercentage || metric.isTime
                  ? metric.value
                  : typeof metric.value === "number"
                    ? metric.value.toLocaleString("de-DE")
                    : metric.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-sage-600">{metric.description}</p>
                {metric.growth !== 0 && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      isPositiveGrowth
                        ? "text-green-700 border-green-200 bg-green-50"
                        : "text-red-700 border-red-200 bg-red-50"
                    }`}
                  >
                    <GrowthIcon className="w-3 h-3 mr-1" />
                    {Math.abs(metric.growth)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
