import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/auth/login")

    const { data: partner } = await supabase.from("partners").select("*").eq("id", user.id).single()

    if (!partner) redirect("/auth/apply")

    return (
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-charcoal-900 mb-2">Analytics Dashboard</h1>
          <p className="text-sage-600">Detaillierte Einblicke in Ihre Geschäftsentwicklung und Performance-Metriken.</p>
        </div>

        <AnalyticsDashboard partnerId={partner.id} />
      </div>
    )
  } catch (error) {
    console.error("Analytics page error:", error)
    redirect("/auth/login")
  }
}
