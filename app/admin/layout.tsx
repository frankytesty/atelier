import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNavigation } from "@/components/admin/admin-navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Prüfe Admin-Berechtigung
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  // Wenn kein Admin-Benutzer existiert, zeige Setup-Seite
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sage-50">
        {children}
      </div>
    )
  }

  if (!adminUser.is_active) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-sage-50">
      <AdminNavigation adminUser={adminUser} />
      <main>{children}</main>
    </div>
  )
}
