"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit, Package } from "lucide-react"

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

interface CollectionProductsListProps {
  products: CollectionProduct[]
  onRemoveProduct: (productId: string) => void
  onUpdateProduct: (productId: string, updates: Partial<CollectionProduct>) => void
}

export function CollectionProductsList({ products, onRemoveProduct, onUpdateProduct }: CollectionProductsListProps) {
  const [editingProduct, setEditingProduct] = useState<CollectionProduct | null>(null)
  const [editQuantity, setEditQuantity] = useState(1)
  const [editColor, setEditColor] = useState("")
  const [editMaterial, setEditMaterial] = useState("")
  const [editNotes, setEditNotes] = useState("")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const handleEditProduct = (product: CollectionProduct) => {
    setEditingProduct(product)
    setEditQuantity(product.quantity)
    setEditColor(product.personalization_data?.color || "defaultColor")
    setEditMaterial(product.personalization_data?.material || "defaultMaterial")
    setEditNotes(product.personalization_data?.notes || product.notes || "")
  }

  const handleSaveEdit = () => {
    if (!editingProduct) return

    const updates = {
      quantity: editQuantity,
      personalization_data: {
        color: editColor,
        material: editMaterial,
        notes: editNotes,
      },
      notes: editNotes,
    }

    onUpdateProduct(editingProduct.product.id, updates)
    setEditingProduct(null)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
          <Package className="w-6 h-6 text-sage-400" />
        </div>
        <p className="text-sage-600 mb-2">Noch keine Produkte ausgewählt</p>
        <p className="text-sm text-sage-500">Wählen Sie Produkte aus der Liste links aus</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {products.map((item) => {
        const totalPrice = item.product.base_price * item.quantity
        return (
          <div key={item.product.id} className="border border-sage-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={item.product.images[0] || "/placeholder.svg?height=48&width=48&query=wedding product"}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-charcoal-900 truncate">{item.product.name}</h4>
                <p className="text-sm text-sage-600 truncate">{item.product.short_description}</p>

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {item.quantity}x
                  </Badge>
                  {item.personalization_data?.color && (
                    <Badge variant="outline" className="text-xs">
                      {item.personalization_data.color}
                    </Badge>
                  )}
                  {item.personalization_data?.material && (
                    <Badge variant="outline" className="text-xs">
                      {item.personalization_data.material}
                    </Badge>
                  )}
                </div>

                {(item.personalization_data?.notes || item.notes) && (
                  <p className="text-xs text-sage-500 mt-1 line-clamp-2">
                    {item.personalization_data?.notes || item.notes}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-charcoal-900">{formatPrice(totalPrice)}</span>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditProduct(item)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-display text-xl text-charcoal-900">
                            Produkt bearbeiten
                          </DialogTitle>
                        </DialogHeader>

                        {editingProduct && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-16 h-16">
                                <Image
                                  src={
                                    editingProduct.product.images[0] ||
                                    "/placeholder.svg?height=64&width=64&query=wedding product"
                                  }
                                  alt={editingProduct.product.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-charcoal-900">{editingProduct.product.name}</h3>
                                <p className="text-sm text-sage-600">
                                  {formatPrice(editingProduct.product.base_price)}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <Label htmlFor="edit-quantity">Anzahl</Label>
                                <Input
                                  id="edit-quantity"
                                  type="number"
                                  min="1"
                                  value={editQuantity}
                                  onChange={(e) => setEditQuantity(Number.parseInt(e.target.value) || 1)}
                                  className="border-sage-200"
                                />
                              </div>

                              {editingProduct.product.colors.length > 0 && (
                                <div>
                                  <Label htmlFor="edit-color">Farbe</Label>
                                  <Select value={editColor} onValueChange={setEditColor}>
                                    <SelectTrigger className="border-sage-200">
                                      <SelectValue placeholder="Farbe wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="defaultColor">Keine Auswahl</SelectItem>
                                      {editingProduct.product.colors.map((color) => (
                                        <SelectItem key={color} value={color}>
                                          {color}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              {editingProduct.product.materials.length > 0 && (
                                <div>
                                  <Label htmlFor="edit-material">Material</Label>
                                  <Select value={editMaterial} onValueChange={setEditMaterial}>
                                    <SelectTrigger className="border-sage-200">
                                      <SelectValue placeholder="Material wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="defaultMaterial">Keine Auswahl</SelectItem>
                                      {editingProduct.product.materials.map((material) => (
                                        <SelectItem key={material} value={material}>
                                          {material}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}

                              <div>
                                <Label htmlFor="edit-notes">Notizen</Label>
                                <Textarea
                                  id="edit-notes"
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
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
                                onClick={() => setEditingProduct(null)}
                              >
                                Abbrechen
                              </Button>
                              <Button
                                type="button"
                                onClick={handleSaveEdit}
                                className="flex-1 bg-gold-600 hover:bg-gold-700"
                              >
                                Speichern
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveProduct(item.product.id)}
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
