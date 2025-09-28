"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, FileText, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
}

interface Quote {
  id: string
  total_amount: number
  status: string
  created_at: string
}

interface RecentActivityProps {
  orders: Order[]
  quotes: Quote[]
}

export function RecentActivity({ orders, quotes }: RecentActivityProps) {
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

  const getStatusBadge = (status: string, type: "order" | "quote") => {
    const statusConfig = {
      order: {
        draft: { label: "Entwurf", variant: "outline" as const, color: "text-gray-600" },
        pending: { label: "Ausstehend", variant: "outline" as const, color: "text-orange-600" },
        confirmed: { label: "Bestätigt", variant: "default" as const, color: "text-blue-600" },
        in_production: { label: "In Produktion", variant: "default" as const, color: "text-purple-600" },
        shipped: { label: "Versendet", variant: "default" as const, color: "text-green-600" },
        delivered: { label: "Geliefert", variant: "default" as const, color: "text-green-700" },
        cancelled: { label: "Storniert", variant: "outline" as const, color: "text-red-600" },
      },
      quote: {
        draft: { label: "Entwurf", variant: "outline" as const, color: "text-gray-600" },
        sent: { label: "Gesendet", variant: "default" as const, color: "text-blue-600" },
        viewed: { label: "Angesehen", variant: "default" as const, color: "text-purple-600" },
        accepted: { label: "Angenommen", variant: "default" as const, color: "text-green-600" },
        rejected: { label: "Abgelehnt", variant: "outline" as const, color: "text-red-600" },
        expired: { label: "Abgelaufen", variant: "outline" as const, color: "text-gray-600" },
      },
    }

    const config = statusConfig[type][status as keyof (typeof statusConfig)[typeof type]]
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  // Kombiniere und sortiere Aktivitäten
  const activities = [
    ...orders.map((order) => ({
      ...order,
      type: "order" as const,
      icon: ShoppingCart,
      title: `Bestellung ${order.id.slice(0, 8)}`,
    })),
    ...quotes.map((quote) => ({
      ...quote,
      type: "quote" as const,
      icon: FileText,
      title: `Angebot ${quote.id.slice(0, 8)}`,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)

  return (
    <Card className="border-sage-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-sage-600" />
          Letzte Aktivitäten
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-sage-600 hover:text-charcoal-900">
          Alle anzeigen
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={`${activity.type}-${activity.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-sage-100 hover:bg-sage-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-sage-100">
                      <Icon className="w-4 h-4 text-sage-600" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal-900">{activity.title}</p>
                      <p className="text-sm text-sage-600">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-charcoal-900">{formatCurrency(activity.total_amount)}</span>
                    {getStatusBadge(activity.status, activity.type)}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-sage-400" />
            </div>
            <h3 className="font-display text-lg text-charcoal-900 mb-2">Noch keine Aktivitäten</h3>
            <p className="text-sage-600 mb-4">Erstellen Sie Ihre erste Kollektion oder Ihr erstes Angebot</p>
            <div className="flex gap-2 justify-center">
              <Button asChild size="sm" className="bg-gold-600 hover:bg-gold-700">
                <Link href="/partner/collections/new">Kollektion erstellen</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/partner/quotes/new">Angebot erstellen</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
