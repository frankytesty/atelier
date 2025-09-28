import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { QuoteCreate } from "@/components/quotes/quote-create"

export default async function NewQuotePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: collections } = await supabase
    .from("collections")
    .select("id, name")
    .eq("partner_id", user.id)
    .order("created_at", { ascending: false })

  return <QuoteCreate collections={(collections || []).map((c) => ({ id: c.id, name: c.name }))} />
}