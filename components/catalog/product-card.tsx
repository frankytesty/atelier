"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Plus, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  base_price: number
  images: string[]
  materials: string[]
  colors: string[]
  is_featured: boolean
  category: {
    name: string
    slug: string
  }
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  if (viewMode === "list") {
    return (
      <Card className="border-sage-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-48 h-32 flex-shrink-0">
              <Image
                src={product.images[0] || "/placeholder.svg?height=128&width=192&query=wedding product"}
                alt={product.name}
                fill
                className="object-cover"
                onLoad={() => {}}
              />
              {product.is_featured && <Badge className="absolute top-2 left-2 bg-gold-600 text-white">Featured</Badge>}
            </div>

            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Badge variant="outline" className="text-xs text-sage-600 border-sage-200 mb-2">
                    {product.category.name}
                  </Badge>
                  <h3 className="font-display text-lg text-charcoal-900 mb-1">{product.name}</h3>
                  <p className="text-sage-600 text-sm leading-relaxed mb-3">{product.short_description}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl text-charcoal-900">ab {formatPrice(product.base_price)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {product.colors.slice(0, 3).map((color) => (
                    <div
                      key={color}
                      className="w-4 h-4 rounded-full border border-sage-200"
                      style={{
                        backgroundColor:
                          color.toLowerCase() === "ivory"
                            ? "#F8F6F0"
                            : color.toLowerCase() === "champagner"
                              ? "#F7E7CE"
                              : color.toLowerCase() === "sage"
                                ? "#9CAF88"
                                : color.toLowerCase() === "gold"
                                  ? "#D4AF37"
                                  : "#E5E5E5",
                      }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <span className="text-xs text-sage-500">+{product.colors.length - 3}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={cn(
                      "p-2",
                      isLiked ? "text-red-500 hover:text-red-600" : "text-sage-400 hover:text-sage-600",
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                  </Button>
                  <Button size="sm" className="bg-gold-600 hover:bg-gold-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Zur Kollektion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-sage-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg?height=300&width=400&query=wedding product"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onLoad={() => {}}
          />

          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-gold-600 text-white shadow-lg">Featured</Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm hover:bg-white",
              isLiked ? "text-red-500 hover:text-red-600" : "text-sage-400 hover:text-sage-600",
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button className="bg-white text-charcoal-900 hover:bg-ivory-100">
              <Eye className="w-4 h-4 mr-2" />
              Details ansehen
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Badge variant="outline" className="text-xs text-sage-600 border-sage-200 mb-2">
            {product.category.name}
          </Badge>

          <h3 className="font-display text-lg text-charcoal-900 mb-2 line-clamp-1">{product.name}</h3>

          <p className="text-sage-600 text-sm leading-relaxed mb-3 line-clamp-2">{product.short_description}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-3 h-3 rounded-full border border-sage-200"
                  style={{
                    backgroundColor:
                      color.toLowerCase() === "ivory"
                        ? "#F8F6F0"
                        : color.toLowerCase() === "champagner"
                          ? "#F7E7CE"
                          : color.toLowerCase() === "sage"
                            ? "#9CAF88"
                            : color.toLowerCase() === "gold"
                              ? "#D4AF37"
                              : "#E5E5E5",
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-sage-500 ml-1">+{product.colors.length - 4}</span>
              )}
            </div>

            <p className="font-display text-lg text-charcoal-900">ab {formatPrice(product.base_price)}</p>
          </div>

          <Button className="w-full bg-gold-600 hover:bg-gold-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Zur Kollektion hinzufügen
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
