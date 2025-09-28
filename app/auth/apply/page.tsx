"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    companyName: "",
    contactPerson: "",
    phone: "",
    businessType: "",
    website: "",
    yearsExperience: "",
    averageEventsPerYear: "",
    typicalBudgetRange: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const getRedirectUrl = () => {
        const isProduction =
          process.env.NODE_ENV === "production" ||
          window.location.hostname.includes("vercel.app") ||
          window.location.hostname.includes(".app") ||
          !window.location.hostname.includes("localhost")

        if (isProduction) {
          return `${window.location.origin}/auth/callback`
        }

        // Only use dev environment variable for actual localhost development
        return process.env["NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL"] || `${window.location.origin}/auth/callback`
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: getRedirectUrl(),
          data: {
            company_name: formData.companyName,
            contact_person: formData.contactPerson,
            phone: formData.phone,
            business_type: formData.businessType,
            website: formData.website,
            years_experience: Number.parseInt(formData.yearsExperience) || 0,
            average_events_per_year: Number.parseInt(formData.averageEventsPerYear) || 0,
            typical_budget_range: formData.typicalBudgetRange,
          },
        },
      })
      if (error) throw error
      router.push("/auth/application-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ein Fehler ist aufgetreten")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-sage-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Partner werden</h1>
          <p className="text-sage-600">Bewerben Sie sich für den exklusiven Zugang zu Atelier Luminform</p>
        </div>

        <Card className="border-sage-200 shadow-xl">
          <CardHeader>
            <CardTitle className="font-display text-2xl text-charcoal-900">Bewerbungsformular</CardTitle>
            <CardDescription className="text-sage-600">Teilen Sie uns mehr über Ihr Unternehmen mit</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-charcoal-700">
                    E-Mail-Adresse *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-charcoal-700">
                    Passwort *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-charcoal-700">
                    Firmenname *
                  </Label>
                  <Input
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-charcoal-700">
                    Ansprechpartner *
                  </Label>
                  <Input
                    id="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessType" className="text-charcoal-700">
                    Geschäftsbereich *
                  </Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger className="border-sage-200 focus:border-gold-400">
                      <SelectValue placeholder="Wählen Sie Ihren Bereich" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding_planner">Hochzeitsplaner</SelectItem>
                      <SelectItem value="venue">Veranstaltungsort</SelectItem>
                      <SelectItem value="event_manager">Event Manager</SelectItem>
                      <SelectItem value="other">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-charcoal-700">
                    Telefonnummer
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-charcoal-700">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://ihre-website.de"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="border-sage-200 focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience" className="text-charcoal-700">
                    Jahre Erfahrung
                  </Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageEventsPerYear" className="text-charcoal-700">
                    Events pro Jahr
                  </Label>
                  <Input
                    id="averageEventsPerYear"
                    type="number"
                    min="0"
                    value={formData.averageEventsPerYear}
                    onChange={(e) => setFormData({ ...formData, averageEventsPerYear: e.target.value })}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="typicalBudgetRange" className="text-charcoal-700">
                  Typisches Budget pro Event
                </Label>
                <Select
                  value={formData.typicalBudgetRange}
                  onValueChange={(value) => setFormData({ ...formData, typicalBudgetRange: value })}
                >
                  <SelectTrigger className="border-sage-200 focus:border-gold-400">
                    <SelectValue placeholder="Wählen Sie eine Budgetklasse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_10k">Unter 10.000€</SelectItem>
                    <SelectItem value="10k_25k">10.000€ - 25.000€</SelectItem>
                    <SelectItem value="25k_50k">25.000€ - 50.000€</SelectItem>
                    <SelectItem value="50k_100k">50.000€ - 100.000€</SelectItem>
                    <SelectItem value="over_100k">Über 100.000€</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? "Bewerbung wird gesendet..." : "Bewerbung senden"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-sage-600">
                Bereits Partner?{" "}
                <Link
                  href="/auth/login"
                  className="text-gold-600 hover:text-gold-700 font-medium underline underline-offset-4"
                >
                  Hier anmelden
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
