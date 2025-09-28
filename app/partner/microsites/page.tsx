import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MicrositesList } from "@/components/microsites/microsites-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function MicrositesPage() {
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

  // Lade Microsites mit Statistiken
  const { data: microsites } = await supabase
    .from("microsites")
    .select(`
      *,
      collection:collections(name),
      brand_kit:brand_kits(name, primary_color),
      visit_count:microsite_visits(count)
    `)
    .eq("partner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-charcoal-900 mb-2">Meine Microsites</h1>
          <p className="text-sage-600 text-lg">Erstellen und verwalten Sie personalisierte Websites für Ihre Kunden</p>
        </div>
        <Button asChild className="bg-gold-600 hover:bg-gold-700">
          <Link href="/partner/microsites/new">
            <Plus className="w-4 h-4 mr-2" />
            Neue Microsite
          </Link>
        </Button>
      </div>

      <MicrositesList microsites={microsites || []} />
    </div>
  )
}
