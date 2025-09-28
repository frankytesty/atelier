import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: quotes, error } = await supabase
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
              images
            )
          )
        )
      `)
      .eq("partner_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ quotes })
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
    const { collection_id, client_name, client_email, event_date, total_amount, valid_until, notes } = body

    // Generiere Angebotsnummer
    const { data: quoteNumber } = await supabase.rpc("generate_quote_number")

    const { data: quote, error } = await supabase
      .from("quotes")
      .insert([
        {
          partner_id: user.id,
          collection_id,
          quote_number: quoteNumber,
          client_name,
          client_email,
          event_date,
          total_amount,
          valid_until,
          notes,
          status: "draft",
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ quote }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
