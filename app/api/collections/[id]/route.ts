import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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
    const { name, description, is_public } = body

    // Überprüfe ob Kollektion dem Benutzer gehört
    const { data: collection } = await supabase.from("collections").select("partner_id").eq("id", params.id).single()

    if (!collection || collection.partner_id !== user.id) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    const { data: updatedCollection, error } = await supabase
      .from("collections")
      .update({
        name,
        description,
        is_public: is_public || false,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ collection: updatedCollection })
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

    // Überprüfe ob Kollektion dem Benutzer gehört
    const { data: collection } = await supabase.from("collections").select("partner_id").eq("id", params.id).single()

    if (!collection || collection.partner_id !== user.id) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Lösche zuerst alle collection_products
    await supabase.from("collection_products").delete().eq("collection_id", params.id)

    // Dann lösche die Kollektion
    const { error } = await supabase.from("collections").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
