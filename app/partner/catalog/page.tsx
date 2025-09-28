import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductCatalog } from "@/components/catalog/product-catalog"

export default async function CatalogPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Lade Kategorien und Produkte
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order")

  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug),
      variants:product_variants(*)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-sage-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-charcoal-900 mb-4">Produktkatalog</h1>
          <p className="text-sage-600 text-lg leading-relaxed">
            Entdecken Sie unsere exklusive Auswahl an personalisierbaren Hochzeitsartikeln
          </p>
        </div>

        <ProductCatalog categories={categories || []} products={products || []} />
      </div>
    </div>
  )
}
