import { OrderCreate } from "@/components/orders/order-create"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewOrderPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch collections for the order form
  const { data: collections, error } = await supabase
    .from("collections")
    .select("id, name")
    .eq("partner_id", user.id)

  if (error) {
    console.error("Error fetching collections for new order:", error)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="font-display text-4xl text-charcoal-900 mb-6">Neue Bestellung erstellen</h1>
      <OrderCreate collections={collections || []} />
    </div>
  )
}

