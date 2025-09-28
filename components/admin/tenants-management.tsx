"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Building2, 
  Mail, 
  Phone, 
  Globe,
  Activity,
  DollarSign,
  Package,
  Star,
  MapPin
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Partner {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone?: string
  website?: string
  business_type: string
  status: string
  specialties?: string[]
  years_experience?: number
  average_events_per_year?: number
  typical_budget_range?: string
  created_at: string
  updated_at: string
  approved_at?: string
  business_address?: any
  instagram_handle?: string
}


interface TenantsManagementProps {
  partners: Partner[]
  onPartnerUpdate: (partnerId: string, updates: Partial<Partner>) => Promise<void>
  onPartnerDelete: (partnerId: string) => Promise<void>
}

export function TenantsManagement({ partners, onPartnerUpdate, onPartnerDelete }: TenantsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partial<Partner>>({})

  // Filter partners based on search and filters
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = 
      partner.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter
    const matchesBusinessType = businessTypeFilter === "all" || partner.business_type === businessTypeFilter
    
    return matchesSearch && matchesStatus && matchesBusinessType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Aktiv</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700">Ausstehend</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Abgelehnt</Badge>
      default:
        return <Badge variant="outline">Unbekannt</Badge>
    }
  }

  const getBusinessTypeLabel = (type: string) => {
    switch (type) {
      case "wedding_planner":
        return "Hochzeitsplaner"
      case "venue":
        return "Veranstaltungsort"
      case "event_manager":
        return "Event-Manager"
      case "other":
        return "Sonstiges"
      default:
        return type
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

  const handleStatusChange = async (partnerId: string, newStatus: string) => {
    try {
      const updates: Partial<Partner> = { status: newStatus }
      if (newStatus === "approved") {
        updates.approved_at = new Date().toISOString()
      }
      await onPartnerUpdate(partnerId, updates)
      toast.success("Status erfolgreich aktualisiert")
    } catch (error) {
      toast.error("Fehler beim Aktualisieren des Status")
    }
  }

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner)
    setIsEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingPartner.id) return
    
    try {
      await onPartnerUpdate(editingPartner.id, editingPartner)
      setIsEditOpen(false)
      setEditingPartner({})
      toast.success("Partner erfolgreich aktualisiert")
    } catch (error) {
      toast.error("Fehler beim Aktualisieren des Partners")
    }
  }

  const handleDeletePartner = async (partnerId: string) => {
    if (confirm("Sind Sie sicher, dass Sie diesen Partner löschen möchten?")) {
      try {
        await onPartnerDelete(partnerId)
        toast.success("Partner erfolgreich gelöscht")
      } catch (error) {
        toast.error("Fehler beim Löschen des Partners")
      }
    }
  }

  const openPartnerDetail = (partner: Partner) => {
    setSelectedPartner(partner)
    setIsDetailOpen(true)
  }

  // Statistics
  const stats = {
    total: partners.length,
    approved: partners.filter(p => p.status === "approved").length,
    pending: partners.filter(p => p.status === "pending").length,
    rejected: partners.filter(p => p.status === "rejected").length,
    newThisMonth: partners.filter(p => {
      const created = new Date(p.created_at)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return created >= monthAgo
    }).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Mandanten-Management</h1>
          <p className="text-sage-600">Verwalten Sie alle registrierten Partner und deren Status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="w-4 h-4 mr-2" />
            Neuer Partner
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sage-600">Gesamt Partner</p>
                <p className="text-2xl font-bold text-charcoal-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sage-600">Aktiv</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sage-600">Ausstehend</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sage-600">Abgelehnt</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sage-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sage-600">Neu (30 Tage)</p>
                <p className="text-2xl font-bold text-purple-600">{stats.newThisMonth}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="approved">Aktiv</SelectItem>
                <SelectItem value="pending">Ausstehend</SelectItem>
                <SelectItem value="rejected">Abgelehnt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Branche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Branchen</SelectItem>
                <SelectItem value="wedding_planner">Hochzeitsplaner</SelectItem>
                <SelectItem value="venue">Veranstaltungsort</SelectItem>
                <SelectItem value="event_manager">Event-Manager</SelectItem>
                <SelectItem value="other">Sonstiges</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Partners List */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Partner-Übersicht ({filteredPartners.length})</span>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Erweiterte Filter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-4 border border-sage-100 rounded-lg hover:bg-sage-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {partner.company_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-charcoal-900">{partner.company_name}</h3>
                    <p className="text-sm text-sage-600">{partner.contact_person}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getBusinessTypeLabel(partner.business_type)}
                      </Badge>
                      {getStatusBadge(partner.status)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm text-sage-600">{formatDate(partner.created_at)}</p>
                    <p className="text-xs text-sage-500">{partner.email}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openPartnerDetail(partner)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Details anzeigen
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditPartner(partner)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {partner.status !== "approved" && (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(partner.id, "approved")}
                          className="text-green-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Genehmigen
                        </DropdownMenuItem>
                      )}
                      {partner.status !== "rejected" && (
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(partner.id, "rejected")}
                          className="text-red-600"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Ablehnen
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeletePartner(partner.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Löschen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {filteredPartners.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">Keine Partner gefunden</p>
                <p className="text-sm text-sage-500">Versuchen Sie andere Suchkriterien</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partner Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Partner-Details
            </DialogTitle>
            <DialogDescription>
              Vollständige Informationen über den ausgewählten Partner
            </DialogDescription>
          </DialogHeader>
          
          {selectedPartner && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="business">Geschäftsdaten</TabsTrigger>
                <TabsTrigger value="activity">Aktivität</TabsTrigger>
                <TabsTrigger value="settings">Einstellungen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kontaktinformationen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-sage-500" />
                        <span className="font-medium">{selectedPartner.company_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sage-500" />
                        <span>{selectedPartner.email}</span>
                      </div>
                      {selectedPartner.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-sage-500" />
                          <span>{selectedPartner.phone}</span>
                        </div>
                      )}
                      {selectedPartner.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-sage-500" />
                          <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedPartner.website}
                          </a>
                        </div>
                      )}
                      {selectedPartner.instagram_handle && (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 text-sage-500">📷</span>
                          <span>@{selectedPartner.instagram_handle}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Status & Berechtigung</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        {getStatusBadge(selectedPartner.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Registriert:</span>
                        <span>{formatDate(selectedPartner.created_at)}</span>
                      </div>
                      {selectedPartner.approved_at && (
                        <div className="flex items-center justify-between">
                          <span>Genehmigt:</span>
                          <span>{formatDate(selectedPartner.approved_at)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Letzte Aktualisierung:</span>
                        <span>{formatDate(selectedPartner.updated_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="business" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Geschäftsinformationen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Branche:</span>
                        <Badge variant="outline">{getBusinessTypeLabel(selectedPartner.business_type)}</Badge>
                      </div>
                      {selectedPartner.years_experience && (
                        <div className="flex items-center justify-between">
                          <span>Erfahrung:</span>
                          <span>{selectedPartner.years_experience} Jahre</span>
                        </div>
                      )}
                      {selectedPartner.average_events_per_year && (
                        <div className="flex items-center justify-between">
                          <span>Events/Jahr:</span>
                          <span>{selectedPartner.average_events_per_year}</span>
                        </div>
                      )}
                      {selectedPartner.typical_budget_range && (
                        <div className="flex items-center justify-between">
                          <span>Budget-Range:</span>
                          <span>{selectedPartner.typical_budget_range}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Spezialisierungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedPartner.specialties && selectedPartner.specialties.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedPartner.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">{specialty}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sage-500">Keine Spezialisierungen angegeben</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {selectedPartner.business_address && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Geschäftsadresse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm text-sage-600 whitespace-pre-wrap">
                        {JSON.stringify(selectedPartner.business_address, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-sage-600">Bestellungen</p>
                          <p className="text-2xl font-bold text-charcoal-900">0</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-sage-600">Umsatz</p>
                          <p className="text-2xl font-bold text-green-600">€0</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-sage-600">Microsites</p>
                          <p className="text-2xl font-bold text-purple-600">0</p>
                        </div>
                        <Globe className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-sage-600">Kollektionen</p>
                          <p className="text-2xl font-bold text-orange-600">0</p>
                        </div>
                        <Star className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Letzte Aktivitäten
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                      <p className="text-sage-600">Keine Aktivitäten verfügbar</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Partner-Einstellungen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Status ändern</p>
                        <p className="text-sm text-sage-600">Aktueller Status: {selectedPartner.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={selectedPartner.status === "approved" ? "default" : "outline"}
                          onClick={() => handleStatusChange(selectedPartner.id, "approved")}
                        >
                          Genehmigen
                        </Button>
                        <Button 
                          size="sm" 
                          variant={selectedPartner.status === "rejected" ? "destructive" : "outline"}
                          onClick={() => handleStatusChange(selectedPartner.id, "rejected")}
                        >
                          Ablehnen
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => {
                          setIsDetailOpen(false)
                          handleDeletePartner(selectedPartner.id)
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Partner löschen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Partner Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Partner bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Informationen des Partners
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name">Firmenname</Label>
                <Input
                  id="company_name"
                  value={editingPartner.company_name || ""}
                  onChange={(e) => setEditingPartner({...editingPartner, company_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Kontaktperson</Label>
                <Input
                  id="contact_person"
                  value={editingPartner.contact_person || ""}
                  onChange={(e) => setEditingPartner({...editingPartner, contact_person: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingPartner.email || ""}
                  onChange={(e) => setEditingPartner({...editingPartner, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={editingPartner.phone || ""}
                  onChange={(e) => setEditingPartner({...editingPartner, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editingPartner.website || ""}
                onChange={(e) => setEditingPartner({...editingPartner, website: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_type">Branche</Label>
                <Select 
                  value={editingPartner.business_type || ""} 
                  onValueChange={(value) => setEditingPartner({...editingPartner, business_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Branche wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding_planner">Hochzeitsplaner</SelectItem>
                    <SelectItem value="venue">Veranstaltungsort</SelectItem>
                    <SelectItem value="event_manager">Event-Manager</SelectItem>
                    <SelectItem value="other">Sonstiges</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editingPartner.status || ""} 
                  onValueChange={(value) => setEditingPartner({...editingPartner, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Aktiv</SelectItem>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="rejected">Abgelehnt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveEdit}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
