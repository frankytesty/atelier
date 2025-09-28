import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PartnerNavigation } from "@/components/navigation/partner-navigation"

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.log("[partner/layout] no user, redirecting to /auth/login")
    redirect("/auth/login")
  }

  // Lade Partner-Profil
  const { data: partner, error: partnerError } = await supabase.from("partners").select("*").eq("id", user.id).single()
  console.log("[partner/layout] user:", user?.id, " partner:", partner ? partner.id : null, " error:", partnerError?.message)

  let ensuredPartner = partner
  if (!ensuredPartner) {
    // Fallback: Partner-Datensatz automatisch anlegen, falls noch nicht vorhanden
    const insertPayload = {
      id: user.id,
      email: user.email,
      company_name: (user.user_metadata as any)?.company_name || "Partner",
      contact_person: (user.user_metadata as any)?.contact_person || user.email?.split("@")[0] || "",
      status: "approved" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const { data: created } = await supabase.from("partners").insert([insertPayload]).select("*").single()
    ensuredPartner = created || null
  }

  if (!ensuredPartner) {
    redirect("/auth/apply")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-sage-50">
      <PartnerNavigation partner={ensuredPartner} />
      <main>{children}</main>
    </div>
  )
}
