import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { CollectionEditor } from "@/components/collections/collection-editor"

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Lade Kollektion mit Produkten
  const { data: collection } = await supabase
    .from("collections")
    .select(`
      *,
      collection_products(
        id,
        quantity,
        personalization_data,
        notes,
        product:products(
          *,
          category:categories(name, slug),
          variants:product_variants(*)
        )
      )
    `)
    .eq("id", params.id)
    .eq("partner_id", user.id)
    .single()

  if (!collection) {
    notFound()
  }

  // Lade alle verfügbaren Produkte
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug),
      variants:product_variants(*)
    `)
    .eq("is_active", true)
    .order("name")

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-charcoal-900 mb-2">Kollektion bearbeiten</h1>
        <p className="text-sage-600 text-lg">"{collection.name}" anpassen und Produkte verwalten</p>
      </div>

      <CollectionEditor mode="edit" initialData={collection} products={products || []} />
    </div>
  )
}
