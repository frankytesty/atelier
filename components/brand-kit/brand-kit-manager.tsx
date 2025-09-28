"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Palette, Edit, Trash2, Eye, Star } from "lucide-react"
import { BrandKitEditor } from "./brand-kit-editor"
import { BrandKitPreview } from "./brand-kit-preview"
import { createClient } from "@/lib/supabase/client"

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
  created_at?: string
}

interface BrandKitManagerProps {
  brandKits: BrandKit[]
  partnerId: string
}

export function BrandKitManager({ brandKits: initialBrandKits, partnerId }: BrandKitManagerProps) {
  const [brandKits, setBrandKits] = useState<BrandKit[]>(initialBrandKits)
  const [selectedKit, setSelectedKit] = useState<BrandKit | null>(null)
  const [mode, setMode] = useState<"list" | "create" | "edit" | "preview">("list")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateNew = () => {
    setSelectedKit(null)
    setMode("create")
  }

  const handleEdit = (kit: BrandKit) => {
    setSelectedKit(kit)
    setMode("edit")
  }

  const handlePreview = (kit: BrandKit) => {
    setSelectedKit(kit)
    setMode("preview")
  }

  const handleSetActive = async (kitId: string) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      // Deaktiviere alle anderen Kits
      await supabase.from("brand_kits").update({ is_active: false }).eq("partner_id", partnerId)

      // Aktiviere das ausgewählte Kit
      await supabase.from("brand_kits").update({ is_active: true }).eq("id", kitId)

      // Aktualisiere lokalen State
      setBrandKits((prev) =>
        prev.map((kit) => ({
          ...kit,
          is_active: kit.id === kitId,
        })),
      )
    } catch (error) {
      console.error("Fehler beim Aktivieren des Brand Kits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (kitId: string) => {
    if (!confirm("Sind Sie sicher, dass Sie dieses Brand Kit löschen möchten?")) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.from("brand_kits").delete().eq("id", kitId)
      setBrandKits((prev) => prev.filter((kit) => kit.id !== kitId))
    } catch (error) {
      console.error("Fehler beim Löschen des Brand Kits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = (savedKit: BrandKit) => {
    if (mode === "create") {
      setBrandKits((prev) => [savedKit, ...prev])
    } else {
      setBrandKits((prev) => prev.map((kit) => (kit.id === savedKit.id ? savedKit : kit)))
    }
    setMode("list")
    setSelectedKit(null)
  }

  if (mode === "create" || mode === "edit") {
    return (
      <BrandKitEditor
        brandKit={selectedKit}
        partnerId={partnerId}
        onSave={handleSave}
        onCancel={() => setMode("list")}
      />
    )
  }

  if (mode === "preview" && selectedKit) {
    return <BrandKitPreview brandKit={selectedKit} onBack={() => setMode("list")} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-charcoal-900">Meine Brand Kits</h2>
          <p className="text-sm text-sage-600">
            {brandKits.length} Brand Kit{brandKits.length !== 1 ? "s" : ""} erstellt
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-gold-600 hover:bg-gold-700">
          <Plus className="w-4 h-4 mr-2" />
          Neues Brand Kit
        </Button>
      </div>

      {/* Brand Kits Grid */}
      {brandKits.length === 0 ? (
        <Card className="border-sage-200">
          <CardContent className="p-12 text-center">
            <Palette className="w-12 h-12 text-sage-400 mx-auto mb-4" />
            <h3 className="font-display text-lg text-charcoal-900 mb-2">Noch keine Brand Kits</h3>
            <p className="text-sage-600 mb-6">
              Erstellen Sie Ihr erstes Brand Kit, um konsistente Designs für Ihre Projekte zu entwickeln.
            </p>
            <Button onClick={handleCreateNew} className="bg-gold-600 hover:bg-gold-700">
              <Plus className="w-4 h-4 mr-2" />
              Erstes Brand Kit erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandKits.map((kit) => (
            <Card key={kit.id} className="border-sage-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg text-charcoal-900 flex items-center">
                    {kit.name}
                    {kit.is_active && <Star className="w-4 h-4 ml-2 text-gold-600 fill-current" />}
                  </CardTitle>
                  {kit.is_active && <Badge className="bg-gold-100 text-gold-700 text-xs">Aktiv</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Farbpalette */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-sage-700">Farbpalette</p>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-lg border border-sage-200 shadow-sm"
                      style={{ backgroundColor: kit.primary_color }}
                      title={`Primärfarbe: ${kit.primary_color}`}
                    />
                    {kit.secondary_color && (
                      <div
                        className="w-8 h-8 rounded-lg border border-sage-200 shadow-sm"
                        style={{ backgroundColor: kit.secondary_color }}
                        title={`Sekundärfarbe: ${kit.secondary_color}`}
                      />
                    )}
                    {kit.accent_color && (
                      <div
                        className="w-8 h-8 rounded-lg border border-sage-200 shadow-sm"
                        style={{ backgroundColor: kit.accent_color }}
                        title={`Akzentfarbe: ${kit.accent_color}`}
                      />
                    )}
                  </div>
                </div>

                {/* Schriftarten */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-sage-700">Schriftarten</p>
                  <div className="space-y-1">
                    <p className="text-sm text-charcoal-900" style={{ fontFamily: kit.font_primary }}>
                      {kit.font_primary} (Überschriften)
                    </p>
                    <p className="text-xs text-sage-600" style={{ fontFamily: kit.font_secondary }}>
                      {kit.font_secondary} (Fließtext)
                    </p>
                  </div>
                </div>

                {/* Logo */}
                {kit.logo_url && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-sage-700">Logo</p>
                    <div className="w-full h-16 bg-sage-50 rounded-lg border border-sage-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={kit.logo_url || "/placeholder.svg"}
                        alt={`${kit.name} Logo`}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Aktionen */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(kit)}
                    className="flex-1 border-sage-200 bg-transparent"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Vorschau
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(kit)}
                    className="flex-1 border-sage-200 bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Bearbeiten
                  </Button>
                </div>

                <div className="flex gap-2">
                  {!kit.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActive(kit.id)}
                      disabled={isLoading}
                      className="flex-1 border-gold-200 text-gold-700 hover:bg-gold-50"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Aktivieren
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(kit.id)}
                    disabled={isLoading || kit.is_active}
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
