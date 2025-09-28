"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Edit, Trash2, MessageSquare, FileText, Mail, Phone } from "lucide-react"
import { OrderStatusBadge } from "./order-status-badge"

interface Order {
  id: string
  order_number: string
  status: string
  client_name: string
  client_email: string
}

interface OrderActionsProps {
  order: Order
}

export function OrderActions({ order }: OrderActionsProps) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState(order.status)
  const [message, setMessage] = useState("")

  const handleStatusUpdate = async () => {
    // TODO: API-Aufruf zum Status-Update
    console.log("Update status to:", newStatus)
    setIsStatusDialogOpen(false)
  }

  const handleSendMessage = async () => {
    // TODO: API-Aufruf zum Nachricht senden
    console.log("Send message:", message)
    setIsMessageDialogOpen(false)
    setMessage("")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <a href={`/partner/orders/${order.id}`} className="flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              Bearbeiten
            </a>
          </DropdownMenuItem>

          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <FileText className="w-4 h-4 mr-2" />
                Status ändern
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-charcoal-900">Status ändern</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Bestellung: {order.order_number}</Label>
                  <p className="text-sm text-sage-600">Kunde: {order.client_name}</p>
                </div>

                <div>
                  <Label>Aktueller Status</Label>
                  <div className="mt-1">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-status">Neuer Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="border-sage-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Entwurf</SelectItem>
                      <SelectItem value="pending">Ausstehend</SelectItem>
                      <SelectItem value="confirmed">Bestätigt</SelectItem>
                      <SelectItem value="in_production">In Produktion</SelectItem>
                      <SelectItem value="shipped">Versendet</SelectItem>
                      <SelectItem value="delivered">Geliefert</SelectItem>
                      <SelectItem value="cancelled">Storniert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsStatusDialogOpen(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button onClick={handleStatusUpdate} className="flex-1 bg-gold-600 hover:bg-gold-700">
                    Status ändern
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Nachricht senden
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-charcoal-900">Nachricht an Kunde</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>An: {order.client_name}</Label>
                  <p className="text-sm text-sage-600">{order.client_email}</p>
                </div>

                <div>
                  <Label htmlFor="message">Nachricht</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-sage-200"
                    placeholder="Ihre Nachricht an den Kunden..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsMessageDialogOpen(false)}
                  >
                    Abbrechen
                  </Button>
                  <Button onClick={handleSendMessage} className="flex-1 bg-gold-600 hover:bg-gold-700">
                    Senden
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Mail className="w-4 h-4 mr-2" />
            E-Mail senden
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Phone className="w-4 h-4 mr-2" />
            Anrufen
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Löschen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
