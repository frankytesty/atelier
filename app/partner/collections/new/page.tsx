import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CollectionEditor } from "@/components/collections/collection-editor"

export default async function NewCollectionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Lade verfügbare Produkte
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
        <h1 className="font-display text-4xl text-charcoal-900 mb-2">Neue Kollektion erstellen</h1>
        <p className="text-sage-600 text-lg">
          Wählen Sie Produkte aus und erstellen Sie eine personalisierte Kollektion
        </p>
      </div>

      <CollectionEditor mode="create" products={products || []} />
    </div>
  )
}
