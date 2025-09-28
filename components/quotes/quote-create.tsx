"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type CollectionOption = { id: string; name: string }

export function QuoteCreate({ collections }: { collections: CollectionOption[] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    collection_id: "",
    client_name: "",
    client_email: "",
    event_date: "",
    total_amount: "",
    valid_until: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Nicht angemeldet")

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection_id: form.collection_id,
          client_name: form.client_name,
          client_email: form.client_email,
          event_date: form.event_date || null,
          total_amount: Number(form.total_amount || 0),
          valid_until: form.valid_until || null,
          notes: form.notes || null,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || "Erstellung fehlgeschlagen")
      }
      const { quote } = await res.json()
      router.push(`/partner/quotes/${quote.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Unbekannter Fehler")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-sage-200">
      <CardHeader>
        <CardTitle className="font-display text-2xl text-charcoal-900">Neues Angebot erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-charcoal-700">Kollektion</Label>
            <Select
              value={form.collection_id}
              onValueChange={(v) => setForm((f) => ({ ...f, collection_id: v }))}
            >
              <SelectTrigger className="border-sage-200">
                <SelectValue placeholder="Wähle eine Kollektion" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-charcoal-700">Kundenname</Label>
              <Input
                className="border-sage-200"
                value={form.client_name}
                onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-charcoal-700">E-Mail</Label>
              <Input
                type="email"
                className="border-sage-200"
                value={form.client_email}
                onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-charcoal-700">Event-Datum</Label>
              <Input
                type="date"
                className="border-sage-200"
                value={form.event_date}
                onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-charcoal-700">Gesamtbetrag (€)</Label>
              <Input
                type="number"
                step="0.01"
                className="border-sage-200"
                value={form.total_amount}
                onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-charcoal-700">Gültig bis</Label>
              <Input
                type="date"
                className="border-sage-200"
                value={form.valid_until}
                onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-charcoal-700">Notizen</Label>
            <Input
              className="border-sage-200"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>
          )}

          <Button type="submit" className="bg-gold-600 hover:bg-gold-700" disabled={isLoading || !form.collection_id}>
            {isLoading ? "Wird erstellt..." : "Angebot erstellen"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}