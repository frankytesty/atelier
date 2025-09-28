import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TenantsManagement } from "@/components/admin/tenants-management"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export const dynamic = "force-dynamic"

export default async function TenantsPage() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/auth/admin")

    // Prüfe Admin-Berechtigung
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    if (!adminUser || !adminUser.is_active) {
      redirect("/auth/admin")
    }

    // Lade alle Partner mit erweiterten Informationen
    const { data: partners, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading partners:", error)
      throw error
    }

    // Handler für Partner-Updates
    const handlePartnerUpdate = async (partnerId: string, updates: any) => {
      "use server"
      
      const supabase = await createClient()
      const { error } = await supabase
        .from("partners")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", partnerId)

      if (error) {
        console.error("Error updating partner:", error)
        throw error
      }

      // Log die Aktion
      await supabase
        .from("admin_audit_logs")
        .insert({
          admin_id: user.id,
          action: `Partner ${partnerId} aktualisiert`,
          resource_type: "partner",
          resource_id: partnerId,
          new_values: updates
        })
    }

    // Handler für Partner-Löschung
    const handlePartnerDelete = async (partnerId: string) => {
      "use server"
      
      const supabase = await createClient()
      
      // Log die Aktion vor dem Löschen
      await supabase
        .from("admin_audit_logs")
        .insert({
          admin_id: user.id,
          action: `Partner ${partnerId} gelöscht`,
          resource_type: "partner",
          resource_id: partnerId
        })

      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", partnerId)

      if (error) {
        console.error("Error deleting partner:", error)
        throw error
      }
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <TenantsManagement 
            partners={partners || []}
            onPartnerUpdate={handlePartnerUpdate}
            onPartnerDelete={handlePartnerDelete}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Tenants page error:", error)
    redirect("/auth/admin")
  }
}
