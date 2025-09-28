import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, quantity, personalization_data, notes } = body

    // Überprüfe ob Kollektion dem Benutzer gehört
    const { data: collection } = await supabase.from("collections").select("partner_id").eq("id", params.id).single()

    if (!collection || collection.partner_id !== user.id) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    const { data: collectionProduct, error } = await supabase
      .from("collection_products")
      .insert([
        {
          collection_id: params.id,
          product_id,
          quantity: quantity || 1,
          personalization_data: personalization_data || {},
          notes,
        },
      ])
      .select(`
        *,
        product:products(
          id,
          name,
          base_price,
          images,
          category:categories(name)
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collectionProduct }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product_id")

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    // Überprüfe ob Kollektion dem Benutzer gehört
    const { data: collection } = await supabase.from("collections").select("partner_id").eq("id", params.id).single()

    if (!collection || collection.partner_id !== user.id) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    const { error } = await supabase
      .from("collection_products")
      .delete()
      .eq("collection_id", params.id)
      .eq("product_id", productId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
