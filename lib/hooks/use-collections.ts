"use client"

import { useState, useEffect } from "react"

interface Collection {
  id: string
  name: string
  description?: string
  is_public: boolean
  created_at: string
  collection_products: any[]
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/collections")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch collections")
      }

      setCollections(data.collections)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const createCollection = async (collectionData: {
    name: string
    description?: string
    is_public?: boolean
  }) => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectionData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create collection")
      }

      await fetchCollections() // Refresh list
      return data.collection
    } catch (err) {
      throw err
    }
  }

  const addProductToCollection = async (
    collectionId: string,
    productData: {
      product_id: string
      quantity?: number
      personalization_data?: any
      notes?: string
    },
  ) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product to collection")
      }

      await fetchCollections() // Refresh list
      return data.collectionProduct
    } catch (err) {
      throw err
    }
  }

  const removeProductFromCollection = async (collectionId: string, productId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/products?product_id=${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to remove product from collection")
      }

      await fetchCollections() // Refresh list
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return {
    collections,
    isLoading,
    error,
    refetch: fetchCollections,
    createCollection,
    addProductToCollection,
    removeProductFromCollection,
  }
}
