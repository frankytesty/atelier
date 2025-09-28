import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { QuoteDetails } from "@/components/quotes/quote-details"
import { QuotePreview } from "@/components/quotes/quote-preview"

interface QuotePageProps {
  params: {
    id: string
  }
}

export default async function QuotePage({ params }: QuotePageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Lade Angebot mit allen Details
  const { data: quote } = await supabase
    .from("quotes")
    .select(`
      *,
      collection:collections(
        *,
        collection_products(
          *,
          product:products(
            *,
            category:categories(name)
          )
        )
      )
    `)
    .eq("id", params.id)
    .eq("partner_id", user.id)
    .single()

  if (!quote) {
    notFound()
  }

  // Lade Partner-Daten für Branding
  const { data: partner } = await supabase.from("partners").select("*").eq("id", user.id).single()

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <QuoteDetails quote={quote} partner={partner} />
        </div>
        <div>
          <QuotePreview quote={quote} partner={partner} />
        </div>
      </div>
    </div>
  )
}
