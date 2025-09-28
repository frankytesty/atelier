"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  ShoppingCart, 
  FileText, 
  Euro, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Download,
  Calendar,
  Building,
  Target
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface Analytics {
  overview: {
    totalPartners: number
    totalOrders: number
    totalQuotes: number
    totalRevenue: number
    avgOrderValue: number
    conversionRate: number
  }
  partners: {
    byStatus: Record<string, number>
    byBusinessType: Record<string, number>
  }
  orders: {
    byStatus: Record<string, number>
    totalValue: number
  }
  quotes: {
    byStatus: Record<string, number>
  }
  monthly: any[]
  topPartners: any[]
}

interface AdminAnalyticsProps {
  analytics: Analytics
  adminUser: AdminUser
}

export function AdminAnalytics({ analytics }: AdminAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("de-DE").format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  // Daten für Charts vorbereiten
  const partnerStatusData = Object.entries(analytics.partners.byStatus).map(([status, count]) => ({
    name: status === "approved" ? "Genehmigt" : 
          status === "pending" ? "Ausstehend" : 
          status === "rejected" ? "Abgelehnt" : status,
    value: count,
    color: status === "approved" ? "#10b981" : 
           status === "pending" ? "#f59e0b" : 
           status === "rejected" ? "#ef4444" : "#6b7280"
  }))

  const businessTypeData = Object.entries(analytics.partners.byBusinessType).map(([type, count]) => ({
    name: type === "photographer" ? "Fotograf" :
          type === "videographer" ? "Videograf" :
          type === "wedding_planner" ? "Hochzeitsplaner" :
          type === "florist" ? "Florist" :
          type === "caterer" ? "Caterer" :
          type === "other" ? "Sonstiges" : type,
    value: count,
    color: "#3b82f6"
  }))

  const orderStatusData = Object.entries(analytics.orders.byStatus).map(([status, count]) => ({
    name: status === "draft" ? "Entwurf" :
          status === "pending" ? "Ausstehend" :
          status === "confirmed" ? "Bestätigt" :
          status === "in_production" ? "In Produktion" :
          status === "shipped" ? "Versendet" :
          status === "delivered" ? "Geliefert" :
          status === "cancelled" ? "Storniert" : status,
    value: count,
    color: "#8b5cf6"
  }))


  return (
    <div className="space-y-8">
      {/* Übersichtskarten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Gesamt Partner</p>
                <p className="text-2xl font-display text-charcoal-900">{formatNumber(analytics.overview.totalPartners)}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Gesamt Bestellungen</p>
                <p className="text-2xl font-display text-charcoal-900">{formatNumber(analytics.overview.totalOrders)}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Gesamt Angebote</p>
                <p className="text-2xl font-display text-charcoal-900">{formatNumber(analytics.overview.totalQuotes)}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Gesamtumsatz</p>
                <p className="text-2xl font-display text-gold-600">{formatCurrency(analytics.overview.totalRevenue)}</p>
              </div>
              <Euro className="w-8 h-8 text-gold-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance-Metriken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Durchschnittlicher Bestellwert</p>
                <p className="text-2xl font-display text-charcoal-900">{formatCurrency(analytics.overview.avgOrderValue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Konversionsrate</p>
                <p className="text-2xl font-display text-charcoal-900">{formatPercentage(analytics.overview.conversionRate)}</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Aktive Partner</p>
                <p className="text-2xl font-display text-charcoal-900">{analytics.partners.byStatus["approved"] || 0}</p>
              </div>
              <Building className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Partner nach Status */}
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-blue-600" />
              Partner nach Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={partnerStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {partnerStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Partner nach Branche */}
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Partner nach Branche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={businessTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bestellungs-Status */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Bestellungen nach Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Partner */}
      {analytics.topPartners.length > 0 && (
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gold-600" />
              Top Partner nach Umsatz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPartners.slice(0, 10).map((partner, index) => (
                <div key={partner.id} className="flex items-center justify-between p-3 rounded-lg border border-sage-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center text-sm font-medium text-gold-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">{partner.company_name}</p>
                      <p className="text-sm text-sage-600">{partner.contact_person}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal-900">{formatCurrency(partner.total_revenue || 0)}</p>
                    <p className="text-sm text-sage-600">{partner.order_count || 0} Bestellungen</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export-Buttons */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900">Berichte exportieren</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Partner-Bericht (PDF)
            </Button>
            <Button variant="outline" className="border-sage-200">
              <Download className="w-4 h-4 mr-2" />
              Bestellungs-Bericht (Excel)
            </Button>
            <Button variant="outline" className="border-sage-200">
              <Download className="w-4 h-4 mr-2" />
              Umsatz-Bericht (CSV)
            </Button>
            <Button variant="outline" className="border-sage-200">
              <Calendar className="w-4 h-4 mr-2" />
              Monatlicher Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
