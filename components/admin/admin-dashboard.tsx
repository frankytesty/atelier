"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Clock, TrendingUp, Activity, Shield, Settings, FileText, AlertCircle } from "lucide-react"
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
}

interface AdminDashboardProps {
  adminUser: AdminUser
  stats: {
    totalPartners: number
    approvedPartners: number
    pendingPartners: number
    rejectedPartners: number
    newPartnersThisMonth: number
  }
  pendingPartners: Partner[]
  recentActivity: any[]
}

export function AdminDashboard({ adminUser, stats, pendingPartners, recentActivity }: AdminDashboardProps) {
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

  const metrics = [
    {
      title: "Gesamt Partner",
      value: stats.totalPartners,
      icon: Users,
      description: "Alle registrierten Partner",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Genehmigte Partner",
      value: stats.approvedPartners,
      icon: UserCheck,
      description: "Aktive Partner",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ausstehende Anträge",
      value: stats.pendingPartners,
      icon: Clock,
      description: "Warten auf Genehmigung",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Neue Partner (30 Tage)",
      value: stats.newPartnersThisMonth,
      icon: TrendingUp,
      description: "Registrierungen",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Admin Info */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Admin-Informationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-charcoal-900">{adminUser.full_name}</p>
              <p className="text-sm text-sage-600">{adminUser.email}</p>
            </div>
            {getRoleBadge(adminUser.role)}
          </div>
          <div>
            <p className="text-sm text-sage-600 mb-2">Berechtigungen:</p>
            <div className="flex flex-wrap gap-2">
              {adminUser.permissions.map((permission) => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {permission.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metriken */}
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
                  {metric.value.toLocaleString("de-DE")}
                </div>
                <p className="text-xs text-sage-600">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ausstehende Partner-Anträge */}
        <Card className="border-sage-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Ausstehende Anträge
            </CardTitle>
            <Button asChild variant="outline" size="sm" className="border-sage-200 bg-transparent">
              <Link href="/admin/partners">Alle anzeigen</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingPartners.length > 0 ? (
              <div className="space-y-4">
                {pendingPartners.slice(0, 5).map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-sage-100 hover:bg-sage-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">{partner.company_name}</p>
                      <p className="text-sm text-sage-600">{partner.contact_person}</p>
                      <p className="text-xs text-sage-500">{formatDate(partner.created_at)}</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">Ausstehend</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">Keine ausstehenden Anträge</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Letzte Admin-Aktivitäten */}
        <Card className="border-sage-200">
          <CardHeader>
            <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Letzte Aktivitäten
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-charcoal-900">
                        <span className="font-medium">{activity.admin_users?.full_name}</span> {activity.action}
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

      {/* Schnellaktionen */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900">Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 justify-start h-auto p-4">
              <Link href="/admin/partners">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Partner verwalten</p>
                    <p className="text-xs opacity-90">Anträge genehmigen</p>
                  </div>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-sage-200 bg-transparent justify-start h-auto p-4">
              <Link href="/admin/settings">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Systemeinstellungen</p>
                    <p className="text-xs text-sage-600">Konfiguration</p>
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

      {/* System-Status */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-green-600" />
            System-Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
