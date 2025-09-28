"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardAnalytics } from "@/lib/hooks/use-dashboard-analytics"
import { RevenueChart } from "./revenue-chart"
import { OrdersChart } from "./orders-chart"
import { ConversionChart } from "./conversion-chart"
import { MicrositeAnalytics } from "./microsite-analytics"
import { ExportDialog } from "./export-dialog"
import { AnalyticsMetrics } from "./analytics-metrics"
import { Download, TrendingUp, Calendar, BarChart3, PieChart, Activity, RefreshCw } from "lucide-react"

interface AnalyticsDashboardProps {
  partnerId: string
}

export function AnalyticsDashboard({ partnerId }: AnalyticsDashboardProps) {
  const { stats, monthlyTrends, isLoading, error, refetch } = useDashboardAnalytics()
  const [timeRange, setTimeRange] = useState("6months")
  const [showExportDialog, setShowExportDialog] = useState(false)

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
                  <div className="h-3 bg-sage-200 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">Fehler beim Laden der Analytics-Daten: {error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Erneut versuchen
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header mit Aktionen */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48 border-sage-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Letzten 30 Tage</SelectItem>
              <SelectItem value="3months">Letzten 3 Monate</SelectItem>
              <SelectItem value="6months">Letzten 6 Monate</SelectItem>
              <SelectItem value="12months">Letzten 12 Monate</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-sage-600 border-sage-200">
            <Calendar className="w-3 h-3 mr-1" />
            Aktualisiert vor 5 Min.
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline" size="sm" className="border-sage-200 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
          <Button onClick={() => setShowExportDialog(true)} className="bg-gold-600 hover:bg-gold-700">
            <Download className="w-4 h-4 mr-2" />
            Exportieren
          </Button>
        </div>
      </div>

      {/* Metriken Übersicht */}
      {stats && <AnalyticsMetrics stats={stats} />}

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Umsatz
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Bestellungen
          </TabsTrigger>
          <TabsTrigger value="conversion" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Conversion
          </TabsTrigger>
          <TabsTrigger value="microsites" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Microsites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueChart data={monthlyTrends} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <OrdersChart data={monthlyTrends} stats={stats || { totalOrders: 0, totalQuotes: 0, quoteToOrderConversion: 0 }} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <ConversionChart stats={stats || { totalOrders: 0, totalQuotes: 0, quoteToOrderConversion: 0, activeQuotes: 0, pendingOrders: 0 }} monthlyTrends={monthlyTrends} />
        </TabsContent>

        <TabsContent value="microsites" className="space-y-6">
          <MicrositeAnalytics partnerId={partnerId} />
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        stats={stats}
        monthlyTrends={monthlyTrends}
        timeRange={timeRange}
      />
    </div>
  )
}
