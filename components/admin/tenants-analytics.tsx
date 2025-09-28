"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  Calendar,
  Activity,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart
} from "lucide-react"
import { AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface Partner {
  id: string
  company_name: string
  status: string
  business_type: string
  created_at: string
  approved_at?: string
}

interface TenantAnalyticsProps {
  partners: Partner[]
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
}

export function TenantsAnalytics({ partners, timeRange = "30d", onTimeRangeChange }: TenantAnalyticsProps) {
  // Berechne Statistiken
  const totalPartners = partners.length
  const approvedPartners = partners.filter(p => p.status === "approved").length
  const pendingPartners = partners.filter(p => p.status === "pending").length
  const rejectedPartners = partners.filter(p => p.status === "rejected").length

  // Neue Partner in verschiedenen Zeiträumen
  const now = new Date()
  const last7Days = partners.filter(p => {
    const created = new Date(p.created_at)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return created >= weekAgo
  }).length

  const last30Days = partners.filter(p => {
    const created = new Date(p.created_at)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return created >= monthAgo
  }).length

  const last90Days = partners.filter(p => {
    const created = new Date(p.created_at)
    const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    return created >= quarterAgo
  }).length

  // Branchen-Verteilung
  const businessTypes = partners.reduce((acc, partner) => {
    acc[partner.business_type] = (acc[partner.business_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const businessTypeData = Object.entries(businessTypes).map(([type, count]) => ({
    name: type === "wedding_planner" ? "Hochzeitsplaner" :
          type === "venue" ? "Veranstaltungsort" :
          type === "event_manager" ? "Event-Manager" : "Sonstiges",
    value: count,
    color: type === "wedding_planner" ? "#8884d8" :
           type === "venue" ? "#82ca9d" :
           type === "event_manager" ? "#ffc658" : "#ff7300"
  }))

  // Registrierungsverlauf (letzte 12 Monate)
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (11 - i))
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const count = partners.filter(p => {
      const created = new Date(p.created_at)
      return created >= monthStart && created <= monthEnd
    }).length

    return {
      month: date.toLocaleDateString("de-DE", { month: "short" }),
      registrations: count,
      year: date.getFullYear()
    }
  })

  // Status-Verteilung für Pie Chart
  const statusData = [
    { name: "Aktiv", value: approvedPartners, color: "#10b981" },
    { name: "Ausstehend", value: pendingPartners, color: "#f59e0b" },
    { name: "Abgelehnt", value: rejectedPartners, color: "#ef4444" }
  ]

  // Top-Performer (nach Registrierungsdatum und Status)
  const topPerformers = partners
    .filter(p => p.status === "approved")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const metrics = [
    {
      title: "Gesamt Partner",
      value: totalPartners,
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Aktive Partner",
      value: approvedPartners,
      change: "+8%",
      changeType: "positive" as const,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ausstehende Anträge",
      value: pendingPartners,
      change: "-3%",
      changeType: "negative" as const,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Genehmigungsrate",
      value: totalPartners > 0 ? Math.round((approvedPartners / totalPartners) * 100) : 0,
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      suffix: "%"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Mandanten-Analytics</h1>
          <p className="text-sage-600">Detaillierte Einblicke in Ihre Partner-Basis</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={onTimeRangeChange || (() => {})}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Letzte 7 Tage</SelectItem>
              <SelectItem value="30d">Letzte 30 Tage</SelectItem>
              <SelectItem value="90d">Letzte 90 Tage</SelectItem>
              <SelectItem value="1y">Letztes Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Bericht exportieren
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
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
                  {metric.value.toLocaleString("de-DE")}{metric.suffix}
                </div>
                <div className="flex items-center gap-1">
                  {metric.changeType === "positive" ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${
                    metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}>
                    {metric.change} vs. Vorperiode
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrierungsverlauf */}
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Registrierungsverlauf
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status-Verteilung */}
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Status-Verteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Branchen-Analyse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-600" />
              Branchen-Verteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.value}</span>
                    <span className="text-xs text-sage-600">
                      ({Math.round((item.value / totalPartners) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zeitraum-Statistiken */}
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Neue Registrierungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Letzte 7 Tage</p>
                  <p className="text-xs text-blue-700">Neue Partner-Anmeldungen</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">{last7Days}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Letzte 30 Tage</p>
                  <p className="text-xs text-green-700">Neue Partner-Anmeldungen</p>
                </div>
                <div className="text-2xl font-bold text-green-600">{last30Days}</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Letzte 90 Tage</p>
                  <p className="text-xs text-purple-700">Neue Partner-Anmeldungen</p>
                </div>
                <div className="text-2xl font-bold text-purple-600">{last90Days}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top-Performer */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            Top-Performer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((partner, index) => (
              <div 
                key={partner.id}
                className="flex items-center justify-between p-3 border border-sage-100 rounded-lg hover:bg-sage-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900">{partner.company_name}</p>
                    <p className="text-sm text-sage-600">
                      {partner.business_type === "wedding_planner" ? "Hochzeitsplaner" :
                       partner.business_type === "venue" ? "Veranstaltungsort" :
                       partner.business_type === "event_manager" ? "Event-Manager" : "Sonstiges"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-100 text-green-700">Aktiv</Badge>
                  <p className="text-xs text-sage-500 mt-1">
                    Seit {new Date(partner.created_at).toLocaleDateString("de-DE")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Wichtige Erkenntnisse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Hohe Genehmigungsrate</span>
              </div>
              <p className="text-sm text-green-700">
                {Math.round((approvedPartners / totalPartners) * 100)}% der Anträge werden genehmigt
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Wachstumstrend</span>
              </div>
              <p className="text-sm text-blue-700">
                {last30Days} neue Partner in den letzten 30 Tagen
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-900">Ausstehende Anträge</span>
              </div>
              <p className="text-sm text-orange-700">
                {pendingPartners} Anträge warten auf Bearbeitung
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
