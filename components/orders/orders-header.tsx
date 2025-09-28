"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download } from "lucide-react"
import Link from "next/link"

export function OrdersHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Bestellungen</h1>
          <p className="text-sage-600">Verwalten Sie alle Ihre Kundenbestellungen</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-sage-200 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Exportieren
          </Button>
          <Button asChild className="bg-gold-600 hover:bg-gold-700">
            <Link href="/partner/orders/new">
              <Plus className="w-4 h-4 mr-2" />
              Neue Bestellung
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter und Suche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
          <Input placeholder="Bestellungen durchsuchen..." className="pl-9 border-sage-200 focus:border-gold-400" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-48 border-sage-200">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="draft">Entwurf</SelectItem>
            <SelectItem value="pending">Ausstehend</SelectItem>
            <SelectItem value="confirmed">Bestätigt</SelectItem>
            <SelectItem value="in_production">In Produktion</SelectItem>
            <SelectItem value="shipped">Versendet</SelectItem>
            <SelectItem value="delivered">Geliefert</SelectItem>
            <SelectItem value="cancelled">Storniert</SelectItem>
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
          </SelectContent>
        </Select>
      </div>

      {/* Status Übersicht */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { status: "all", label: "Alle", count: 24, color: "bg-sage-100 text-sage-700" },
          { status: "draft", label: "Entwurf", count: 3, color: "bg-gray-100 text-gray-700" },
          { status: "pending", label: "Ausstehend", count: 5, color: "bg-orange-100 text-orange-700" },
          { status: "confirmed", label: "Bestätigt", count: 4, color: "bg-blue-100 text-blue-700" },
          { status: "in_production", label: "Produktion", count: 6, color: "bg-purple-100 text-purple-700" },
          { status: "shipped", label: "Versendet", count: 3, color: "bg-green-100 text-green-700" },
          { status: "delivered", label: "Geliefert", count: 3, color: "bg-green-100 text-green-800" },
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
