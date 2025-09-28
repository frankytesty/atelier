import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PublicQuoteView } from "@/components/quotes/public-quote-view"

interface PublicQuotePageProps {
  params: {
    id: string
  }
}

export default async function PublicQuotePage({ params }: PublicQuotePageProps) {
  const supabase = await createClient()

  // Lade Angebot mit Partner-Daten (ohne Auth-Check für öffentliche Ansicht)
  const { data: quote } = await supabase
    .from("quotes")
    .select(`
      *,
      partner:partners(*),
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
    .single()

  if (!quote) {
    notFound()
  }

  // Nur gesendete oder angesehene Angebote sind öffentlich sichtbar
  if (!["sent", "viewed", "accepted", "rejected"].includes(quote.status)) {
    notFound()
  }

  // Markiere Angebot als angesehen, wenn es noch nicht angesehen wurde
  if (quote.status === "sent") {
    await supabase.from("quotes").update({ status: "viewed" }).eq("id", params.id)
  }

  return <PublicQuoteView quote={quote} />
}
