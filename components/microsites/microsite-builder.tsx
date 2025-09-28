"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { Globe, Palette, Settings, Eye, Save, AlertCircle } from "lucide-react"

interface Collection {
  id: string
  name: string
  description?: string
}

interface BrandKit {
  id: string
  name: string
  primary_color: string
  secondary_color?: string
  accent_color?: string
}

interface MicrositeBuilderProps {
  collections: Collection[]
  brandKits: BrandKit[]
  mode: "create" | "edit"
  initialData?: any
}

export function MicrositeBuilder({ collections, brandKits, mode, initialData }: MicrositeBuilderProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    subdomain: initialData?.subdomain || "",
    customDomain: initialData?.custom_domain || "",
    collectionId: initialData?.collection_id || "",
    brandKitId: initialData?.brand_kit_id || "",
    contactEmail: initialData?.contact_email || "",
    contactPhone: initialData?.contact_phone || "",
    isPublished: initialData?.is_published || false,
    isPasswordProtected: initialData?.is_password_protected || false,
    password: "",
    heroImageUrl: initialData?.hero_image_url || "",
    logoUrl: initialData?.logo_url || "",
  })

  const generateSubdomain = (title: string) => {
    const subdomain = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    setFormData((prev) => ({ ...prev, subdomain }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const micrositeData = {
        title: formData.title,
        description: formData.description,
        subdomain: formData.subdomain,
        custom_domain: formData.customDomain || null,
        collection_id: formData.collectionId || null,
        brand_kit_id: formData.brandKitId || null,
        contact_email: formData.contactEmail || null,
        contact_phone: formData.contactPhone || null,
        is_published: formData.isPublished,
        is_password_protected: formData.isPasswordProtected,
        hero_image_url: formData.heroImageUrl || null,
        logo_url: formData.logoUrl || null,
      }

      if (mode === "create") {
        const { data, error } = await supabase.from("microsites").insert([micrositeData]).select().single()

        if (error) throw error

        // Erstelle Standard-Seiten
        const defaultPages = [
          {
            microsite_id: data.id,
            slug: "home",
            title: "Startseite",
            content: {
              sections: [
                {
                  type: "hero",
                  title: formData.title,
                  subtitle: formData.description,
                  image: formData.heroImageUrl,
                },
                {
                  type: "collection",
                  title: "Unsere Kollektion",
                  collection_id: formData.collectionId,
                },
                {
                  type: "contact",
                  title: "Kontakt",
                  email: formData.contactEmail,
                  phone: formData.contactPhone,
                },
              ],
            },
          },
        ]

        await supabase.from("microsite_pages").insert(defaultPages)

        router.push(`/partner/microsites/${data.id}/edit`)
      } else {
        // Update existing microsite
        const { error } = await supabase.from("microsites").update(micrositeData).eq("id", initialData.id)

        if (error) throw error

        router.push("/partner/microsites")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Grundlagen
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Einstellungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900">Grundinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-charcoal-700">
                    Titel der Website *
                  </Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                      if (mode === "create" && !formData.subdomain) {
                        generateSubdomain(e.target.value)
                      }
                    }}
                    className="border-sage-200 focus:border-gold-400"
                    placeholder="z.B. Hochzeit Anna & Max"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain" className="text-charcoal-700">
                    Subdomain *
                  </Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      required
                      value={formData.subdomain}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subdomain: e.target.value }))}
                      className="border-sage-200 focus:border-gold-400 rounded-r-none"
                      placeholder="anna-max"
                    />
                    <div className="px-3 py-2 bg-sage-50 border border-l-0 border-sage-200 rounded-r-md text-sm text-sage-600">
                      .atelier-luminform.com
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-charcoal-700">
                  Beschreibung
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="border-sage-200 focus:border-gold-400"
                  placeholder="Eine kurze Beschreibung der Website..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customDomain" className="text-charcoal-700">
                  Eigene Domain (optional)
                </Label>
                <Input
                  id="customDomain"
                  value={formData.customDomain}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customDomain: e.target.value }))}
                  className="border-sage-200 focus:border-gold-400"
                  placeholder="www.ihre-domain.de"
                />
                <p className="text-xs text-sage-600">
                  Sie können später eine eigene Domain verbinden. Kontaktieren Sie uns für die Einrichtung.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900">Kollektion & Kontakt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collection" className="text-charcoal-700">
                  Kollektion auswählen
                </Label>
                <Select
                  value={formData.collectionId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, collectionId: value }))}
                >
                  <SelectTrigger className="border-sage-200">
                    <SelectValue placeholder="Wählen Sie eine Kollektion" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-charcoal-700">
                    Kontakt E-Mail
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                    placeholder="kontakt@beispiel.de"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-charcoal-700">
                    Telefonnummer
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900">Brand Kit & Bilder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandKit" className="text-charcoal-700">
                  Brand Kit auswählen
                </Label>
                <Select
                  value={formData.brandKitId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, brandKitId: value }))}
                >
                  <SelectTrigger className="border-sage-200">
                    <SelectValue placeholder="Wählen Sie ein Brand Kit" />
                  </SelectTrigger>
                  <SelectContent>
                    {brandKits.map((kit) => (
                      <SelectItem key={kit.id} value={kit.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-sage-200"
                            style={{ backgroundColor: kit.primary_color }}
                          />
                          {kit.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {brandKits.length === 0 && (
                  <p className="text-sm text-sage-600">Erstellen Sie zuerst ein Brand Kit in den Einstellungen.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoUrl" className="text-charcoal-700">
                    Logo URL
                  </Label>
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                    placeholder="https://beispiel.de/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroImageUrl" className="text-charcoal-700">
                    Hero-Bild URL
                  </Label>
                  <Input
                    id="heroImageUrl"
                    value={formData.heroImageUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                    placeholder="https://beispiel.de/hero.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900">Veröffentlichung & Sicherheit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Website veröffentlichen</Label>
                  <p className="text-sm text-sage-600">Machen Sie die Website öffentlich zugänglich</p>
                </div>
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Passwort-Schutz</Label>
                  <p className="text-sm text-sage-600">Schützen Sie die Website mit einem Passwort</p>
                </div>
                <Switch
                  checked={formData.isPasswordProtected}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPasswordProtected: checked }))}
                />
              </div>

              {formData.isPasswordProtected && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-charcoal-700">
                    Passwort
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                    placeholder="Sicheres Passwort eingeben"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-sage-200">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Abbrechen
        </Button>

        <div className="flex gap-3">
          {mode === "edit" && (
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              disabled={isLoading}
            >
              <Eye className="w-4 h-4" />
              Vorschau
            </Button>
          )}

          <Button type="submit" className="bg-gold-600 hover:bg-gold-700 flex items-center gap-2" disabled={isLoading}>
            <Save className="w-4 h-4" />
            {isLoading ? "Wird gespeichert..." : mode === "create" ? "Microsite erstellen" : "Änderungen speichern"}
          </Button>
        </div>
      </div>
    </form>
  )
}
