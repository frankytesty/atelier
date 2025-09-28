"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, FileText, Palette, Settings, ExternalLink, Sparkles, Users } from "lucide-react"
import Link from "next/link"

interface Partner {
  id: string
  company_name: string
  status: string
  business_type: string
}

interface QuickActionsProps {
  partner: Partner
}

export function QuickActions({ partner }: QuickActionsProps) {
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

  return (
    <div className="space-y-6">
      {/* Partner Status */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-lg text-charcoal-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-sage-600" />
            Partner Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-sage-600 mb-1">Unternehmen</p>
            <p className="font-medium text-charcoal-900">{partner.company_name}</p>
          </div>
          <div>
            <p className="text-sm text-sage-600 mb-1">Typ</p>
            <p className="font-medium text-charcoal-900">{getBusinessTypeLabel(partner.business_type)}</p>
          </div>
          <div>
            <p className="text-sm text-sage-600 mb-1">Status</p>
            {getStatusBadge(partner.status)}
          </div>
          {partner.status === "pending" && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                Ihr Account wird noch geprüft. Sie erhalten eine E-Mail, sobald er genehmigt wurde.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schnellaktionen */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-lg text-charcoal-900 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-gold-600" />
            Schnellaktionen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full bg-gold-600 hover:bg-gold-700 justify-start">
            <Link href="/partner/collections/new">
              <Plus className="w-4 h-4 mr-2" />
              Neue Kollektion erstellen
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full justify-start border-sage-200 bg-transparent">
            <Link href="/partner/catalog">
              <Package className="w-4 h-4 mr-2" />
              Produktkatalog durchsuchen
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full justify-start border-sage-200 bg-transparent">
            <Link href="/partner/quotes/new">
              <FileText className="w-4 h-4 mr-2" />
              Neues Angebot erstellen
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full justify-start border-sage-200 bg-transparent">
            <Link href="/partner/brand-kit">
              <Palette className="w-4 h-4 mr-2" />
              Brand Kit anpassen
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Nützliche Links */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-lg text-charcoal-900">Nützliche Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="ghost" className="w-full justify-start text-sage-600 hover:text-charcoal-900">
            <Link href="/partner/collections">
              <Package className="w-4 h-4 mr-2" />
              Meine Kollektionen
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full justify-start text-sage-600 hover:text-charcoal-900">
            <Link href="/partner/orders">
              <FileText className="w-4 h-4 mr-2" />
              Bestellungen verwalten
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full justify-start text-sage-600 hover:text-charcoal-900">
            <Link href="/partner/microsites">
              <ExternalLink className="w-4 h-4 mr-2" />
              Meine Microsites
            </Link>
          </Button>

          <Button asChild variant="ghost" className="w-full justify-start text-sage-600 hover:text-charcoal-900">
            <Link href="/partner/settings">
              <Settings className="w-4 h-4 mr-2" />
              Einstellungen
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Hilfe & Support */}
      <Card className="border-sage-200 bg-gradient-to-br from-sage-50 to-ivory-50">
        <CardContent className="p-6">
          <h3 className="font-display text-lg text-charcoal-900 mb-2">Benötigen Sie Hilfe?</h3>
          <p className="text-sm text-sage-600 mb-4">Unser Support-Team steht Ihnen gerne zur Verfügung.</p>
          <Button variant="outline" size="sm" className="w-full border-sage-200 bg-transparent">
            Support kontaktieren
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
