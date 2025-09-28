"use client"

import { Badge } from "@/components/ui/badge"
import { Clock, Send, Eye, CheckCircle, X, AlertTriangle } from "lucide-react"

interface QuoteStatusBadgeProps {
  status: string
  showIcon?: boolean
}

export function QuoteStatusBadge({ status, showIcon = true }: QuoteStatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: "Entwurf",
      variant: "outline" as const,
      className: "text-gray-600 border-gray-200",
      icon: Clock,
    },
    sent: {
      label: "Gesendet",
      variant: "default" as const,
      className: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Send,
    },
    viewed: {
      label: "Angesehen",
      variant: "default" as const,
      className: "bg-purple-100 text-purple-700 border-purple-200",
      icon: Eye,
    },
    accepted: {
      label: "Angenommen",
      variant: "default" as const,
      className: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle,
    },
    rejected: {
      label: "Abgelehnt",
      variant: "outline" as const,
      className: "text-red-600 border-red-200 bg-red-50",
      icon: X,
    },
    expired: {
      label: "Abgelaufen",
      variant: "outline" as const,
      className: "text-orange-600 border-orange-200 bg-orange-50",
      icon: AlertTriangle,
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
