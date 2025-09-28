"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download } from "lucide-react"
import Link from "next/link"

export function QuotesHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Angebote</h1>
          <p className="text-sage-600">Erstellen und verwalten Sie Ihre Kundenangebote</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-sage-200 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Exportieren
          </Button>
          <Button asChild className="bg-gold-600 hover:bg-gold-700">
            <Link href="/partner/quotes/new">
              <Plus className="w-4 h-4 mr-2" />
              Neues Angebot
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter und Suche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
          <Input placeholder="Angebote durchsuchen..." className="pl-9 border-sage-200 focus:border-gold-400" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48 border-sage-200">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="draft">Entwurf</SelectItem>
            <SelectItem value="sent">Gesendet</SelectItem>
            <SelectItem value="viewed">Angesehen</SelectItem>
            <SelectItem value="accepted">Angenommen</SelectItem>
            <SelectItem value="rejected">Abgelehnt</SelectItem>
            <SelectItem value="expired">Abgelaufen</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="newest">
          <SelectTrigger className="w-full sm:w-48 border-sage-200">
            <SelectValue placeholder="Sortieren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Neueste zuerst</SelectItem>
            <SelectItem value="oldest">Älteste zuerst</SelectItem>
            <SelectItem value="amount_high">Höchster Betrag</SelectItem>
            <SelectItem value="amount_low">Niedrigster Betrag</SelectItem>
            <SelectItem value="expiring">Läuft bald ab</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Übersicht */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { status: "all", label: "Alle", count: 18, color: "bg-sage-100 text-sage-700" },
          { status: "draft", label: "Entwurf", count: 4, color: "bg-gray-100 text-gray-700" },
          { status: "sent", label: "Gesendet", count: 6, color: "bg-blue-100 text-blue-700" },
          { status: "viewed", label: "Angesehen", count: 3, color: "bg-purple-100 text-purple-700" },
          { status: "accepted", label: "Angenommen", count: 2, color: "bg-green-100 text-green-700" },
          { status: "expired", label: "Abgelaufen", count: 3, color: "bg-red-100 text-red-700" },
        ].map((item) => (
          <div key={item.status} className="text-center">
            <Badge className={`${item.color} mb-1`}>{item.count}</Badge>
            <p className="text-xs text-sage-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
