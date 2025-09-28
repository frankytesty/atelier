"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutDashboard, Users, Settings, Shield, User, LogOut, Menu, X, ShoppingCart, Quote, BarChart3, Package, UserCog, Activity } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface AdminNavigationProps {
  adminUser: AdminUser
}

export function AdminNavigation({ adminUser }: AdminNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/admin")
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Mandanten", href: "/admin/tenants", icon: Users, badge: "Neu" },
    { name: "Partner", href: "/admin/partners", icon: Users },
    { name: "Bestellungen", href: "/admin/orders", icon: ShoppingCart },
    { name: "Angebote", href: "/admin/quotes", icon: Quote },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Produkte", href: "/admin/products", icon: Package },
    { name: "Admins", href: "/admin/users", icon: UserCog },
    { name: "Audit-Logs", href: "/admin/audit", icon: Activity },
    { name: "Einstellungen", href: "/admin/settings", icon: Settings },
  ]

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-red-100 text-red-700 text-xs">Super Admin</Badge>
      case "admin":
        return <Badge className="bg-blue-100 text-blue-700 text-xs">Admin</Badge>
      case "moderator":
        return <Badge className="bg-green-100 text-green-700 text-xs">Moderator</Badge>
      default:
        return null
    }
  }

  return (
    <>
             <nav className="nav-modern sticky top-0 z-50 pwa-safe-area-top">
               <div className="container-wide">
                 <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl text-gradient">Admin Panel</h1>
                <p className="text-xs text-sage-600">Atelier Luminform</p>
              </div>
            </Link>

                   {/* Desktop Navigation */}
                   <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                         <Link
                           key={item.name}
                           href={item.href}
                           className={cn(
                             "flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 touch-target",
                             isActive ? "bg-gold-100 text-gold-700 shadow-md" : "text-sage-600 hover:text-gold-700 hover:bg-gold-50",
                           )}
                         >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
                   <div className="flex items-center space-x-3">
                     {getRoleBadge(adminUser.role)}

                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gold-50 px-3 py-2 touch-target">
                           <div className="w-10 h-10 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center">
                             <User className="w-5 h-5 text-gold-600" />
                           </div>
                           <div className="hidden lg:block text-left">
                             <p className="text-sm font-medium text-charcoal-900 truncate max-w-[150px]">{adminUser.full_name}</p>
                             <p className="text-xs text-sage-600 truncate max-w-[150px]">{adminUser.email}</p>
                           </div>
                         </Button>
                       </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Einstellungen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

                     {/* Mobile Menu Button */}
                     <Button
                       variant="ghost"
                       size="sm"
                       className="lg:hidden"
                       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

               {/* Mobile Navigation */}
               {isMobileMenuOpen && (
                 <div className="lg:hidden border-t border-sage-200 bg-white">
                   <div className="container-wide py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                      isActive ? "bg-red-100 text-red-700" : "text-sage-600 hover:text-charcoal-900 hover:bg-sage-50",
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
