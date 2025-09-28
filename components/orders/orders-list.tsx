"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { OrderActions } from "@/components/orders/order-actions"
import { ShoppingCart, Calendar, User, Package, Euro, Eye } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  client_name: string
  client_email: string
  event_date: string | null
  created_at: string
  order_items: Array<{
    id: string
    quantity: number
    unit_price: number
    product: {
      name: string
      images: string[]
      category: {
        name: string
      }
    }
  }>
}

interface OrdersListProps {
  orders: Order[]
}

export function OrdersList({ orders }: OrdersListProps) {
  const [selectedOrders] = useState<string[]>([])

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

  const getTotalItems = (orderItems: Order["order_items"]) => {
    return orderItems.reduce((total, item) => total + item.quantity, 0)
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-sage-400" />
        </div>
        <h3 className="font-display text-xl text-charcoal-900 mb-2">Noch keine Bestellungen</h3>
        <p className="text-sage-600 mb-6">Erstellen Sie Ihre erste Bestellung oder warten Sie auf Kundenanfragen</p>
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-gold-600 hover:bg-gold-700">
            <Link href="/partner/orders/new">Neue Bestellung erstellen</Link>
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
      {orders.map((order) => (
        <Card key={order.id} className="border-sage-200 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-charcoal-900">{order.order_number}</h3>
                  <p className="text-sm text-sage-600">Erstellt am {formatDate(order.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <OrderStatusBadge status={order.status} />
                <OrderActions order={order} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sage-500" />
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{order.client_name}</p>
                  <p className="text-xs text-sage-600">{order.client_email}</p>
                </div>
              </div>

              {order.event_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sage-500" />
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">Event</p>
                    <p className="text-xs text-sage-600">{formatDate(order.event_date)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-sage-500" />
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{getTotalItems(order.order_items)} Artikel</p>
                  <p className="text-xs text-sage-600">{order.order_items.length} Produkte</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-sage-500" />
                <div>
                  <p className="text-sm font-medium text-charcoal-900">{formatCurrency(order.total_amount)}</p>
                  <p className="text-xs text-sage-600">Gesamtbetrag</p>
                </div>
              </div>
            </div>

            {/* Produktvorschau */}
            <div className="flex items-center justify-between pt-4 border-t border-sage-100">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {order.order_items.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id}
                      className="w-8 h-8 rounded-full border-2 border-white bg-sage-100 flex items-center justify-center text-xs font-medium text-sage-600"
                      style={{ zIndex: 10 - index }}
                    >
                      {item.product.name.charAt(0)}
                    </div>
                  ))}
                  {order.order_items.length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-sage-200 flex items-center justify-center text-xs font-medium text-sage-600">
                      +{order.order_items.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-sage-600">
                  {order.order_items
                    .slice(0, 2)
                    .map((item) => item.product.name)
                    .join(", ")}
                  {order.order_items.length > 2 && "..."}
                </span>
              </div>

              <Button asChild variant="ghost" size="sm" className="text-sage-600 hover:text-charcoal-900">
                <Link href={`/partner/orders/${order.id}`}>
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
