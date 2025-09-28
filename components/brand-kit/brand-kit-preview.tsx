"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Share } from "lucide-react"

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
}

interface BrandKitPreviewProps {
  brandKit: BrandKit
  onBack: () => void
}

export function BrandKitPreview({ brandKit, onBack }: BrandKitPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="font-display text-2xl text-charcoal-900">{brandKit.name}</h2>
            <p className="text-sage-600">Brand Kit Vorschau</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-sage-200 bg-transparent">
            <Share className="w-4 h-4 mr-2" />
            Teilen
          </Button>
          <Button variant="outline" className="border-sage-200 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Exportieren
          </Button>
        </div>
      </div>

      {/* Vorschau */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Farbpalette */}
        <Card className="border-sage-200">
          <CardContent className="p-6">
            <h3 className="font-display text-lg text-charcoal-900 mb-4">Farbpalette</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg border border-sage-200 shadow-sm"
                  style={{ backgroundColor: brandKit.primary_color }}
                />
                <div>
                  <p className="font-medium text-charcoal-900">Primärfarbe</p>
                  <p className="text-sm text-sage-600 font-mono">{brandKit.primary_color}</p>
                </div>
              </div>

              {brandKit.secondary_color && (
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border border-sage-200 shadow-sm"
                    style={{ backgroundColor: brandKit.secondary_color }}
                  />
                  <div>
                    <p className="font-medium text-charcoal-900">Sekundärfarbe</p>
                    <p className="text-sm text-sage-600 font-mono">{brandKit.secondary_color}</p>
                  </div>
                </div>
              )}

              {brandKit.accent_color && (
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg border border-sage-200 shadow-sm"
                    style={{ backgroundColor: brandKit.accent_color }}
                  />
                  <div>
                    <p className="font-medium text-charcoal-900">Akzentfarbe</p>
                    <p className="text-sm text-sage-600 font-mono">{brandKit.accent_color}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Typografie */}
        <Card className="border-sage-200">
          <CardContent className="p-6">
            <h3 className="font-display text-lg text-charcoal-900 mb-4">Typografie</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-sage-600 mb-2">Überschriften</p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: brandKit.font_primary,
                    color: brandKit.primary_color,
                  }}
                >
                  {brandKit.font_primary}
                </p>
              </div>
              <div>
                <p className="text-sm text-sage-600 mb-2">Fließtext</p>
                <p
                  className="text-base"
                  style={{
                    fontFamily: brandKit.font_secondary,
                    color: brandKit.secondary_color || "#8B7355",
                  }}
                >
                  {brandKit.font_secondary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo */}
        {brandKit.logo_url && (
          <Card className="border-sage-200">
            <CardContent className="p-6">
              <h3 className="font-display text-lg text-charcoal-900 mb-4">Logo</h3>
              <div className="w-full h-32 bg-sage-50 rounded-lg border border-sage-200 flex items-center justify-center overflow-hidden">
                <img
                  src={brandKit.logo_url || "/placeholder.svg"}
                  alt={`${brandKit.name} Logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Beispiel-Design */}
        <Card className="border-sage-200 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-display text-lg text-charcoal-900 mb-4">Beispiel-Design</h3>
            <div
              className="p-8 rounded-lg border border-sage-200"
              style={{ backgroundColor: brandKit.accent_color || "#F5F5DC" }}
            >
              {brandKit.logo_url && (
                <div className="mb-6">
                  <img src={brandKit.logo_url || "/placeholder.svg"} alt="Logo" className="h-12 object-contain" />
                </div>
              )}
              <h1
                className="text-3xl font-bold mb-4"
                style={{
                  fontFamily: brandKit.font_primary,
                  color: brandKit.primary_color,
                }}
              >
                Elegante Hochzeitseinladungen
              </h1>
              <p
                className="text-lg mb-6 leading-relaxed"
                style={{
                  fontFamily: brandKit.font_secondary,
                  color: brandKit.secondary_color || "#8B7355",
                }}
              >
                Wir freuen uns, Ihnen unsere exklusive Kollektion von handgefertigten Hochzeitseinladungen präsentieren
                zu können. Jedes Design wird mit größter Sorgfalt und Liebe zum Detail erstellt.
              </p>
              <div className="flex gap-4">
                <button
                  className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: brandKit.primary_color }}
                >
                  Kollektion ansehen
                </button>
                <button
                  className="px-6 py-3 rounded-lg font-medium border-2 transition-colors"
                  style={{
                    borderColor: brandKit.primary_color,
                    color: brandKit.primary_color,
                  }}
                >
                  Kontakt aufnehmen
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
