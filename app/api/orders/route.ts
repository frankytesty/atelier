import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
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

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,client_name.ilike.%${search}%,client_email.ilike.%${search}%`)
    }

    const { data: orders, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { client_name, client_email, client_phone, event_date, delivery_address, notes, order_items } = body

    // Generiere Bestellnummer
    const { data: orderNumberResult } = await supabase.rpc("generate_order_number")
    const order_number = orderNumberResult

    // Berechne Gesamtbetrag (0 wenn keine Items)
    const total_amount = order_items ? order_items.reduce((sum: number, item: any) => sum + item.unit_price * item.quantity, 0) : 0

    // Erstelle Bestellung
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        partner_id: user.id,
        order_number,
        client_name,
        client_email,
        client_phone,
        event_date,
        delivery_address,
        notes,
        total_amount,
        status: "draft",
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Erstelle Bestellpositionen (nur wenn vorhanden)
    if (order_items && order_items.length > 0) {
      const orderItemsWithOrderId = order_items.map((item: any) => ({
        ...item,
        order_id: order.id,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsWithOrderId)

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
