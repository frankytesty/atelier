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
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Mail, 
  Building,
  Calendar,
  TrendingUp,
  Package,
  FileText
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface Partner {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  status: string
  business_type: string
  created_at: string
  approved_at?: string
  orders: { count: number }[]
  quotes: { count: number }[]
  collections: { count: number }[]
}

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface AdminPartnersManagementProps {
  partners: Partner[]
  stats: {
    total: number
    approved: number
    pending: number
    rejected: number
  }
  adminUser: AdminUser
}

export function AdminPartnersManagement({ partners, stats }: AdminPartnersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  const filteredAndSortedPartners = useMemo(() => {
    let filtered = partners

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(partner => partner.status === statusFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Partner]
      let bValue: any = b[sortBy as keyof Partner]

      if (sortBy === "created_at" || sortBy === "approved_at") {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [partners, searchTerm, statusFilter, sortBy, sortOrder])

  const handleStatusChange = async (partnerId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/partners`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partner_id: partnerId,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Status")
      }

      toast({
        title: "Status aktualisiert",
        description: `Partner-Status wurde auf ${newStatus} gesetzt.`,
      })

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Genehmigt</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700">Ausstehend</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Abgelehnt</Badge>
      default:
        return <Badge variant="outline">Unbekannt</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getBusinessTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      "photographer": "Fotograf",
      "videographer": "Videograf",
      "wedding_planner": "Hochzeitsplaner",
      "florist": "Florist",
      "caterer": "Caterer",
      "other": "Sonstiges"
    }
    return types[type] || type
  }

  return (
    <div className="space-y-6">
      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Gesamt Partner</p>
                <p className="text-2xl font-display text-charcoal-900">{stats.total}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Genehmigt</p>
                <p className="text-2xl font-display text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Ausstehend</p>
                <p className="text-2xl font-display text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sage-600">Abgelehnt</p>
                <p className="text-2xl font-display text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
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
                  placeholder="Partner suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="approved">Genehmigt</SelectItem>
                  <SelectItem value="pending">Ausstehend</SelectItem>
                  <SelectItem value="rejected">Abgelehnt</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sortieren" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Erstellt</SelectItem>
                  <SelectItem value="company_name">Firmenname</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <TrendingUp className={`w-4 h-4 ${sortOrder === "desc" ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner-Tabelle */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900">
            Partner ({filteredAndSortedPartners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firma</TableHead>
                  <TableHead>Kontakt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Branche</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead>Statistiken</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-charcoal-900">{partner.company_name}</p>
                        <p className="text-sm text-sage-600">{partner.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-charcoal-900">{partner.contact_person}</p>
                        {partner.phone && (
                          <p className="text-sm text-sage-600">{partner.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(partner.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-sage-600">
                        {getBusinessTypeLabel(partner.business_type)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-sage-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(partner.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center text-sage-600">
                          <Package className="w-4 h-4 mr-1" />
                          {partner.orders[0]?.count || 0}
                        </div>
                        <div className="flex items-center text-sage-600">
                          <FileText className="w-4 h-4 mr-1" />
                          {partner.quotes[0]?.count || 0}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Details anzeigen
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            E-Mail senden
                          </DropdownMenuItem>
                          {partner.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusChange(partner.id, "approved")}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Genehmigen
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(partner.id, "rejected")}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Ablehnen
                              </DropdownMenuItem>
                            </>
                          )}
                          {partner.status === "approved" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(partner.id, "rejected")}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Deaktivieren
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
