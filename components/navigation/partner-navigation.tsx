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
import {
  Home,
  Package,
  FileText,
  ShoppingCart,
  Palette,
  ExternalLink,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Partner {
  id: string
  company_name: string
  contact_person: string
  status: string
}

interface PartnerNavigationProps {
  partner: Partner
}

export function PartnerNavigation({ partner }: PartnerNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/partner/dashboard", icon: Home },
    { name: "Katalog", href: "/partner/catalog", icon: Package },
    { name: "Kollektionen", href: "/partner/collections", icon: FileText },
    { name: "Bestellungen", href: "/partner/orders", icon: ShoppingCart },
    { name: "Brand Kit", href: "/partner/brand-kit", icon: Palette },
    { name: "Microsites", href: "/partner/microsites", icon: ExternalLink },
    { name: "Analytics", href: "/partner/analytics", icon: BarChart3 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700 text-xs">Genehmigt</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 text-xs">Ausstehend</Badge>
      default:
        return null
    }
  }

  return (
    <>
      <nav className="bg-white border-b border-sage-200 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/partner/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AL</span>
              </div>
              <div>
                <h1 className="font-display text-xl text-charcoal-900">Atelier Luminform</h1>
                <p className="text-xs text-sage-600">Partner Portal</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                      isActive ? "bg-gold-100 text-gold-700" : "text-sage-600 hover:text-charcoal-900 hover:bg-sage-50",
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {getStatusBadge(partner.status)}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-sage-50">
                    <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-sage-600" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-charcoal-900">{partner.contact_person}</p>
                      <p className="text-xs text-sage-600">{partner.company_name}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/partner/settings" className="flex items-center">
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
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-sage-200 bg-white">
            <div className="container mx-auto px-6 py-4 space-y-2">
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
                      isActive ? "bg-gold-100 text-gold-700" : "text-sage-600 hover:text-charcoal-900 hover:bg-sage-50",
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
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
