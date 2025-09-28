"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "./order-status-badge"
import { User, Calendar, MapPin, Package, Edit, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderDetailsProps {
  order: any // TODO: Proper typing
}

export function OrderDetails({ order }: OrderDetailsProps) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">{order.order_number}</h1>
          <div className="flex items-center gap-4">
            <OrderStatusBadge status={order.status} />
            <span className="text-sage-600">Erstellt am {formatDate(order.created_at)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-sage-200 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button asChild className="bg-gold-600 hover:bg-gold-700">
            <Link href={`/partner/orders/${order.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Bearbeiten
            </Link>
          </Button>
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
              <p className="font-medium text-charcoal-900">{order.client_name}</p>
            </div>
            <div>
              <p className="text-sm text-sage-600 mb-1">E-Mail</p>
              <p className="font-medium text-charcoal-900">{order.client_email}</p>
            </div>
            {order.client_phone && (
              <div>
                <p className="text-sm text-sage-600 mb-1">Telefon</p>
                <p className="font-medium text-charcoal-900">{order.client_phone}</p>
              </div>
            )}
            {order.event_date && (
              <div>
                <p className="text-sm text-sage-600 mb-1">Event-Datum</p>
                <p className="font-medium text-charcoal-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-sage-500" />
                  {formatDate(order.event_date)}
                </p>
              </div>
            )}
          </div>

          {order.delivery_address && (
            <div>
              <p className="text-sm text-sage-600 mb-1">Lieferadresse</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-sage-500" />
                <div>
                  <p className="font-medium text-charcoal-900">{order.delivery_address}</p>
                </div>
              </div>
            </div>
          )}

          {order.notes && (
            <div>
              <p className="text-sm text-sage-600 mb-1">Notizen</p>
              <p className="text-charcoal-900">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bestellpositionen */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-sage-600" />
            Bestellpositionen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-sage-100 rounded-lg">
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
                  <p className="text-sm text-sage-600">{item.product.category.name}</p>
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
                  {item.notes && <p className="text-xs text-sage-500 mt-1">{item.notes}</p>}
                </div>

                <div className="text-right">
                  <p className="font-medium text-charcoal-900">{item.quantity}x</p>
                  <p className="text-sm text-sage-600">{formatCurrency(item.unit_price)}</p>
                  <p className="font-medium text-charcoal-900">{formatCurrency(item.unit_price * item.quantity)}</p>
                </div>
              </div>
            ))}

            {/* Gesamtsumme */}
            <div className="border-t border-sage-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-display text-lg text-charcoal-900">Gesamtbetrag</span>
                <span className="font-display text-xl text-charcoal-900">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
