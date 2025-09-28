"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExternalLink, Eye, Edit, Copy, MoreVertical, Globe, Lock, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Microsite {
  id: string
  subdomain: string
  custom_domain?: string
  title: string
  description?: string
  is_published: boolean
  is_password_protected: boolean
  created_at: string
  collection?: { name: string }
  brand_kit?: { name: string; primary_color: string }
  visit_count?: { count: number }[]
}

interface MicrositesListProps {
  microsites: Microsite[]
}

export function MicrositesList({ microsites }: MicrositesListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getMicrositeUrl = (microsite: Microsite) => {
    return microsite.custom_domain
      ? `https://${microsite.custom_domain}`
      : `https://${microsite.subdomain}.atelier-luminform.com`
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getVisitCount = (microsite: Microsite) => {
    return microsite.visit_count?.[0]?.count || 0
  }

  if (microsites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
          <Globe className="w-8 h-8 text-sage-400" />
        </div>
        <h3 className="font-display text-2xl text-charcoal-900 mb-4">Noch keine Microsites</h3>
        <p className="text-sage-600 mb-6 max-w-md mx-auto">
          Erstellen Sie Ihre erste personalisierte Website für Kunden und teilen Sie Ihre Kollektionen elegant.
        </p>
        <Button asChild className="bg-gold-600 hover:bg-gold-700">
          <Link href="/partner/microsites/new">
            <Plus className="w-4 h-4 mr-2" />
            Erste Microsite erstellen
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {microsites.map((microsite) => (
        <Card key={microsite.id} className="border-sage-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="font-display text-lg text-charcoal-900 mb-1 line-clamp-1">
                  {microsite.title}
                </CardTitle>
                <p className="text-sm text-sage-600 line-clamp-2">{microsite.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/partner/microsites/${microsite.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Bearbeiten
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={getMicrositeUrl(microsite)} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Öffnen
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => copyToClipboard(getMicrositeUrl(microsite), microsite.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedId === microsite.id ? "Kopiert!" : "Link kopieren"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* URL */}
            <div className="p-3 bg-sage-50 rounded-lg">
              <p className="text-xs text-sage-600 mb-1">URL</p>
              <p className="text-sm font-mono text-charcoal-900 truncate">
                {microsite.custom_domain || `${microsite.subdomain}.atelier-luminform.com`}
              </p>
            </div>

            {/* Status und Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={microsite.is_published ? "default" : "outline"} className="text-xs">
                {microsite.is_published ? (
                  <>
                    <Globe className="w-3 h-3 mr-1" />
                    Veröffentlicht
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Entwurf
                  </>
                )}
              </Badge>

              {microsite.is_password_protected && (
                <Badge variant="outline" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Passwort
                </Badge>
              )}

              {microsite.collection && (
                <Badge variant="outline" className="text-xs text-sage-600">
                  {microsite.collection.name}
                </Badge>
              )}
            </div>

            {/* Statistiken */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-sage-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {getVisitCount(microsite)} Besuche
              </div>
              <span className="text-sage-500">Erstellt {formatDate(microsite.created_at)}</span>
            </div>

            {/* Brand Kit Indikator */}
            {microsite.brand_kit && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border border-sage-200"
                  style={{ backgroundColor: microsite.brand_kit.primary_color }}
                />
                <span className="text-xs text-sage-600">{microsite.brand_kit.name}</span>
              </div>
            )}

            {/* Aktionen */}
            <div className="flex gap-2 pt-2">
              <Button asChild size="sm" className="flex-1 bg-gold-600 hover:bg-gold-700">
                <Link href={`/partner/microsites/${microsite.id}/edit`}>
                  <Edit className="w-3 h-3 mr-1" />
                  Bearbeiten
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                <a href={getMicrositeUrl(microsite)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ansehen
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
