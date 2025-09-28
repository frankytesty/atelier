"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "./color-picker"
import { LogoUploader } from "./logo-uploader"
import { createClient } from "@/lib/supabase/client"
import { Save, ArrowLeft, Palette, Type, ImageIcon } from "lucide-react"

interface BrandKit {
  id: string
  name: string
  primary_color: string
  secondary_color?: string
  accent_color?: string
  logo_url?: string
  font_primary: string
  font_secondary: string
  custom_css?: string
  is_active: boolean
}

interface BrandKitEditorProps {
  brandKit: BrandKit | null
  partnerId: string
  onSave: (brandKit: BrandKit) => void
  onCancel: () => void
}

const FONT_OPTIONS = [
  { value: "Playfair Display", label: "Playfair Display (Elegant)" },
  { value: "Inter", label: "Inter (Modern)" },
  { value: "Crimson Text", label: "Crimson Text (Klassisch)" },
  { value: "Montserrat", label: "Montserrat (Clean)" },
  { value: "Lora", label: "Lora (Lesbar)" },
  { value: "Poppins", label: "Poppins (Freundlich)" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond (Luxuriös)" },
  { value: "Source Sans Pro", label: "Source Sans Pro (Professionell)" },
]

export function BrandKitEditor({ brandKit, partnerId, onSave, onCancel }: BrandKitEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: brandKit?.name || "",
    primary_color: brandKit?.primary_color || "#D4AF37",
    secondary_color: brandKit?.secondary_color || "#8B7355",
    accent_color: brandKit?.accent_color || "#F5F5DC",
    logo_url: brandKit?.logo_url || "",
    font_primary: brandKit?.font_primary || "Playfair Display",
    font_secondary: brandKit?.font_secondary || "Inter",
    custom_css: brandKit?.custom_css || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const brandKitData = {
        partner_id: partnerId,
        name: formData.name,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color || null,
        accent_color: formData.accent_color || null,
        logo_url: formData.logo_url || null,
        font_primary: formData.font_primary,
        font_secondary: formData.font_secondary,
        custom_css: formData.custom_css || null,
      }

      let result
      if (brandKit) {
        // Update existing
        result = await supabase.from("brand_kits").update(brandKitData).eq("id", brandKit.id).select().single()
      } else {
        // Create new
        result = await supabase.from("brand_kits").insert([brandKitData]).select().single()
      }

      if (result.error) throw result.error

      onSave(result.data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="font-display text-2xl text-charcoal-900">
            {brandKit ? "Brand Kit bearbeiten" : "Neues Brand Kit erstellen"}
          </h2>
          <p className="text-sage-600">Definieren Sie Ihre Markenidentität mit Farben, Schriftarten und Logo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Grundlagen
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
              Farben
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Typografie
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6">
            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="font-display text-xl text-charcoal-900">Brand Kit Informationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-charcoal-700">
                    Name des Brand Kits *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                    placeholder="z.B. Elegante Hochzeit, Moderne Events"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-6">
            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="font-display text-xl text-charcoal-900">Farbpalette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-charcoal-700">Primärfarbe *</Label>
                    <ColorPicker
                      color={formData.primary_color}
                      onChange={(color) => setFormData((prev) => ({ ...prev, primary_color: color }))}
                      label="Hauptfarbe für Überschriften und Akzente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-charcoal-700">Sekundärfarbe</Label>
                    <ColorPicker
                      color={formData.secondary_color}
                      onChange={(color) => setFormData((prev) => ({ ...prev, secondary_color: color }))}
                      label="Ergänzende Farbe für Elemente"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-charcoal-700">Akzentfarbe</Label>
                    <ColorPicker
                      color={formData.accent_color}
                      onChange={(color) => setFormData((prev) => ({ ...prev, accent_color: color }))}
                      label="Hintergrund und subtile Akzente"
                    />
                  </div>
                </div>

                {/* Farbvorschau */}
                <div className="p-6 rounded-lg border border-sage-200 bg-white">
                  <h3 className="font-display text-lg mb-4" style={{ color: formData.primary_color }}>
                    Farbvorschau
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: formData.accent_color || "#F5F5DC" }}>
                      <p style={{ color: formData.primary_color }}>Primärfarbe auf Akzent-Hintergrund</p>
                      <p style={{ color: formData.secondary_color || "#8B7355" }}>Sekundärfarbe für Details</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="font-display text-xl text-charcoal-900">Schriftarten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-charcoal-700">Überschriften-Schrift</Label>
                    <Select
                      value={formData.font_primary}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, font_primary: value }))}
                    >
                      <SelectTrigger className="border-sage-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-charcoal-700">Fließtext-Schrift</Label>
                    <Select
                      value={formData.font_secondary}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, font_secondary: value }))}
                    >
                      <SelectTrigger className="border-sage-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.value }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Schriftvorschau */}
                <div className="p-6 rounded-lg border border-sage-200 bg-white space-y-4">
                  <h3 className="font-display text-lg text-charcoal-900 mb-4">Schriftvorschau</h3>
                  <div
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: formData.font_primary,
                      color: formData.primary_color,
                    }}
                  >
                    Elegante Hochzeitseinladungen
                  </div>
                  <div
                    className="text-base leading-relaxed"
                    style={{
                      fontFamily: formData.font_secondary,
                      color: formData.secondary_color || "#8B7355",
                    }}
                  >
                    Wir freuen uns, Ihnen unsere exklusive Kollektion von handgefertigten Hochzeitseinladungen
                    präsentieren zu können. Jedes Design wird mit größter Sorgfalt und Liebe zum Detail erstellt.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="font-display text-xl text-charcoal-900">Logo & Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <LogoUploader
                  currentLogoUrl={formData.logo_url}
                  onLogoChange={(url) => setFormData((prev) => ({ ...prev, logo_url: url }))}
                />

                <div className="space-y-2">
                  <Label className="text-charcoal-700">Custom CSS (Erweitert)</Label>
                  <Textarea
                    value={formData.custom_css}
                    onChange={(e) => setFormData((prev) => ({ ...prev, custom_css: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400 font-mono text-sm"
                    placeholder="/* Zusätzliche CSS-Regeln für erweiterte Anpassungen */"
                    rows={8}
                  />
                  <p className="text-xs text-sage-600">
                    Fügen Sie benutzerdefinierte CSS-Regeln hinzu, um das Design weiter anzupassen.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-sage-200">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Abbrechen
          </Button>

          <Button type="submit" className="bg-gold-600 hover:bg-gold-700" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Wird gespeichert..." : brandKit ? "Änderungen speichern" : "Brand Kit erstellen"}
          </Button>
        </div>
      </form>
    </div>
  )
}
