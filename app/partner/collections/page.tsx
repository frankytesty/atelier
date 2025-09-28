import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CollectionsList } from "@/components/collections/collections-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function CollectionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Lade Partner-Profil
  const { data: partner } = await supabase.from("partners").select("*").eq("id", user.id).single()

  if (!partner) {
    redirect("/auth/login")
  }

  // Lade Kollektionen mit Produkten und Statistiken
  const { data: collections } = await supabase
    .from("collections")
    .select(`
      *,
      collection_products(
        id,
        quantity,
        personalization_data,
        product:products(
          id,
          name,
          base_price,
          images,
          category:categories(name)
        )
      )
    `)
    .eq("partner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-charcoal-900 mb-2">Meine Kollektionen</h1>
          <p className="text-sage-600 text-lg">Erstellen und verwalten Sie personalisierte Produktkollektionen</p>
        </div>
        <Button asChild className="bg-gold-600 hover:bg-gold-700">
          <Link href="/partner/collections/new">
            <Plus className="w-4 h-4 mr-2" />
            Neue Kollektion
          </Link>
        </Button>
      </div>

      <CollectionsList collections={collections || []} />
    </div>
  )
}
