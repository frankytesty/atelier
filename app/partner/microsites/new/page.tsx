import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MicrositeBuilder } from "@/components/microsites/microsite-builder"

export default async function NewMicrositePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Lade verfügbare Kollektionen und Brand Kits
  const [collectionsResult, brandKitsResult] = await Promise.all([
    supabase.from("collections").select("*").eq("partner_id", user.id).order("created_at", { ascending: false }),
    supabase.from("brand_kits").select("*").eq("partner_id", user.id).order("created_at", { ascending: false }),
  ])

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-charcoal-900 mb-2">Neue Microsite erstellen</h1>
        <p className="text-sage-600 text-lg">
          Erstellen Sie eine personalisierte Website für Ihre Kunden mit Ihrer Kollektion
        </p>
      </div>

      <MicrositeBuilder
        collections={collectionsResult.data || []}
        brandKits={brandKitsResult.data || []}
        mode="create"
      />
    </div>
  )
}
