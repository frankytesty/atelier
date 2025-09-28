import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminNavigation } from "@/components/admin/admin-navigation"
import { AdminProductsManagement } from "@/components/admin/admin-products-management"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
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

    // Lade alle Produkte mit Kategorien
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(name),
        product_variants(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
    }

    // Lade Kategorien
    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .order("name")

    // Lade Statistiken
    const [totalProducts, activeProducts, totalCategories] = await Promise.all([
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
      supabase.from("categories").select("id", { count: "exact" }),
    ])

    const stats = {
      total: totalProducts.count || 0,
      active: activeProducts.count || 0,
      categories: totalCategories.count || 0,
    }

    return (
      <div className="min-h-screen bg-sage-50">
        <AdminNavigation adminUser={adminUser} />
        
        <div className="container-wide py-responsive">
          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal-900 mb-2">Produkt-Verwaltung</h1>
            <p className="text-sage-600">Verwalten Sie alle Produkte und Kategorien</p>
          </div>

          <AdminProductsManagement 
            products={products || []} 
            categories={categories || []}
            stats={stats}
            adminUser={adminUser}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin products page error:", error)
    redirect("/auth/admin")
  }
}
