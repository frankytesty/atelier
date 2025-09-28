"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle, Package, Truck, Home, X } from "lucide-react"

interface OrderStatusBadgeProps {
  status: string
  showIcon?: boolean
}

export function OrderStatusBadge({ status, showIcon = true }: OrderStatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: "Entwurf",
      variant: "outline" as const,
      className: "text-gray-600 border-gray-200",
      icon: Clock,
    },
    pending: {
      label: "Ausstehend",
      variant: "outline" as const,
      className: "text-orange-600 border-orange-200 bg-orange-50",
      icon: AlertCircle,
    },
    confirmed: {
      label: "Bestätigt",
      variant: "default" as const,
      className: "bg-blue-100 text-blue-700 border-blue-200",
      icon: CheckCircle,
    },
    in_production: {
      label: "In Produktion",
      variant: "default" as const,
      className: "bg-purple-100 text-purple-700 border-purple-200",
      icon: Package,
    },
    shipped: {
      label: "Versendet",
      variant: "default" as const,
      className: "bg-green-100 text-green-700 border-green-200",
      icon: Truck,
    },
    delivered: {
      label: "Geliefert",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 border-green-200",
      icon: Home,
    },
    cancelled: {
      label: "Storniert",
      variant: "outline" as const,
      className: "text-red-600 border-red-200 bg-red-50",
      icon: X,
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  )
}
