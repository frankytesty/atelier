import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersHeader } from "@/components/orders/orders-header"

export default async function OrdersPage() {
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

  // Lade Bestellungen mit Bestellpositionen
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        product:products (
          name,
          images,
          category:categories (name)
        )
      )
    `)
    .eq("partner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-6 py-8">
      <OrdersHeader />
      <OrdersList orders={orders || []} />
    </div>
  )
}
