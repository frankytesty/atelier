"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuoteStatusBadge } from "./quote-status-badge"
import { User, Calendar, FileText, Edit, Download, Send, Copy } from "lucide-react"
import Link from "next/link"

interface QuoteDetailsProps {
  quote: any // TODO: Proper typing
  partner: any // TODO: Proper typing
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
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

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/quote/${quote.id}`
    await navigator.clipboard.writeText(link)
    // TODO: Toast notification
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">{quote.quote_number}</h1>
          <div className="flex items-center gap-4">
            <QuoteStatusBadge status={quote.status} />
            <span className="text-sage-600">Erstellt am {formatDate(quote.created_at)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyLink} className="border-sage-200 bg-transparent">
            <Copy className="w-4 h-4 mr-2" />
            Link
          </Button>
          <Button variant="outline" className="border-sage-200 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          {quote.status === "draft" && (
            <Button className="bg-gold-600 hover:bg-gold-700">
              <Send className="w-4 h-4 mr-2" />
              Senden
            </Button>
          )}
        </div>
      </div>

      {/* Kundeninformationen */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-sage-600" />
            Kundeninformationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-sage-600 mb-1">Name</p>
              <p className="font-medium text-charcoal-900">{quote.client_name}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">E-Mail</p>
              <p className="font-medium text-charcoal-900">{quote.client_email}</p>
            </div>
            {quote.event_date && (
              <div>
                <p className="text-sm text-sage-600 mb-1">Event-Datum</p>
                <p className="font-medium text-charcoal-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-sage-500" />
                  {formatDate(quote.event_date)}
                </p>
              </div>
            )}
            {quote.valid_until && (
              <div>
                <p className="text-sm text-sage-600 mb-1">Gültig bis</p>
                <p className="font-medium text-charcoal-900">{formatDate(quote.valid_until)}</p>
              </div>
            )}
          </div>

          {quote.notes && (
            <div>
              <p className="text-sm text-sage-600 mb-1">Notizen</p>
              <p className="text-charcoal-900">{quote.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Angebotsinformationen */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-sage-600" />
            Angebotsinformationen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-sage-600 mb-1">Kollektion</p>
              <p className="font-medium text-charcoal-900">{quote.collection?.name || "Keine Kollektion"}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">Gesamtbetrag</p>
              <p className="font-display text-2xl text-charcoal-900">{formatCurrency(quote.total_amount)}</p>
            </div>
          </div>

          {quote.collection && (
            <div>
              <p className="text-sm text-sage-600 mb-2">Enthaltene Produkte</p>
              <div className="space-y-2">
                {quote.collection.collection_products.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-sage-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">{item.product.name}</p>
                      <p className="text-xs text-sage-600">{item.product.category.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-charcoal-900">{item.quantity}x</p>
                      <p className="text-xs text-sage-600">{formatCurrency(item.product.base_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button asChild variant="outline" className="flex-1 border-sage-200 bg-transparent">
              <Link href={`/partner/quotes/${quote.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Bearbeiten
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
