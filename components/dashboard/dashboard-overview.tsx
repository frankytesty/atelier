"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, FileText, Euro, Clock, CheckCircle, TrendingUp, Calendar } from "lucide-react"

interface DashboardStats {
  totalCollections: number
  totalOrders: number
  totalQuotes: number
  totalRevenue: number
  pendingOrders: number
  activeQuotes: number
}

interface DashboardOverviewProps {
  stats: DashboardStats
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const statCards = [
    {
      title: "Kollektionen",
      value: stats.totalCollections,
      icon: Package,
      description: "Erstellte Kollektionen",
      color: "text-sage-600",
      bgColor: "bg-sage-100",
    },
    {
      title: "Bestellungen",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: `${stats.pendingOrders} in Bearbeitung`,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Angebote",
      value: stats.totalQuotes,
      icon: FileText,
      description: `${stats.activeQuotes} aktiv`,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Umsatz",
      value: formatCurrency(stats.totalRevenue),
      icon: Euro,
      description: "Gesamtumsatz",
      color: "text-gold-600",
      bgColor: "bg-gold-100",
      isAmount: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-charcoal-900">Übersicht</h2>
        <Badge variant="outline" className="text-sage-600 border-sage-200">
          <Calendar className="w-3 h-3 mr-1" />
          Letzten 30 Tage
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-sage-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-charcoal-700">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display text-charcoal-900 mb-1">
                  {stat.isAmount ? stat.value : stat.value.toLocaleString("de-DE")}
                </div>
                <p className="text-xs text-sage-600">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Schnelle Einblicke */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="text-lg font-display text-charcoal-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Wachstum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Neue Bestellungen</span>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Umsatz</span>
                <Badge className="bg-green-100 text-green-700">+8%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Kollektionen</span>
                <Badge className="bg-green-100 text-green-700">+15%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="text-lg font-display text-charcoal-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Ausstehend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Offene Angebote</span>
                <Badge variant="outline">{stats.activeQuotes}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">In Produktion</span>
                <Badge variant="outline">{stats.pendingOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Zu versenden</span>
                <Badge variant="outline">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="text-lg font-display text-charcoal-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Abgeschlossen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Diese Woche</span>
                <Badge className="bg-green-100 text-green-700">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Diesen Monat</span>
                <Badge className="bg-green-100 text-green-700">23</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-sage-600">Gesamt</span>
                <Badge className="bg-green-100 text-green-700">{stats.totalOrders}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
