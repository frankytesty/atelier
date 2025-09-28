"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Collection {
  id: string
  name: string
}

interface OrderCreateProps {
  collections: Collection[]
}

export function OrderCreate({ }: OrderCreateProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    event_date: "",
    delivery_address: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          order_items: [], // Leere Bestellpositionen für jetzt
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Fehler beim Erstellen der Bestellung")
      }

      toast({
        title: "Bestellung erstellt",
        description: `Bestellung ${result.order.order_number} wurde erfolgreich erstellt.`,
      })
      router.push(`/partner/orders/${result.order.id}`)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Fehler",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-sage-200">
      <div className="space-y-2">
        <Label htmlFor="client_name">Kundenname *</Label>
        <Input id="client_name" value={formData.client_name} onChange={handleChange} required />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_email">Kunden-E-Mail *</Label>
          <Input id="client_email" type="email" value={formData.client_email} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_phone">Telefon</Label>
          <Input id="client_phone" type="tel" value={formData.client_phone} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event_date">Event-Datum</Label>
        <Input
          id="event_date"
          type="date"
          value={formData.event_date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_address">Lieferadresse</Label>
        <Textarea 
          id="delivery_address" 
          value={formData.delivery_address} 
          onChange={handleChange} 
          rows={3}
          placeholder="Straße, PLZ, Ort"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notizen</Label>
        <Textarea id="notes" value={formData.notes} onChange={handleChange} rows={4} />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Bestellung wird erstellt..." : "Bestellung erstellen"}
      </Button>
    </form>
  )
}
