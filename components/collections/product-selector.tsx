"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Check } from "lucide-react"

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

interface ProductSelectorProps {
  products: Product[]
  selectedProducts: string[]
  onAddProduct: (product: Product, quantity: number, personalizationData: any) => void
}

export function ProductSelector({ products, selectedProducts, onAddProduct }: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [notes, setNotes] = useState("")

  // Extrahiere Kategorien
  const categories = useMemo(() => {
    const cats = new Set<string>()
    products.forEach((product) => cats.add(product.category.slug))
    return Array.from(cats).map((slug) => {
      const product = products.find((p) => p.category.slug === slug)
      return { slug, name: product?.category.name || slug }
    })
  }, [products])

  // Filtere Produkte
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (selectedCategory !== "all" && product.category.slug !== selectedCategory) {
        return false
      }
      return true
    })
  }, [products, searchTerm, selectedCategory])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleAddProduct = () => {
    if (!selectedProduct) return

    const personalizationData = {
      color: selectedColor,
      material: selectedMaterial,
      notes,
    }

    onAddProduct(selectedProduct, quantity, personalizationData)

    // Reset form
    setSelectedProduct(null)
    setQuantity(1)
    setSelectedColor("")
    setSelectedMaterial("")
    setNotes("")
  }

  return (
    <div className="space-y-4">
      {/* Suchfilter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
          <Input
            placeholder="Produkte durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-sage-200 focus:border-gold-400"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="border-sage-200">
            <SelectValue placeholder="Kategorie wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Produktliste */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredProducts.map((product) => {
          const isSelected = selectedProducts.includes(product.id)
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={product.images[0] || "/placeholder.svg?height=48&width=48&query=wedding product"}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-charcoal-900 truncate">{product.name}</h4>
                <p className="text-sm text-sage-600 truncate">{product.short_description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {product.category.name}
                  </Badge>
                  <span className="text-sm font-medium text-charcoal-900">{formatPrice(product.base_price)}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant={isSelected ? "outline" : "default"}
                    className={isSelected ? "text-green-600 border-green-200" : "bg-gold-600 hover:bg-gold-700"}
                    onClick={() => setSelectedProduct(product)}
                    disabled={isSelected}
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl text-charcoal-900">Produkt hinzufügen</DialogTitle>
                  </DialogHeader>

                  {selectedProduct && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16">
                          <Image
                            src={
                              selectedProduct.images[0] || "/placeholder.svg?height=64&width=64&query=wedding product"
                            }
                            alt={selectedProduct.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-charcoal-900">{selectedProduct.name}</h3>
                          <p className="text-sm text-sage-600">{formatPrice(selectedProduct.base_price)}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="quantity">Anzahl</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                            className="border-sage-200"
                          />
                        </div>

                        {selectedProduct.colors.length > 0 && (
                          <div>
                            <Label htmlFor="color">Farbe</Label>
                            <Select value={selectedColor} onValueChange={setSelectedColor}>
                              <SelectTrigger className="border-sage-200">
                                <SelectValue placeholder="Farbe wählen" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedProduct.colors.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    {color}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {selectedProduct.materials.length > 0 && (
                          <div>
                            <Label htmlFor="material">Material</Label>
                            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                              <SelectTrigger className="border-sage-200">
                                <SelectValue placeholder="Material wählen" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedProduct.materials.map((material) => (
                                  <SelectItem key={material} value={material}>
                                    {material}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="notes">Notizen (optional)</Label>
                          <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="border-sage-200"
                            placeholder="Besondere Wünsche oder Anmerkungen..."
                            rows={2}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedProduct(null)}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddProduct}
                          className="flex-1 bg-gold-600 hover:bg-gold-700"
                        >
                          Hinzufügen
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )
        })}

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sage-600">Keine Produkte gefunden</p>
          </div>
        )}
      </div>
    </div>
  )
}
