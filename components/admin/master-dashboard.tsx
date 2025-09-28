"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Globe, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Award,
  Shield,
  RefreshCw,
  Download,
  Bell,
  Settings,
  UserCheck,
  Filter
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart,
  Pie,
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { DashboardWidgets } from "./dashboard-widgets"
import Link from "next/link"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  permissions: string[]
}

interface Partner {
  id: string
  company_name: string
  contact_person: string
  email: string
  status: string
  business_type: string
  created_at: string
  approved_at?: string
}

interface Order {
  id: any
  order_number: any
  partner_id: any
  status: any
  total_amount: any
  created_at: any
  partners: {
    company_name: any
    contact_person: any
  } | undefined
}

interface Quote {
  id: any
  quote_number: any
  partner_id: any
  status: any
  total_amount: any
  created_at: any
  partners: {
    company_name: any
    contact_person: any
  } | undefined
}

interface Microsite {
  id: any
  title: any
  partner_id: any
  is_published: any
  created_at: any
  partners: {
    company_name: any
    contact_person: any
  } | undefined
}

interface DashboardStats {
  totalPartners: number
  approvedPartners: number
  pendingPartners: number
  rejectedPartners: number
  newPartnersThisMonth: number
  totalOrders: number
  totalRevenue: number
  totalQuotes: number
  totalMicrosites: number
  activeMicrosites: number
}

interface MasterDashboardProps {
  adminUser: AdminUser
  stats: DashboardStats
  recentPartners: Partner[]
  recentOrders: Order[]
  recentQuotes: Quote[]
  recentMicrosites: Microsite[]
  recentActivity: any[]
}

export function MasterDashboard({ 
  adminUser, 
  stats, 
  recentPartners, 
  recentOrders, 
  recentQuotes, 
  recentMicrosites,
  recentActivity 
}: MasterDashboardProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Simulierte historische Daten für Charts (in Produktion aus Datenbank)
  const generateHistoricalData = () => {
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

  const historicalData = generateHistoricalData()

  // Performance-Metriken
  const performanceMetrics = [
    {
      title: "Partner-Zufriedenheit",
      value: 94,
      target: 95,
      trend: "up",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "System-Verfügbarkeit",
      value: 99.9,
      target: 99.5,
      trend: "up",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Response-Zeit",
      value: 1.2,
      target: 2.0,
      trend: "down",
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Konversionsrate",
      value: 23.5,
      target: 20.0,
      trend: "up",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ]

  // KPI-Karten mit erweiterten Metriken
  const kpiCards = [
    {
      title: "Gesamt Partner",
      value: stats.totalPartners,
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: historicalData.slice(-2).map(d => d.partners),
      href: "/admin/tenants"
    },
    {
      title: "Aktive Partner",
      value: stats.approvedPartners,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: [stats.approvedPartners - 5, stats.approvedPartners],
      href: "/admin/tenants?status=approved"
    },
    {
      title: "Gesamtumsatz",
      value: formatCurrency(stats.totalRevenue),
      change: "+15.3%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      trend: historicalData.slice(-2).map(d => d.revenue),
      href: "/admin/orders"
    },
    {
      title: "Ausstehende Anträge",
      value: stats.pendingPartners,
      change: "-5.1%",
      changeType: "negative" as const,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      trend: [stats.pendingPartners + 3, stats.pendingPartners],
      href: "/admin/tenants?status=pending"
    },
    {
      title: "Bestellungen",
      value: stats.totalOrders,
      change: "+22.7%",
      changeType: "positive" as const,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: historicalData.slice(-2).map(d => d.orders),
      href: "/admin/orders"
    },
    {
      title: "Aktive Microsites",
      value: stats.activeMicrosites,
      change: "+18.4%",
      changeType: "positive" as const,
      icon: Globe,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      trend: [stats.activeMicrosites - 2, stats.activeMicrosites],
      href: "/admin/microsites"
    }
  ]

  // Branchen-Verteilung für erweiterte Analytics
  const businessTypeDistribution = [
    { name: "Hochzeitsplaner", value: 45, color: "#3b82f6" },
    { name: "Veranstaltungsorte", value: 30, color: "#10b981" },
    { name: "Event-Manager", value: 20, color: "#f59e0b" },
    { name: "Sonstiges", value: 5, color: "#ef4444" }
  ]

  // Top-Performer
  const topPerformers = recentPartners
    .filter(p => p.status === "approved")
    .slice(0, 5)
    .map((partner, index) => ({
      ...partner,
      rank: index + 1,
      score: Math.floor(Math.random() * 20) + 80,
      growth: Math.floor(Math.random() * 30) + 10
    }))

  // Intelligente Benachrichtigungen
  const notifications = [
    {
      id: 1,
      type: "warning",
      title: "Hohe Anzahl ausstehender Anträge",
      message: `${stats.pendingPartners} Partner warten auf Genehmigung`,
      time: "2 Min",
      icon: AlertTriangle
    },
    {
      id: 2,
      type: "success",
      title: "Neue Registrierungen",
      message: `${stats.newPartnersThisMonth} neue Partner diesen Monat`,
      time: "1 Std",
      icon: CheckCircle
    },
    {
      id: 3,
      type: "info",
      title: "System-Update verfügbar",
      message: "Neue Features und Verbesserungen",
      time: "3 Std",
      icon: Bell
    }
  ]

         return (
           <div className="space-y-8">
             {/* Tabs für verschiedene Dashboard-Ansichten */}
             <Tabs defaultValue="overview" className="w-full">
               <TabsList className="grid w-full grid-cols-4 mb-12 glass-morphism">
                 <TabsTrigger value="overview" className="data-[state=active]:bg-gold-100 data-[state=active]:text-gold-700 touch-target">
                   Übersicht
                 </TabsTrigger>
                 <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-100 data-[state=active]:text-gold-700 touch-target">
                   Analytics
                 </TabsTrigger>
                 <TabsTrigger value="performance" className="data-[state=active]:bg-gold-100 data-[state=active]:text-gold-700 touch-target">
                   Performance
                 </TabsTrigger>
                 <TabsTrigger value="insights" className="data-[state=active]:bg-gold-100 data-[state=active]:text-gold-700 touch-target">
                   Insights
                 </TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="space-y-8">
                 {/* Header mit Personalisierung */}
                 <div className="bg-gradient-to-r from-charcoal-900 via-gold-900 to-charcoal-900 rounded-3xl p-12 text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-gold-600/20 to-sage-600/20" />
               <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display mb-2">
                Willkommen zurück, {adminUser.full_name.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-300 text-lg">
                Hier ist Ihr persönliches Admin-Dashboard für {new Date().toLocaleDateString("de-DE", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
                     <Button variant="outline" size="sm" className="glass-morphism border-white/20 text-white hover:bg-white/20 touch-target">
                       <Download className="w-4 h-4 mr-2" />
                       Bericht exportieren
                     </Button>
                     <Button variant="outline" size="sm" className="glass-morphism border-white/20 text-white hover:bg-white/20 touch-target">
                       <RefreshCw className="w-4 h-4 mr-2" />
                       Aktualisieren
                     </Button>
            </div>
          </div>
          
          {/* Schnellstatistiken im Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.totalPartners}</div>
              <div className="text-sm text-slate-300">Gesamt Partner</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-slate-300">Gesamtumsatz</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <div className="text-sm text-slate-300">Bestellungen</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{stats.activeMicrosites}</div>
              <div className="text-sm text-slate-300">Aktive Sites</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benachrichtigungen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
                 {/* Haupt-KPI-Karten */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                   {kpiCards.map((card) => {
                     const Icon = card.icon
                     return (
                       <Link key={card.title} href={card.href}>
                         <Card className="modern-card group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.bgColor}`}>
                          <Icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <div className="flex items-center gap-1">
                          {card.changeType === "positive" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            card.changeType === "positive" ? "text-green-600" : "text-red-600"
                          }`}>
                            {card.change}
                          </span>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-charcoal-900 mb-2">
                        {card.value}
                      </div>
                      <div className="text-sm text-sage-600 mb-3">
                        {card.title}
                      </div>
                      {/* Mini-Trend-Chart */}
                      <div className="h-8 flex items-end gap-1">
                        {card.trend.map((value, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-sage-200 to-sage-300 rounded-sm flex-1"
                            style={{ 
                              height: `${Math.max(20, (value / Math.max(...card.trend)) * 100)}%` 
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

                 {/* Charts-Sektion */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                   {/* Wachstums-Chart */}
                   <Card className="modern-card border-0">
                     <CardHeader className="flex flex-row items-center justify-between">
                       <CardTitle className="flex items-center gap-2">
                         <TrendingUp className="w-5 h-5 text-gold-600" />
                         Wachstumsverlauf
                       </CardTitle>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm" className="touch-target">
                             <Filter className="w-4 h-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent>
                           <DropdownMenuItem>7 Tage</DropdownMenuItem>
                           <DropdownMenuItem>30 Tage</DropdownMenuItem>
                           <DropdownMenuItem>90 Tage</DropdownMenuItem>
                           <DropdownMenuItem>1 Jahr</DropdownMenuItem>
                         </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="partners" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

                   {/* Branchen-Verteilung */}
                   <Card className="modern-card border-0">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <PieChart className="w-5 h-5 text-gold-600" />
                         Branchen-Verteilung
                       </CardTitle>
                     </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={businessTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {businessTypeDistribution.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

                 {/* Performance-Metriken */}
                 <Card className="modern-card border-0 mb-8">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Target className="w-5 h-5 text-gold-600" />
                       Performance-Metriken
                     </CardTitle>
                   </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         {performanceMetrics.map((metric) => {
                  const Icon = metric.icon
                  return (
                    <div key={metric.title} className="text-center">
                      <div className={`inline-flex p-3 rounded-xl ${metric.bgColor} mb-4`}>
                        <Icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <div className="text-2xl font-bold text-charcoal-900 mb-1">
                        {typeof metric.value === "number" && metric.value < 10 
                          ? `${metric.value}s` 
                          : `${metric.value}${typeof metric.value === "number" && metric.value > 10 && metric.value < 100 ? "%" : ""}`
                        }
                      </div>
                      <div className="text-sm text-sage-600 mb-2">{metric.title}</div>
                      <div className="space-y-2">
                        <Progress 
                          value={(metric.value / metric.target) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-sage-500">
                          Ziel: {metric.target}{typeof metric.target === "number" && metric.target > 10 ? "%" : "s"}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Aktivitäts-Feed und Top-Performer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Top-Performer */}
                   <Card className="modern-card border-0">
                     <CardHeader className="flex flex-row items-center justify-between">
                       <CardTitle className="flex items-center gap-2">
                         <Award className="w-5 h-5 text-gold-600" />
                         Top-Performer
                       </CardTitle>
                       <Badge className="glass-morphism text-gold-700 border-gold-200">
                         Diese Woche
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
                          <span className="font-bold text-charcoal-900">{partner.score}</span>
                        </div>
                        <div className="text-xs text-green-600">
                          +{partner.growth}% Wachstum
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

                   {/* Letzte Aktivitäten */}
                   <Card className="modern-card border-0">
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <Activity className="w-5 h-5 text-gold-600" />
                         Letzte Aktivitäten
                       </CardTitle>
                     </CardHeader>
              <CardContent>
                <div className="space-y-4">
                         {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-charcoal-900">
                          <span className="font-medium">{activity.admin_users?.full_name || "System"}</span> {activity.action}
                        </p>
                        <p className="text-xs text-sage-600">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seitenleiste mit Benachrichtigungen und Quick Actions */}
        <div className="space-y-6">
                 {/* Benachrichtigungen */}
                 <Card className="modern-card border-0">
                   <CardHeader className="flex flex-row items-center justify-between">
                     <CardTitle className="flex items-center gap-2">
                       <Bell className="w-5 h-5 text-gold-600" />
                       Benachrichtigungen
                     </CardTitle>
                     <Badge className="glass-morphism text-gold-700 border-gold-200">
                       {notifications.length}
                     </Badge>
                   </CardHeader>
            <CardContent>
              <div className="space-y-3">
                         {notifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-sage-50">
                      <div className={`p-2 rounded-lg ${
                        notification.type === "warning" ? "bg-orange-100" :
                        notification.type === "success" ? "bg-green-100" : "bg-blue-100"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          notification.type === "warning" ? "text-orange-600" :
                          notification.type === "success" ? "text-green-600" : "text-blue-600"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-charcoal-900">{notification.title}</p>
                        <p className="text-xs text-sage-600">{notification.message}</p>
                        <p className="text-xs text-sage-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

                 {/* Quick Actions */}
                 <Card className="modern-card border-0">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Zap className="w-5 h-5 text-gold-600" />
                       Schnellaktionen
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <div className="space-y-3">
                       <Button asChild className="w-full justify-start btn-modern">
                         <Link href="/admin/tenants">
                           <Users className="w-4 h-4 mr-2" />
                           Partner verwalten
                         </Link>
                       </Button>
                       <Button asChild variant="outline" className="w-full justify-start glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50 touch-target">
                         <Link href="/admin/analytics">
                           <BarChart3 className="w-4 h-4 mr-2" />
                           Analytics anzeigen
                         </Link>
                       </Button>
                       <Button asChild variant="outline" className="w-full justify-start glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50 touch-target">
                         <Link href="/admin/orders">
                           <Package className="w-4 h-4 mr-2" />
                           Bestellungen
                         </Link>
                       </Button>
                       <Button asChild variant="outline" className="w-full justify-start glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50 touch-target">
                         <Link href="/admin/settings">
                           <Settings className="w-4 h-4 mr-2" />
                           Einstellungen
                         </Link>
                       </Button>
                     </div>
                   </CardContent>
                 </Card>

                 {/* System-Status */}
                 <Card className="modern-card border-0">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Shield className="w-5 h-5 text-gold-600" />
                       System-Status
                     </CardTitle>
                   </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-700">Datenbank</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-700">API</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-600">Optimal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-700">Performance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-600">Schnell</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-700">Sicherheit</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-600">Aktiv</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <DashboardWidgets 
            stats={stats}
            partners={recentPartners}
            orders={recentOrders}
            quotes={recentQuotes}
            microsites={recentMicrosites}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-8">
          {/* Performance-Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System-Metriken */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  System-Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                         {performanceMetrics.map((metric) => {
                    const Icon = metric.icon
                    return (
                      <div key={metric.title} className="flex items-center justify-between p-3 rounded-lg bg-sage-50">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                            <Icon className={`w-4 h-4 ${metric.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-charcoal-900">{metric.title}</p>
                            <p className="text-sm text-sage-600">Ziel: {metric.target}{typeof metric.target === "number" && metric.target > 10 ? "%" : "s"}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-charcoal-900">
                            {typeof metric.value === "number" && metric.value < 10 
                              ? `${metric.value}s` 
                              : `${metric.value}${typeof metric.value === "number" && metric.value > 10 && metric.value < 100 ? "%" : ""}`
                            }
                          </p>
                          <div className="w-20">
                            <Progress 
                              value={(metric.value / metric.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance-Trends */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Performance-Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="partners" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-8">
          {/* Intelligente Insights und Empfehlungen */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Handlungsempfehlungen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-1">Partner-Onboarding optimieren</h4>
                    <p className="text-sm text-blue-700">Automatisieren Sie den Genehmigungsprozess für häufig vorkommende Partner-Typen.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="font-medium text-green-900 mb-1">Umsatz-Steigerung</h4>
                    <p className="text-sm text-green-700">Top-Performer haben 40% höhere Konversionsraten. Analysieren Sie deren Strategien.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-1">Microsite-Engagement</h4>
                    <p className="text-sm text-purple-700">Partner mit aktiven Microsites generieren 60% mehr Bestellungen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Wachstums-Opportunitäten
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50">
                    <div>
                      <p className="font-medium text-charcoal-900">Hochzeitsplaner</p>
                      <p className="text-sm text-sage-600">Größte Partner-Gruppe</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">+15% Wachstum</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50">
                    <div>
                      <p className="font-medium text-charcoal-900">Event-Manager</p>
                      <p className="text-sm text-sage-600">Hohe Konversionsrate</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">25% Konversion</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-sage-50">
                    <div>
                      <p className="font-medium text-charcoal-900">Veranstaltungsorte</p>
                      <p className="text-sm text-sage-600">Steigende Nachfrage</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">+8% Anstieg</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Risiko-Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <h4 className="font-medium text-red-900 mb-1">Ausstehende Anträge</h4>
                    <p className="text-sm text-red-700">{stats.pendingPartners} Partner warten länger als 48h auf Genehmigung.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <h4 className="font-medium text-orange-900 mb-1">Niedrige Aktivität</h4>
                    <p className="text-sm text-orange-700">5 Partner haben in 30 Tagen keine Aktivität gezeigt.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-1">System-Überwachung</h4>
                    <p className="text-sm text-yellow-700">Alle Systeme funktionieren optimal. Nächste Wartung geplant.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
