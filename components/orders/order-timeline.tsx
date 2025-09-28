"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, Package, Truck, Home } from "lucide-react"

interface OrderTimelineProps {
  order: any // TODO: Proper typing
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  // Mock timeline data - in real app this would come from order history
  const timelineEvents = [
    {
      id: "1",
      status: "draft",
      title: "Bestellung erstellt",
      description: "Bestellung wurde als Entwurf angelegt",
      timestamp: order.created_at,
      completed: true,
    },
    {
      id: "2",
      status: "pending",
      title: "Bestätigung ausstehend",
      description: "Warten auf Kundenbestätigung",
      timestamp: order.created_at,
      completed: order.status !== "draft",
    },
    {
      id: "3",
      status: "confirmed",
      title: "Bestellung bestätigt",
      description: "Kunde hat die Bestellung bestätigt",
      timestamp: null,
      completed: ["confirmed", "in_production", "shipped", "delivered"].includes(order.status),
    },
    {
      id: "4",
      status: "in_production",
      title: "In Produktion",
      description: "Produkte werden hergestellt",
      timestamp: null,
      completed: ["in_production", "shipped", "delivered"].includes(order.status),
    },
    {
      id: "5",
      status: "shipped",
      title: "Versendet",
      description: "Bestellung wurde versendet",
      timestamp: null,
      completed: ["shipped", "delivered"].includes(order.status),
    },
    {
      id: "6",
      status: "delivered",
      title: "Geliefert",
      description: "Bestellung wurde erfolgreich geliefert",
      timestamp: null,
      completed: order.status === "delivered",
    },
  ]

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }

    const icons = {
      draft: Clock,
      pending: AlertCircle,
      confirmed: CheckCircle,
      in_production: Package,
      shipped: Truck,
      delivered: Home,
    }

    const Icon = icons[status as keyof typeof icons] || Clock
    return <Icon className="w-5 h-5 text-sage-400" />
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-sage-200">
      <CardHeader>
        <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-sage-600" />
          Bestellverlauf
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`p-2 rounded-full ${
                    event.completed ? "bg-green-100" : "bg-sage-100"
                  } flex items-center justify-center`}
                >
                  {getStatusIcon(event.status, event.completed)}
                </div>
                {index < timelineEvents.length - 1 && (
                  <div className={`w-px h-8 mt-2 ${event.completed ? "bg-green-200" : "bg-sage-200"}`} />
                )}
              </div>

              <div className="flex-1 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium ${event.completed ? "text-charcoal-900" : "text-sage-600"}`}>
                    {event.title}
                  </h4>
                  {event.status === order.status && (
                    <Badge className="bg-gold-100 text-gold-700 text-xs">Aktuell</Badge>
                  )}
                </div>
                <p className={`text-sm ${event.completed ? "text-sage-600" : "text-sage-500"}`}>{event.description}</p>
                {event.timestamp && <p className="text-xs text-sage-500 mt-1">{formatDate(event.timestamp)}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
