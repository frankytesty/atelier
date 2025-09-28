"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { ExternalLink, Eye, Users, Clock, TrendingUp } from "lucide-react"

interface MicrositeAnalyticsProps {
  partnerId: string
}

interface MicrositeData {
  id: string
  title: string
  subdomain: string
  is_published: boolean
  visits: number
  unique_visitors: number
  avg_session_duration: number
  bounce_rate: number
  created_at: string
}

export function MicrositeAnalytics({ partnerId }: MicrositeAnalyticsProps) {
  const [microsites, setMicrosites] = useState<MicrositeData[]>([])
  const [visitTrends, setVisitTrends] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockMicrosites: MicrositeData[] = [
      {
        id: "1",
        title: "Hochzeit Anna & Max",
        subdomain: "anna-max",
        is_published: true,
        visits: 1250,
        unique_visitors: 890,
        avg_session_duration: 180,
        bounce_rate: 35,
        created_at: "2024-01-15",
      },
      {
        id: "2",
        title: "Elegante Sommerhochzeit",
        subdomain: "sommer-eleganz",
        is_published: true,
        visits: 890,
        unique_visitors: 650,
        avg_session_duration: 220,
        bounce_rate: 28,
        created_at: "2024-02-20",
      },
      {
        id: "3",
        title: "Vintage Hochzeit",
        subdomain: "vintage-style",
        is_published: false,
        visits: 45,
        unique_visitors: 32,
        avg_session_duration: 95,
        bounce_rate: 65,
        created_at: "2024-03-10",
      },
    ]

    const mockTrends = [
      { month: "Jan", visits: 450, unique_visitors: 320 },
      { month: "Feb", visits: 680, unique_visitors: 480 },
      { month: "Mär", visits: 920, unique_visitors: 650 },
      { month: "Apr", visits: 1100, unique_visitors: 780 },
      { month: "Mai", visits: 1350, unique_visitors: 950 },
      { month: "Jun", visits: 1580, unique_visitors: 1120 },
    ]

    setMicrosites(mockMicrosites)
    setVisitTrends(mockTrends)
    setIsLoading(false)
  }, [partnerId])

  const totalVisits = microsites.reduce((sum, site) => sum + site.visits, 0)
  const totalUniqueVisitors = microsites.reduce((sum, site) => sum + site.unique_visitors, 0)
  const avgSessionDuration = microsites.reduce((sum, site) => sum + site.avg_session_duration, 0) / microsites.length
  const avgBounceRate = microsites.reduce((sum, site) => sum + site.bounce_rate, 0) / microsites.length

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-sage-200">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-sage-200 rounded w-3/4" />
                  <div className="h-8 bg-sage-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Microsite Metriken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-700">Gesamte Besuche</CardTitle>
            <Eye className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display text-charcoal-900">{totalVisits.toLocaleString("de-DE")}</div>
            <p className="text-xs text-sage-600">Alle Microsites</p>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-700">Unique Visitors</CardTitle>
            <Users className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display text-charcoal-900">{totalUniqueVisitors.toLocaleString("de-DE")}</div>
            <p className="text-xs text-sage-600">Eindeutige Besucher</p>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-700">Ø Sitzungsdauer</CardTitle>
            <Clock className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display text-charcoal-900">
              {formatDuration(Math.round(avgSessionDuration))}
            </div>
            <p className="text-xs text-sage-600">Durchschnittlich</p>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-700">Bounce Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display text-charcoal-900">{avgBounceRate.toFixed(1)}%</div>
            <p className="text-xs text-sage-600">Absprungrate</p>
          </CardContent>
        </Card>
      </div>

      {/* Besucher-Trends */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Besucher-Entwicklung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-64">
            <AreaChart data={visitTrends}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-sage-200" />
              <XAxis dataKey="month" className="text-sage-600" />
              <YAxis className="text-sage-600" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      value,
                      name === "visits" ? "Besuche" : name === "unique_visitors" ? "Unique Visitors" : name,
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="unique_visitors"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Microsite Performance */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-green-600" />
            Microsite Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {microsites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 rounded-lg border border-sage-100 hover:bg-sage-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium text-charcoal-900">{site.title}</h3>
                    <p className="text-sm text-sage-600">{site.subdomain}.atelier-luminform.com</p>
                  </div>
                  <Badge variant={site.is_published ? "default" : "outline"} className="text-xs">
                    {site.is_published ? "Veröffentlicht" : "Entwurf"}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-charcoal-900">{site.visits.toLocaleString("de-DE")}</p>
                    <p className="text-sage-600">Besuche</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-charcoal-900">{site.unique_visitors.toLocaleString("de-DE")}</p>
                    <p className="text-sage-600">Unique</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-charcoal-900">{formatDuration(site.avg_session_duration)}</p>
                    <p className="text-sage-600">Ø Dauer</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-charcoal-900">{site.bounce_rate}%</p>
                    <p className="text-sage-600">Bounce</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
