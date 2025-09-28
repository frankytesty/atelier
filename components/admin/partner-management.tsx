"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Users, Search, Filter, Eye, Check, X, Mail, Phone, Globe, Calendar, Building, User } from "lucide-react"

interface Partner {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone?: string
  website?: string
  business_type: string
  status: string
  years_experience?: number
  average_events_per_year?: number
  specialties?: string[]
  created_at: string
  approved_at?: string
}

interface AdminUser {
  id: string
  role: string
  permissions: string[]
}

interface PartnerManagementProps {
  partners: Partner[]
  adminUser: AdminUser
}

export function PartnerManagement({ partners: initialPartners }: PartnerManagementProps) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>(initialPartners)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterPartners(term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterPartners(searchTerm, status)
  }

  const filterPartners = (search: string, status: string) => {
    let filtered = partners

    if (search) {
      filtered = filtered.filter(
        (partner) =>
          partner.company_name.toLowerCase().includes(search.toLowerCase()) ||
          partner.contact_person.toLowerCase().includes(search.toLowerCase()) ||
          partner.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((partner) => partner.status === status)
    }

    setFilteredPartners(filtered)
  }

  const handleStatusChange = async (partnerId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      const updateData: any = { status: newStatus }
      if (newStatus === "approved") {
        updateData.approved_at = new Date().toISOString()
      }

      const { error } = await supabase.from("partners").update(updateData).eq("id", partnerId)

      if (error) throw error

      // Aktualisiere lokalen State
      const updatedPartners = partners.map((partner) =>
        partner.id === partnerId ? { ...partner, ...updateData } : partner,
      )
      setPartners(updatedPartners)
      filterPartners(searchTerm, statusFilter)

      // Erstelle Audit-Log
      await supabase.rpc("create_audit_log", {
        p_action: `Partner ${newStatus}`,
        p_resource_type: "partner",
        p_resource_id: partnerId,
        p_new_values: { status: newStatus },
      })
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Partner-Status:", error)
    } finally {
      setIsLoading(false)
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

  const getBusinessTypeLabel = (type: string) => {
    const types = {
      wedding_planner: "Hochzeitsplaner",
      venue: "Veranstaltungsort",
      event_manager: "Event Manager",
      other: "Sonstiges",
    }
    return types[type as keyof typeof types] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const statusCounts = {
    all: partners.length,
    pending: partners.filter((p) => p.status === "pending").length,
    approved: partners.filter((p) => p.status === "approved").length,
    rejected: partners.filter((p) => p.status === "rejected").length,
  }

  return (
    <div className="space-y-6">
      {/* Filter und Suche */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Partner-Übersicht
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
              <Input
                placeholder="Partner suchen..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-sage-200 focus:border-gold-400"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-48 border-sage-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle ({statusCounts.all})</SelectItem>
                <SelectItem value="pending">Ausstehend ({statusCounts.pending})</SelectItem>
                <SelectItem value="approved">Genehmigt ({statusCounts.approved})</SelectItem>
                <SelectItem value="rejected">Abgelehnt ({statusCounts.rejected})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Partner-Tabs */}
      <Tabs value={statusFilter} onValueChange={handleStatusFilter}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Alle ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Ausstehend ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Genehmigt ({statusCounts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Abgelehnt ({statusCounts.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          {filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="border-sage-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-sage-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-display text-lg text-charcoal-900">{partner.company_name}</h3>
                            {getStatusBadge(partner.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-sage-500" />
                                <span className="text-charcoal-900">{partner.contact_person}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-sage-500" />
                                <span className="text-sage-600">{partner.email}</span>
                              </div>
                              {partner.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-sage-500" />
                                  <span className="text-sage-600">{partner.phone}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sage-600">
                                <span className="font-medium">Typ:</span> {getBusinessTypeLabel(partner.business_type)}
                              </p>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-sage-500" />
                                <span className="text-sage-600">Registriert: {formatDate(partner.created_at)}</span>
                              </div>
                              {partner.website && (
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-sage-500" />
                                  <a
                                    href={partner.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    Website
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPartner(partner)}
                          className="border-sage-200 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        {partner.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(partner.id, "approved")}
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Genehmigen
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(partner.id, "rejected")}
                              disabled={isLoading}
                              className="text-red-600 hover:bg-red-50 border-red-200"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Ablehnen
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-sage-200">
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-sage-400 mx-auto mb-4" />
                <h3 className="font-display text-lg text-charcoal-900 mb-2">Keine Partner gefunden</h3>
                <p className="text-sage-600">
                  {searchTerm
                    ? "Keine Partner entsprechen den Suchkriterien."
                    : "Keine Partner mit diesem Status vorhanden."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Partner-Details Dialog */}
      <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-charcoal-900">Partner-Details</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sage-100 rounded-lg flex items-center justify-center">
                  <Building className="w-8 h-8 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-charcoal-900">{selectedPartner.company_name}</h3>
                  <p className="text-sage-600">{selectedPartner.contact_person}</p>
                  {getStatusBadge(selectedPartner.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-charcoal-900">Kontaktinformationen</h4>
                  <div className="space-y-2 text-sm">
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
                        <a
                          href={selectedPartner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedPartner.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-charcoal-900">Geschäftsinformationen</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Typ:</span> {getBusinessTypeLabel(selectedPartner.business_type)}
                    </p>
                    {selectedPartner.years_experience && (
                      <p>
                        <span className="font-medium">Erfahrung:</span> {selectedPartner.years_experience} Jahre
                      </p>
                    )}
                    {selectedPartner.average_events_per_year && (
                      <p>
                        <span className="font-medium">Events/Jahr:</span> {selectedPartner.average_events_per_year}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedPartner.specialties && selectedPartner.specialties.length > 0 && (
                <div>
                  <h4 className="font-medium text-charcoal-900 mb-2">Spezialisierungen</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-sage-200">
                <div className="text-sm text-sage-600">
                  <p>Registriert: {formatDate(selectedPartner.created_at)}</p>
                  {selectedPartner.approved_at && <p>Genehmigt: {formatDate(selectedPartner.approved_at)}</p>}
                </div>
                {selectedPartner.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        handleStatusChange(selectedPartner.id, "approved")
                        setSelectedPartner(null)
                      }}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Genehmigen
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleStatusChange(selectedPartner.id, "rejected")
                        setSelectedPartner(null)
                      }}
                      disabled={isLoading}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Ablehnen
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
