"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  UserCheck, 
  Clock, 
  TrendingUp, 
  Activity, 
  Settings, 
  FileText, 
  AlertCircle,
  Building2,
  DollarSign,
  Package,
  Globe,
  BarChart3
} from "lucide-react"
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
  id: string
  order_number: string
  partner_id: string
  status: string
  total_amount: number
  created_at: string
  partners: {
    company_name: string
  }
}

interface Quote {
  id: string
  quote_number: string
  partner_id: string
  status: string
  total_amount: number
  created_at: string
  partners: {
    company_name: string
  }
}

interface Microsite {
  id: string
  title: string
  partner_id: string
  is_published: boolean
  created_at: string
  partners: {
    company_name: string
  }
}

interface EnhancedAdminDashboardProps {
  adminUser: AdminUser
  stats: {
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
  recentPartners: Partner[]
  recentOrders: Order[]
  recentQuotes: Quote[]
  recentMicrosites: Microsite[]
  recentActivity: any[]
}

export function EnhancedAdminDashboard({ 
  adminUser, 
  stats, 
  recentPartners, 
  recentOrders, 
  recentQuotes, 
  recentMicrosites,
  recentActivity 
}: EnhancedAdminDashboardProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-red-100 text-red-700">Super Admin</Badge>
      case "admin":
        return <Badge className="bg-blue-100 text-blue-700">Admin</Badge>
      case "moderator":
        return <Badge className="bg-green-100 text-green-700">Moderator</Badge>
      default:
        return <Badge variant="outline">Unbekannt</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "confirmed":
      case "published":
        return <Badge className="bg-green-100 text-green-700">Aktiv</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700">Ausstehend</Badge>
      case "rejected":
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Abgelehnt</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-700">Entwurf</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const metrics = [
    {
      title: "Gesamt Partner",
      value: stats.totalPartners,
      icon: Users,
      description: "Alle registrierten Partner",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      href: "/admin/tenants",
    },
    {
      title: "Aktive Partner",
      value: stats.approvedPartners,
      icon: UserCheck,
      description: "Genehmigte Partner",
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/tenants?status=approved",
    },
    {
      title: "Ausstehende Anträge",
      value: stats.pendingPartners,
      icon: Clock,
      description: "Warten auf Genehmigung",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      href: "/admin/tenants?status=pending",
    },
    {
      title: "Gesamtumsatz",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      description: "Alle Bestellungen",
      color: "text-green-600",
      bgColor: "bg-green-100",
      href: "/admin/orders",
    },
    {
      title: "Bestellungen",
      value: stats.totalOrders,
      icon: Package,
      description: "Alle Bestellungen",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/orders",
    },
    {
      title: "Angebote",
      value: stats.totalQuotes,
      icon: FileText,
      description: "Alle Angebote",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      href: "/admin/quotes",
    },
    {
      title: "Microsites",
      value: stats.totalMicrosites,
      icon: Globe,
      description: `${stats.activeMicrosites} aktiv`,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      href: "/admin/microsites",
    },
    {
      title: "Neue Partner (30d)",
      value: stats.newPartnersThisMonth,
      icon: TrendingUp,
      description: "Registrierungen",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      href: "/admin/tenants",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display mb-2">Willkommen zurück, {adminUser.full_name}!</h1>
            <p className="text-blue-100 mb-4">Hier ist eine Übersicht über Ihr System</p>
            <div className="flex items-center gap-2">
              {getRoleBadge(adminUser.role)}
              <span className="text-sm text-blue-200">Letzte Anmeldung: {formatDate(new Date().toISOString())}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.totalPartners}</div>
            <div className="text-blue-200">Aktive Partner</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Link key={metric.title} href={metric.href}>
              <Card className="border-sage-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-charcoal-700">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display text-charcoal-900 mb-1">
                    {metric.value}
                  </div>
                  <p className="text-xs text-sage-600">{metric.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Partners */}
        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Neue Partner
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="border-sage-200 bg-transparent">
              <Link href="/admin/tenants">Alle anzeigen</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPartners.length > 0 ? (
              <div className="space-y-4">
                {recentPartners.slice(0, 5).map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-sage-100 hover:bg-sage-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">{partner.company_name}</p>
                      <p className="text-sm text-sage-600">{partner.contact_person}</p>
                      <p className="text-xs text-sage-500">{formatDate(partner.created_at)}</p>
                    </div>
                    {getStatusBadge(partner.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">Keine neuen Partner</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-purple-600" />
              Letzte Bestellungen
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="border-sage-200 bg-transparent">
              <Link href="/admin/orders">Alle anzeigen</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-sage-100 hover:bg-sage-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">{order.order_number}</p>
                      <p className="text-sm text-sage-600">{order.partners?.company_name}</p>
                      <p className="text-xs text-sage-500">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-sm font-medium text-charcoal-900 mt-1">
                        {formatCurrency(order.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">Keine Bestellungen</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-600" />
              System-Aktivitäten
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-charcoal-900">
                        <span className="font-medium">{activity.admin_users?.full_name || "System"}</span> {activity.action}
                      </p>
                      <p className="text-xs text-sage-600">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">Keine Aktivitäten</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quotes */}
        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Neue Angebote
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="border-sage-200 bg-transparent">
              <Link href="/admin/quotes">Alle anzeigen</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentQuotes.length > 0 ? (
              <div className="space-y-4">
                {recentQuotes.slice(0, 5).map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-sage-100 hover:bg-sage-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">{quote.quote_number}</p>
                      <p className="text-sm text-sage-600">{quote.partners?.company_name}</p>
                      <p className="text-xs text-sage-500">{formatDate(quote.created_at)}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(quote.status)}
                      <p className="text-sm font-medium text-charcoal-900 mt-1">
                        {formatCurrency(quote.total_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">Keine Angebote</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Microsites */}
        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cyan-600" />
              Neue Microsites
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="border-sage-200 bg-transparent">
              <Link href="/admin/microsites">Alle anzeigen</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentMicrosites.length > 0 ? (
              <div className="space-y-4">
                {recentMicrosites.slice(0, 5).map((microsite) => (
                  <div
                    key={microsite.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-sage-100 hover:bg-sage-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">{microsite.title}</p>
                      <p className="text-sm text-sage-600">{microsite.partners?.company_name}</p>
                      <p className="text-xs text-sage-500">{formatDate(microsite.created_at)}</p>
                    </div>
                    {getStatusBadge(microsite.is_published ? "published" : "draft")}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">Keine Microsites</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900">Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 justify-start h-auto p-4">
              <Link href="/admin/tenants">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Mandanten verwalten</p>
                    <p className="text-xs opacity-90">Partner verwalten</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-sage-200 bg-transparent justify-start h-auto p-4">
              <Link href="/admin/analytics">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Analytics</p>
                    <p className="text-xs text-sage-600">Berichte anzeigen</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-sage-200 bg-transparent justify-start h-auto p-4">
              <Link href="/admin/settings">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Einstellungen</p>
                    <p className="text-xs text-sage-600">System konfigurieren</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-sage-200 bg-transparent justify-start h-auto p-4">
              <Link href="/admin/audit">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Audit-Logs</p>
                    <p className="text-xs text-sage-600">Aktivitätsverlauf</p>
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-green-600" />
            System-Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoal-900">Datenbank</p>
              <p className="text-xs text-sage-600">Online</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoal-900">API</p>
              <p className="text-xs text-sage-600">Funktionsfähig</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoal-900">Authentifizierung</p>
              <p className="text-xs text-sage-600">Aktiv</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2" />
              <p className="text-sm font-medium text-charcoal-900">Performance</p>
              <p className="text-xs text-sage-600">Optimal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
