"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "./product-card"
import { Search, Filter, Grid, List } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

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
  category: Category
  variants: any[]
}

interface ProductCatalogProps {
  categories: Category[]
  products: Product[]
}

export function ProductCatalog({ categories, products }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all")
  const [selectedColor, setSelectedColor] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Extrahiere alle verfügbaren Materialien und Farben
  const allMaterials = useMemo(() => {
    const materials = new Set<string>()
    products.forEach((product) => {
      product.materials.forEach((material) => materials.add(material))
    })
    return Array.from(materials).sort()
  }, [products])

  const allColors = useMemo(() => {
    const colors = new Set<string>()
    products.forEach((product) => {
      product.colors.forEach((color) => colors.add(color))
    })
    return Array.from(colors).sort()
  }, [products])

  // Filtere Produkte
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Suchbegriff
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return false
      }

      // Kategorie
      if (selectedCategory !== "all" && product.category.slug !== selectedCategory) {
        return false
      }

      // Material
      if (selectedMaterial !== "all" && !product.materials.includes(selectedMaterial)) {
        return false
      }

      // Farbe
      if (selectedColor !== "all" && !product.colors.includes(selectedColor)) {
        return false
      }

      // Preisbereich
      if (priceRange !== "all") {
        const price = product.base_price
        switch (priceRange) {
          case "under-25":
            if (price >= 25) return false
            break
          case "25-50":
            if (price < 25 || price >= 50) return false
            break
          case "50-100":
            if (price < 50 || price >= 100) return false
            break
          case "over-100":
            if (price < 100) return false
            break
        }
      }

      // Nur Featured
      if (showFeaturedOnly && !product.is_featured) {
        return false
      }

      return true
    })
  }, [products, searchTerm, selectedCategory, selectedMaterial, selectedColor, priceRange, showFeaturedOnly])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedMaterial("all")
    setSelectedColor("all")
    setPriceRange("all")
    setShowFeaturedOnly(false)
  }

  return (
    <div className="space-y-8">
      {/* Suchleiste */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-5 h-5" />
        <Input
          placeholder="Produkte durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-sage-200 focus:border-gold-400 focus:ring-gold-400"
        />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-sage-200 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-sage-600" />
          <h3 className="font-medium text-charcoal-900">Filter</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-sage-600 hover:text-charcoal-900"
          >
            Alle Filter zurücksetzen
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-charcoal-700 mb-2 block">Kategorie</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-sage-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-700 mb-2 block">Material</label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger className="border-sage-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Materialien</SelectItem>
                {allMaterials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-700 mb-2 block">Farbe</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="border-sage-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Farben</SelectItem>
                {allColors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal-700 mb-2 block">Preisbereich</label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="border-sage-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Preise</SelectItem>
                <SelectItem value="under-25">Unter 25€</SelectItem>
                <SelectItem value="25-50">25€ - 50€</SelectItem>
                <SelectItem value="50-100">50€ - 100€</SelectItem>
                <SelectItem value="over-100">Über 100€</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col justify-end">
            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={showFeaturedOnly ? "bg-gold-600 hover:bg-gold-700" : "border-sage-200"}
            >
              Nur Featured
            </Button>
          </div>
        </div>
      </div>

      {/* Ansichtsmodus und Ergebnisse */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sage-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? "Produkt" : "Produkte"} gefunden
          </p>
          {(searchTerm ||
            selectedCategory !== "all" ||
            selectedMaterial !== "all" ||
            selectedColor !== "all" ||
            priceRange !== "all" ||
            showFeaturedOnly) && (
            <div className="flex gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="bg-sage-100 text-sage-700">
                  Suche: {searchTerm}
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="bg-sage-100 text-sage-700">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                </Badge>
              )}
              {showFeaturedOnly && (
                <Badge variant="secondary" className="bg-gold-100 text-gold-700">
                  Featured
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-gold-600 hover:bg-gold-700" : ""}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-gold-600 hover:bg-gold-700" : ""}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Produktgrid */}
      {filteredProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-sage-400" />
          </div>
          <h3 className="font-display text-xl text-charcoal-900 mb-2">Keine Produkte gefunden</h3>
          <p className="text-sage-600 mb-4">Versuchen Sie andere Suchbegriffe oder Filter</p>
          <Button onClick={clearFilters} variant="outline">
            Filter zurücksetzen
          </Button>
        </div>
      )}
    </div>
  )
}
