import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BrandKitManager } from "@/components/brand-kit/brand-kit-manager"

export const dynamic = "force-dynamic"

export default async function BrandKitPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/auth/login")

    const { data: partner } = await supabase.from("partners").select("*").eq("id", user.id).single()

    if (!partner) redirect("/auth/apply")

    const { data: brandKits } = await supabase
      .from("brand_kits")
      .select("*")
      .eq("partner_id", partner.id)
      .order("created_at", { ascending: false })

    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Brand Kit</h1>
          <p className="text-sage-600">
            Verwalten Sie Ihre Markenidentität und erstellen Sie konsistente Designs für alle Ihre Projekte.
          </p>
        </div>

        <BrandKitManager brandKits={brandKits || []} partnerId={partner.id} />
      </div>
    )
  } catch (error) {
    console.error("Brand kit error:", error)
    redirect("/auth/login")
  }
}
