import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: order, error } = await supabase
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status, client_name, client_email, client_phone, event_date, delivery_address, notes } = body

    // Überprüfe ob Bestellung dem Benutzer gehört
    const { data: existingOrder } = await supabase.from("orders").select("partner_id").eq("id", params.id).single()

    if (!existingOrder || existingOrder.partner_id !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status,
        client_name,
        client_email,
        client_phone,
        event_date,
        delivery_address,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Überprüfe ob Bestellung dem Benutzer gehört
    const { data: existingOrder } = await supabase.from("orders").select("partner_id").eq("id", params.id).single()

    if (!existingOrder || existingOrder.partner_id !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Lösche zuerst alle order_items
    await supabase.from("order_items").delete().eq("order_id", params.id)

    // Dann lösche die Bestellung
    const { error } = await supabase.from("orders").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
