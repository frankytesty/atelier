"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Download,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  TrendingUp
} from "lucide-react"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuditLog {
  id: string
  admin_id: string
  action: string
  resource_type: string
  resource_id: string
  details: any
  ip_address: string
  user_agent: string
  created_at: string
  admin_users: {
    full_name: string
    email: string
    role: string
  }
}

interface AdminAuditLogsProps {
  auditLogs: AuditLog[]
  stats: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
  }
  adminUser: AdminUser
}

export function AdminAuditLogs({ auditLogs, stats }: AdminAuditLogsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [resourceFilter, setResourceFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredLogs = useMemo(() => {
    let filtered = auditLogs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin_users.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin_users.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by action
    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    // Filter by resource type
    if (resourceFilter !== "all") {
      filtered = filtered.filter(log => log.resource_type === resourceFilter)
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date()
      const logDate = new Date()
      
      switch (dateFilter) {
        case "today":
          logDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter(log => new Date(log.created_at) >= logDate)
          break
        case "week":
          logDate.setDate(now.getDate() - 7)
          filtered = filtered.filter(log => new Date(log.created_at) >= logDate)
          break
        case "month":
          logDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter(log => new Date(log.created_at) >= logDate)
          break
      }
    }

    return filtered
  }, [auditLogs, searchTerm, actionFilter, resourceFilter, dateFilter])

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
      case "created":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "update":
      case "updated":
        return <Activity className="w-4 h-4 text-blue-600" />
      case "delete":
      case "deleted":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "login":
      case "logout":
        return <User className="w-4 h-4 text-purple-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
      case "created":
        return <Badge className="bg-green-100 text-green-700">Erstellt</Badge>
      case "update":
      case "updated":
        return <Badge className="bg-blue-100 text-blue-700">Aktualisiert</Badge>
      case "delete":
      case "deleted":
        return <Badge className="bg-red-100 text-red-700">Gelöscht</Badge>
      case "login":
        return <Badge className="bg-purple-100 text-purple-700">Anmeldung</Badge>
      case "logout":
        return <Badge className="bg-gray-100 text-gray-700">Abmeldung</Badge>
      default:
        return <Badge variant="outline">{action}</Badge>
    }
  }

  const getResourceTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "partner": "Partner",
      "order": "Bestellung",
      "quote": "Angebot",
      "product": "Produkt",
      "collection": "Kollektion",
      "admin_user": "Admin-Benutzer",
      "system": "System"
    }
    return types[type] || type
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

  const formatRelativeTime = (dateString: string) => {
    const now = new Date()
    const logDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Gerade eben"
    if (diffInMinutes < 60) return `Vor ${diffInMinutes} Min`
    if (diffInMinutes < 1440) return `Vor ${Math.floor(diffInMinutes / 60)} Std`
    return `Vor ${Math.floor(diffInMinutes / 1440)} Tagen`
  }

  return (
    <div className="space-y-6">
      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Gesamt Logs</p>
                <p className="text-2xl font-display text-charcoal-900">{stats.total.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Heute</p>
                <p className="text-2xl font-display text-charcoal-900">{stats.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Diese Woche</p>
                <p className="text-2xl font-display text-charcoal-900">{stats.thisWeek}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Dieser Monat</p>
                <p className="text-2xl font-display text-charcoal-900">{stats.thisMonth}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter und Suche */}
      <Card className="border-sage-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
                <Input
                  placeholder="Logs durchsuchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Aktion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Aktionen</SelectItem>
                  <SelectItem value="create">Erstellt</SelectItem>
                  <SelectItem value="update">Aktualisiert</SelectItem>
                  <SelectItem value="delete">Gelöscht</SelectItem>
                  <SelectItem value="login">Anmeldung</SelectItem>
                  <SelectItem value="logout">Abmeldung</SelectItem>
                </SelectContent>
              </Select>

              <Select value={resourceFilter} onValueChange={setResourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ressource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Ressourcen</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="order">Bestellung</SelectItem>
                  <SelectItem value="quote">Angebot</SelectItem>
                  <SelectItem value="product">Produkt</SelectItem>
                  <SelectItem value="admin_user">Admin-Benutzer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Zeitraum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Zeiten</SelectItem>
                  <SelectItem value="today">Heute</SelectItem>
                  <SelectItem value="week">Diese Woche</SelectItem>
                  <SelectItem value="month">Dieser Monat</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-sage-200">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit-Logs Tabelle */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900">
            Aktivitäts-Logs ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zeit</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Aktion</TableHead>
                  <TableHead>Ressource</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP-Adresse</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-charcoal-900">{formatDate(log.created_at)}</p>
                        <p className="text-xs text-sage-600">{formatRelativeTime(log.created_at)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-charcoal-900">{log.admin_users.full_name}</p>
                        <p className="text-sm text-sage-600">{log.admin_users.email}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {log.admin_users.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(log.action)}
                        {getActionBadge(log.action)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-charcoal-900">{getResourceTypeLabel(log.resource_type)}</p>
                        <p className="text-sm text-sage-600">ID: {log.resource_id.slice(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-charcoal-900 truncate">
                          {log.details ? JSON.stringify(log.details).slice(0, 50) + "..." : "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-sage-600 font-mono">{log.ip_address}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
