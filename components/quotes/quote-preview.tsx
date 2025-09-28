"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import Image from "next/image"

interface QuotePreviewProps {
  quote: any // TODO: Proper typing
  partner: any // TODO: Proper typing
}

export function QuotePreview({ quote, partner }: QuotePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card className="border-sage-200">
      <CardHeader>
        <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-sage-600" />
          Kundenansicht
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Angebots-Vorschau im Kundenstil */}
        <div className="bg-white border border-sage-200 rounded-lg p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b border-sage-100 pb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AL</span>
            </div>
            <h1 className="font-display text-2xl text-charcoal-900 mb-2">Atelier Luminform</h1>
            <p className="text-sage-600">{partner?.company_name}</p>
          </div>

          {/* Angebotsinformationen */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl text-charcoal-900">Angebot</h2>
              <Badge className="bg-gold-100 text-gold-700">{quote.quote_number}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-sage-600">Für:</p>
                <p className="font-medium text-charcoal-900">{quote.client_name}</p>
              </div>
              <div>
                <p className="text-sage-600">Datum:</p>
                <p className="font-medium text-charcoal-900">{formatDate(quote.created_at)}</p>
              </div>
              {quote.event_date && (
                <div>
                  <p className="text-sage-600">Event:</p>
                  <p className="font-medium text-charcoal-900">{formatDate(quote.event_date)}</p>
                </div>
              )}
              {quote.valid_until && (
                <div>
                  <p className="text-sage-600">Gültig bis:</p>
                  <p className="font-medium text-charcoal-900">{formatDate(quote.valid_until)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Produkte */}
          {quote.collection && (
            <div className="space-y-4">
              <h3 className="font-display text-lg text-charcoal-900">Kollektion: {quote.collection.name}</h3>
              <div className="space-y-3">
                {quote.collection.collection_products.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-sage-100 rounded">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg?height=48&width=48&query=wedding product"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal-900">{item.product.name}</h4>
                      <p className="text-sm text-sage-600">{item.product.category.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-charcoal-900">{item.quantity}x</p>
                      <p className="text-sm text-sage-600">{formatCurrency(item.product.base_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gesamtsumme */}
          <div className="border-t border-sage-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-display text-xl text-charcoal-900">Gesamtbetrag</span>
              <span className="font-display text-2xl text-gold-600">{formatCurrency(quote.total_amount)}</span>
            </div>
          </div>

          {/* Notizen */}
          {quote.notes && (
            <div className="bg-sage-50 p-4 rounded">
              <h4 className="font-medium text-charcoal-900 mb-2">Zusätzliche Informationen</h4>
              <p className="text-sm text-sage-700">{quote.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-sage-500 pt-4 border-t border-sage-100">
            <p>Dieses Angebot wurde erstellt von {partner?.company_name}</p>
            <p>Kontakt: {partner?.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
