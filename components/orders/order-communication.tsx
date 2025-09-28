"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, Mail, Phone, User } from "lucide-react"

interface OrderCommunicationProps {
  order: any // TODO: Proper typing
}

export function OrderCommunication({ order }: OrderCommunicationProps) {
  const [message, setMessage] = useState("")

  // Mock communication history
  const communications = [
    {
      id: "1",
      type: "message",
      from: "partner",
      content: "Hallo! Ihre Bestellung ist in Bearbeitung. Wir melden uns bei Fragen.",
      timestamp: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "email",
      from: "client",
      content: "Können Sie mir den Liefertermin bestätigen?",
      timestamp: "2024-01-16T14:20:00Z",
    },
    {
      id: "3",
      type: "message",
      from: "partner",
      content: "Die Lieferung ist für den 25. Januar geplant. Wir informieren Sie rechtzeitig.",
      timestamp: "2024-01-16T15:45:00Z",
    },
  ]

  const handleSendMessage = () => {
    if (!message.trim()) return
    // TODO: API call to send message
    console.log("Send message:", message)
    setMessage("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Kundenkontakt */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-lg text-charcoal-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-sage-600" />
            Kundenkontakt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-medium text-charcoal-900">{order.client_name}</p>
            <p className="text-sm text-sage-600">{order.client_email}</p>
            {order.client_phone && <p className="text-sm text-sage-600">{order.client_phone}</p>}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 border-sage-200 bg-transparent">
              <Mail className="w-4 h-4 mr-1" />
              E-Mail
            </Button>
            {order.client_phone && (
              <Button size="sm" variant="outline" className="flex-1 border-sage-200 bg-transparent">
                <Phone className="w-4 h-4 mr-1" />
                Anrufen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Kommunikationsverlauf */}
      <Card className="border-sage-200">
        <CardHeader>
          <CardTitle className="font-display text-lg text-charcoal-900 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-sage-600" />
            Kommunikation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            {communications.map((comm) => (
              <div
                key={comm.id}
                className={`p-3 rounded-lg ${
                  comm.from === "partner" ? "bg-gold-50 border border-gold-200" : "bg-sage-50 border border-sage-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={comm.from === "partner" ? "text-gold-700 border-gold-300" : "text-sage-700"}
                    >
                      {comm.from === "partner" ? "Sie" : "Kunde"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {comm.type === "email" ? "E-Mail" : "Nachricht"}
                    </Badge>
                  </div>
                  <span className="text-xs text-sage-500">{formatDate(comm.timestamp)}</span>
                </div>
                <p className="text-sm text-charcoal-900">{comm.content}</p>
              </div>
            ))}
          </div>

          {/* Neue Nachricht */}
          <div className="space-y-3 pt-4 border-t border-sage-200">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nachricht an den Kunden..."
              className="border-sage-200"
              rows={3}
            />
            <Button onClick={handleSendMessage} className="w-full bg-gold-600 hover:bg-gold-700">
              <Send className="w-4 h-4 mr-2" />
              Nachricht senden
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
