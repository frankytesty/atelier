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

    const { data: microsites, error } = await supabase
      .from("microsites")
      .select(`
        *,
        collection:collections(name),
        brand_kit:brand_kits(name, primary_color),
        pages:microsite_pages(id, slug, title, is_published),
        visit_stats:microsite_visits(count)
      `)
      .eq("partner_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ microsites })
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
    const {
      title,
      description,
      subdomain,
      custom_domain,
      collection_id,
      brand_kit_id,
      contact_email,
      contact_phone,
      is_published,
      is_password_protected,
      password,
      hero_image_url,
      logo_url,
    } = body

    // Hash password if provided
    let password_hash = null
    if (is_password_protected && password) {
      // In production, use proper password hashing
      password_hash = Buffer.from(password).toString("base64")
    }

    const { data: microsite, error } = await supabase
      .from("microsites")
      .insert([
        {
          partner_id: user.id,
          title,
          description,
          subdomain,
          custom_domain,
          collection_id,
          brand_kit_id,
          contact_email,
          contact_phone,
          is_published: is_published || false,
          is_password_protected: is_password_protected || false,
          password_hash,
          hero_image_url,
          logo_url,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Erstelle Standard-Seiten
    const defaultPages = [
      {
        microsite_id: microsite.id,
        slug: "home",
        title: "Startseite",
        content: {
          sections: [
            {
              type: "hero",
              title: title,
              subtitle: description,
              image: hero_image_url,
            },
            {
              type: "collection",
              title: "Unsere Kollektion",
              collection_id: collection_id,
            },
            {
              type: "contact",
              title: "Kontakt",
              email: contact_email,
              phone: contact_phone,
            },
          ],
        },
      },
    ]

    await supabase.from("microsite_pages").insert(defaultPages)

    return NextResponse.json({ microsite }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
