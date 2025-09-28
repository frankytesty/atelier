"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Package, Edit, MoreVertical, Eye, Share2, Trash2, Calendar, Euro, ShoppingCart, Plus } from "lucide-react"

interface CollectionProduct {
  id: string
  quantity: number
  personalization_data: any
  product: {
    id: string
    name: string
    base_price: number
    images: string[]
    category: {
      name: string
    }
  }
}

interface Collection {
  id: string
  name: string
  description?: string
  is_public: boolean
  created_at: string
  collection_products: CollectionProduct[]
}

interface CollectionsListProps {
  collections: Collection[]
}

export function CollectionsList({ collections }: CollectionsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calculateTotalValue = (products: CollectionProduct[]) => {
    return products.reduce((sum, item) => {
      return sum + item.product.base_price * item.quantity
    }, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const handleDelete = async (collectionId: string) => {
    if (!confirm("Sind Sie sicher, dass Sie diese Kollektion löschen möchten?")) {
      return
    }

    setDeletingId(collectionId)
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Fehler beim Löschen")
      }

      // Seite neu laden
      window.location.reload()
    } catch (error) {
      alert("Fehler beim Löschen der Kollektion")
    } finally {
      setDeletingId(null)
    }
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-sage-100 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-sage-400" />
        </div>
        <h3 className="font-display text-2xl text-charcoal-900 mb-2 line-clamp-1">Noch keine Kollektionen</h3>
        <p className="text-sage-600 mb-6 max-w-md mx-auto">
          Erstellen Sie Ihre erste Kollektion, um Produkte zu organisieren und Ihren Kunden zu präsentieren.
        </p>
        <Button asChild className="bg-gold-600 hover:bg-gold-700">
          <Link href="/partner/collections/new">
            <Plus className="w-4 h-4 mr-2" />
            Erste Kollektion erstellen
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => {
        const totalProducts = collection.collection_products.length
        const totalValue = calculateTotalValue(collection.collection_products)
        const previewImages = collection.collection_products
          .slice(0, 4)
          .map((item) => item.product.images[0])
          .filter(Boolean)

        return (
          <Card
            key={collection.id}
            className="border-sage-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="font-display text-xl text-charcoal-900 mb-1 line-clamp-1">
                    {collection.name}
                  </CardTitle>
                  {collection.description && (
                    <p className="text-sage-600 text-sm line-clamp-2 mb-2">{collection.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge variant={collection.is_public ? "default" : "outline"} className="text-xs">
                      {collection.is_public ? "Öffentlich" : "Privat"}
                    </Badge>
                    <span className="text-xs text-sage-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(collection.created_at)}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/partner/collections/${collection.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Bearbeiten
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Vorschau
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="w-4 h-4 mr-2" />
                      Teilen
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(collection.id)}
                      disabled={deletingId === collection.id}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Produkt-Vorschau */}
              {previewImages.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {previewImages.map((image, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-sage-50">
                      <Image
                        src={image || "/placeholder.svg?height=80&width=80&query=wedding product"}
                        alt="Produkt"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-20 bg-sage-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-sage-400" />
                </div>
              )}

              {/* Statistiken */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-sage-100">
                <div className="text-center">
                  <div className="flex items-center justify-center text-sage-600 mb-1">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                  </div>
                  <p className="font-display text-lg text-charcoal-900">{totalProducts}</p>
                  <p className="text-xs text-sage-600">Produkte</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-sage-600 mb-1">
                    <Euro className="w-4 h-4 mr-1" />
                  </div>
                  <p className="font-display text-lg text-charcoal-900">{formatCurrency(totalValue)}</p>
                  <p className="text-xs text-sage-600">Gesamtwert</p>
                </div>
              </div>

              {/* Aktionen */}
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Link href={`/partner/collections/${collection.id}`}>
                    <Edit className="w-4 h-4 mr-1" />
                    Bearbeiten
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1 bg-gold-600 hover:bg-gold-700">
                  <Link href={`/partner/quotes/new?collection=${collection.id}`}>Angebot erstellen</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
