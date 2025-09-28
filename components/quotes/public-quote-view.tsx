"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, X, Download, MessageSquare } from "lucide-react"
import Image from "next/image"

interface PublicQuoteViewProps {
  quote: any // TODO: Proper typing
}

export function PublicQuoteView({ quote }: PublicQuoteViewProps) {
  const [response, setResponse] = useState("")
  const [isResponding, setIsResponding] = useState(false)

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

  const handleAccept = async () => {
    // TODO: API call to accept quote
    console.log("Accept quote")
  }

  const handleReject = async () => {
    // TODO: API call to reject quote
    console.log("Reject quote")
  }

  const handleSendResponse = async () => {
    // TODO: API call to send response
    console.log("Send response:", response)
    setIsResponding(false)
    setResponse("")
  }

  const isExpired = quote.valid_until && new Date(quote.valid_until) < new Date()
  const canRespond = ["viewed", "sent"].includes(quote.status) && !isExpired

  return (
    <div className="min-h-screen bg-sage-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">AL</span>
          </div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Atelier Luminform</h1>
          <p className="text-sage-600">{quote.partner.company_name}</p>
        </div>

        {/* Angebotskarte */}
        <Card className="border-sage-200 mb-8">
          <CardContent className="p-8">
            {/* Angebotsinformationen */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-display text-2xl text-charcoal-900 mb-2">Ihr Angebot</h2>
                <Badge className="bg-gold-100 text-gold-700 text-lg px-3 py-1">{quote.quote_number}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sage-600">Erstellt am</p>
                <p className="font-medium text-charcoal-900">{formatDate(quote.created_at)}</p>
              </div>
            </div>

            {/* Kundendaten */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-medium text-charcoal-900 mb-2">Angebot für:</h3>
                <p className="text-sage-700">{quote.client_name}</p>
                <p className="text-sage-600">{quote.client_email}</p>
              </div>
              <div>
                {quote.event_date && (
                  <div className="mb-4">
                    <h3 className="font-medium text-charcoal-900 mb-2">Event-Datum:</h3>
                    <p className="text-sage-700">{formatDate(quote.event_date)}</p>
                  </div>
                )}
                {quote.valid_until && (
                  <div>
                    <h3 className="font-medium text-charcoal-900 mb-2">Gültig bis:</h3>
                    <p className={`${isExpired ? "text-red-600" : "text-sage-700"}`}>
                      {formatDate(quote.valid_until)}
                      {isExpired && " (Abgelaufen)"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Produkte */}
            {quote.collection && (
              <div className="mb-8">
                <h3 className="font-display text-xl text-charcoal-900 mb-4">Kollektion: {quote.collection.name}</h3>
                <div className="space-y-4">
                  {quote.collection.collection_products.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-sage-100 rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg?height=64&width=64&query=wedding product"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-charcoal-900">{item.product.name}</h4>
                        <p className="text-sage-600">{item.product.category.name}</p>
                        {item.personalization_data && Object.keys(item.personalization_data).length > 0 && (
                          <div className="flex gap-2 mt-1">
                            {item.personalization_data.color && (
                              <Badge variant="outline" className="text-xs">
                                {item.personalization_data.color}
                              </Badge>
                            )}
                            {item.personalization_data.material && (
                              <Badge variant="outline" className="text-xs">
                                {item.personalization_data.material}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-charcoal-900">{item.quantity}x</p>
                        <p className="text-sage-600">{formatCurrency(item.product.base_price)}</p>
                        <p className="font-medium text-charcoal-900">
                          {formatCurrency(item.product.base_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gesamtsumme */}
            <div className="border-t border-sage-200 pt-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-display text-2xl text-charcoal-900">Gesamtbetrag</span>
                <span className="font-display text-3xl text-gold-600">{formatCurrency(quote.total_amount)}</span>
              </div>
            </div>

            {/* Notizen */}
            {quote.notes && (
              <div className="bg-sage-50 p-6 rounded-lg mb-8">
                <h4 className="font-medium text-charcoal-900 mb-3">Zusätzliche Informationen</h4>
                <p className="text-sage-700">{quote.notes}</p>
              </div>
            )}

            {/* Aktionen */}
            {canRespond && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Angebot annehmen
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Ablehnen
                  </Button>
                </div>

                <Button
                  onClick={() => setIsResponding(!isResponding)}
                  variant="outline"
                  className="w-full border-sage-200 bg-transparent"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nachricht senden
                </Button>

                {isResponding && (
                  <div className="space-y-3 p-4 border border-sage-200 rounded-lg">
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Ihre Nachricht an den Anbieter..."
                      className="border-sage-200"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSendResponse} className="bg-gold-600 hover:bg-gold-700">
                        Senden
                      </Button>
                      <Button onClick={() => setIsResponding(false)} variant="outline">
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isExpired && (
              <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">Dieses Angebot ist abgelaufen</p>
                <p className="text-red-600 text-sm mt-1">
                  Kontaktieren Sie {quote.partner.company_name} für ein neues Angebot
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Download Button */}
        <div className="text-center">
          <Button variant="outline" className="border-sage-200 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Als PDF herunterladen
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-8 border-t border-sage-200">
          <p className="text-sage-600 mb-2">Kontakt</p>
          <p className="font-medium text-charcoal-900">{quote.partner.company_name}</p>
          <p className="text-sage-600">{quote.partner.email}</p>
          {quote.partner.phone && <p className="text-sage-600">{quote.partner.phone}</p>}
        </div>
      </div>
    </div>
  )
}
