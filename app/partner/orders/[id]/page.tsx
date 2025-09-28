import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { OrderDetails } from "@/components/orders/order-details"
import { OrderTimeline } from "@/components/orders/order-timeline"
import { OrderCommunication } from "@/components/orders/order-communication"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Lade Bestellung mit allen Details
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        product:products (
          *,
          category:categories (name)
        ),
        variant:product_variants (*)
      )
    `)
    .eq("id", params.id)
    .eq("partner_id", user.id)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <OrderDetails order={order} />
          <OrderTimeline order={order} />
        </div>
        <div>
          <OrderCommunication order={order} />
        </div>
      </div>
    </div>
  )
}
