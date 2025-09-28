import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuotesList } from "@/components/quotes/quotes-list"
import { QuotesHeader } from "@/components/quotes/quotes-header"

export default async function QuotesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Lade Partner-Daten
  const { data: partner } = await supabase.from("partners").select("*").eq("id", user.id).single()

  if (!partner) {
    redirect("/auth/register")
  }

  // Lade Angebote mit Kollektionsdaten
  const { data: quotes } = await supabase
    .from("quotes")
    .select(`
      *,
      collection:collections(
        name,
        collection_products(
          quantity,
          personalization_data,
          product:products(
            name,
            base_price,
            images,
            category:categories(name)
          )
        )
      )
    `)
    .eq("partner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-6 py-8">
      <QuotesHeader />
      <QuotesList quotes={quotes || []} />
    </div>
  )
}
