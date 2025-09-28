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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductSelector } from "./product-selector"
import { CollectionProductsList } from "./collection-products-list"
import { useCollections } from "@/lib/hooks/use-collections"
import { Save, ArrowLeft, AlertCircle } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  base_price: number
  images: string[]
  materials: string[]
  colors: string[]
  tags: string[]
  is_featured: boolean
  category: {
    name: string
    slug: string
  }
  variants: any[]
}

interface CollectionProduct {
  id: string
  quantity: number
  personalization_data: any
  notes?: string
  product: Product
}

interface Collection {
  id: string
  name: string
  description?: string
  is_public: boolean
  collection_products: CollectionProduct[]
}

interface CollectionEditorProps {
  mode: "create" | "edit"
  initialData?: Collection
  products: Product[]
}

export function CollectionEditor({ mode, initialData, products }: CollectionEditorProps) {
  const router = useRouter()
  const { createCollection, addProductToCollection } = useCollections()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    is_public: initialData?.is_public || false,
  })

  const [selectedProducts, setSelectedProducts] = useState<CollectionProduct[]>(initialData?.collection_products || [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === "create") {
        const collection = await createCollection(formData)

        // Füge ausgewählte Produkte hinzu
        for (const item of selectedProducts) {
          await addProductToCollection(collection.id, {
            product_id: item.product.id,
            quantity: item.quantity,
            personalization_data: item.personalization_data,
            ...(item.notes && { notes: item.notes }),
          })
        }

        router.push("/partner/collections")
      } else {
        // Update existing collection
        const response = await fetch(`/api/collections/${initialData!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Fehler beim Aktualisieren")
        }

        router.push("/partner/collections")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = (product: Product, quantity = 1, personalizationData: any = {}) => {
    const existingIndex = selectedProducts.findIndex((item) => item.product.id === product.id)

    if (existingIndex >= 0) {
      // Update existing product
      const updated = [...selectedProducts]
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity,
        personalization_data: personalizationData,
      }
      setSelectedProducts(updated)
    } else {
      // Add new product
      setSelectedProducts((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          quantity,
          personalization_data: personalizationData,
          product,
          notes: undefined,
        },
      ])
    }
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const handleUpdateProduct = (productId: string, updates: Partial<CollectionProduct>) => {
    setSelectedProducts((prev) => prev.map((item) => (item.product.id === productId ? { ...item, ...updates } : item)))
  }

  const totalValue = selectedProducts.reduce((sum, item) => {
    return sum + item.product.base_price * item.quantity
  }, 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div className="flex-1">
          <h2 className="font-display text-2xl text-charcoal-900">
            {mode === "create" ? "Neue Kollektion" : "Kollektion bearbeiten"}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-sage-600">Gesamtwert</p>
          <p className="font-display text-xl text-charcoal-900">
            {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(totalValue)}
          </p>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Kollektion Details</TabsTrigger>
          <TabsTrigger value="products">Produkte ({selectedProducts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900">Grundinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-charcoal-700">
                  Name der Kollektion *
                </Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="border-sage-200 focus:border-gold-400"
                  placeholder="z.B. Romantische Hochzeit"
                />
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
                  placeholder="Beschreiben Sie diese Kollektion..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Öffentlich sichtbar</Label>
                  <p className="text-sm text-sage-600">Andere Partner können diese Kollektion als Inspiration sehen</p>
                </div>
                <Switch
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_public: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="font-display text-xl text-charcoal-900">Produkte hinzufügen</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSelector
                  products={products}
                  selectedProducts={selectedProducts.map((item) => item.product.id)}
                  onAddProduct={handleAddProduct}
                />
              </CardContent>
            </Card>

            <Card className="border-sage-200">
              <CardHeader>
                <CardTitle className="font-display text-xl text-charcoal-900">
                  Ausgewählte Produkte ({selectedProducts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CollectionProductsList
                  products={selectedProducts}
                  onRemoveProduct={handleRemoveProduct}
                  onUpdateProduct={handleUpdateProduct}
                />
              </CardContent>
            </Card>
          </div>
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

        <Button
          type="submit"
          className="bg-gold-600 hover:bg-gold-700 flex items-center gap-2"
          disabled={isLoading || !formData.name.trim()}
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Wird gespeichert..." : mode === "create" ? "Kollektion erstellen" : "Änderungen speichern"}
        </Button>
      </div>
    </form>
  )
}
