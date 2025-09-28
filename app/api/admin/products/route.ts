import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
      .from("products")
      .select(`
        *,
        category:categories(name),
        product_variants(*)
      `, { count: "exact" })

    if (category && category !== "all") {
      query = query.eq("category_id", category)
    }

    if (status && status !== "all") {
      query = query.eq("is_active", status === "active")
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: products, error, count } = await query
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      products: products || [], 
      total: count || 0
    })
  } catch (error) {
    console.error("Admin products API error:", error)
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

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, slug, description, base_price, category_id, images, is_active } = body

    if (!name || !slug || !base_price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Erstelle Produkt
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        base_price,
        category_id,
        images: images || [],
        is_active: is_active !== false,
      })
      .select(`
        *,
        category:categories(name),
        product_variants(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Erstelle Audit-Log
    await supabase.from("admin_audit_logs").insert({
      admin_id: user.id,
      action: "create",
      resource_type: "product",
      resource_id: product.id,
      new_values: { name, slug, base_price, category_id },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Admin products create API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { productId, updates } = body

    if (!productId || !updates) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Lade aktuelles Produkt für Audit-Log
    const { data: currentProduct } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Aktualisiere Produkt
    const { data: product, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", productId)
      .select(`
        *,
        category:categories(name),
        product_variants(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Erstelle Audit-Log
    await supabase.from("admin_audit_logs").insert({
      admin_id: user.id,
      action: "update",
      resource_type: "product",
      resource_id: productId,
      old_values: currentProduct,
      new_values: updates,
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Admin products update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!adminUser || !adminUser.is_active) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 })
    }

    // Lade Produkt für Audit-Log
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Lösche Produkt (und alle abhängigen Daten durch CASCADE)
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Erstelle Audit-Log
    await supabase.from("admin_audit_logs").insert({
      admin_id: user.id,
      action: "delete",
      resource_type: "product",
      resource_id: productId,
      old_values: product,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin products delete API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
