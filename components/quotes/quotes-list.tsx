"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuoteStatusBadge } from "@/components/quotes/quote-status-badge"
import { QuoteActions } from "@/components/quotes/quote-actions"
import { FileText, Calendar, User, Package, Euro, Eye, Clock } from "lucide-react"
import Link from "next/link"

interface Quote {
  id: string
  quote_number: string
  status: string
  total_amount: number
  client_name: string
  client_email: string
  event_date: string | null
  valid_until: string | null
  created_at: string
  collection: {
    name: string
    collection_products: Array<{
      quantity: number
      product: {
        name: string
        base_price: number
        images: string[]
        category: {
          name: string
        }
      }
    }>
  } | null
}

interface QuotesListProps {
  quotes: Quote[]
}

export function QuotesList({ quotes }: QuotesListProps) {
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

  const getTotalItems = (collection: Quote["collection"]) => {
    if (!collection) return 0
    return collection.collection_products.reduce((total, item) => total + item.quantity, 0)
  }

  const isExpiringSoon = (validUntil: string | null) => {
    if (!validUntil) return false
    const expiryDate = new Date(validUntil)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
          <FileText className="w-6 h-6 text-sage-400" />
        </div>
        <h3 className="font-display text-xl text-charcoal-900 mb-2">Noch keine Angebote</h3>
        <p className="text-sage-600 mb-6">Erstellen Sie Ihr erstes Angebot für einen Kunden</p>
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-gold-600 hover:bg-gold-700">
            <Link href="/partner/quotes/new">Neues Angebot erstellen</Link>
          </Button>
          <Button asChild variant="outline" className="border-sage-200 bg-transparent">
            <Link href="/partner/collections">Kollektionen ansehen</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card key={quote.id} className="border-sage-200 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-charcoal-900">{quote.quote_number}</h3>
                  <p className="text-sm text-sage-600">Erstellt am {formatDate(quote.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isExpiringSoon(quote.valid_until) && (
                  <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs">
                    <Clock className="w-3 h-3" />
                    Läuft bald ab
                  </div>
                )}
                <QuoteStatusBadge status={quote.status} />
                <QuoteActions quote={quote} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sage-500" />
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{quote.client_name}</p>
                  <p className="text-xs text-sage-600">{quote.client_email}</p>
                </div>
              </div>

              {quote.event_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sage-500" />
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">Event</p>
                    <p className="text-xs text-sage-600">{formatDate(quote.event_date)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-sage-500" />
                <div>
                  <p className="text-sm font-medium text-charcoal-900">
                    {quote.collection ? getTotalItems(quote.collection) : 0} Artikel
                  </p>
                  <p className="text-xs text-sage-600">
                    {quote.collection ? quote.collection.collection_products.length : 0} Produkte
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-sage-500" />
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{formatCurrency(quote.total_amount)}</p>
                  <p className="text-xs text-sage-600">
                    {quote.valid_until ? `Gültig bis ${formatDate(quote.valid_until)}` : "Unbegrenzt gültig"}
                  </p>
                </div>
              </div>
            </div>

            {/* Kollektionsvorschau */}
            <div className="flex items-center justify-between pt-4 border-t border-sage-100">
              <div className="flex items-center gap-2">
                {quote.collection && (
                  <>
                    <div className="flex -space-x-2">
                      {quote.collection.collection_products.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-600"
                          style={{ zIndex: 10 - index }}
                        >
                          {item.product.name.charAt(0)}
                        </div>
                      ))}
                      {quote.collection.collection_products.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-200 flex items-center justify-center text-xs font-medium text-purple-600">
                          +{quote.collection.collection_products.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-sage-600">
                      {quote.collection.name} -{" "}
                      {quote.collection.collection_products
                        .slice(0, 2)
                        .map((item) => item.product.name)
                        .join(", ")}
                      {quote.collection.collection_products.length > 2 && "..."}
                    </span>
                  </>
                )}
                {!quote.collection && <span className="text-sm text-sage-500">Keine Kollektion verknüpft</span>}
              </div>

              <Button asChild variant="ghost" size="sm" className="text-sage-600 hover:text-charcoal-900">
                <Link href={`/partner/quotes/${quote.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
