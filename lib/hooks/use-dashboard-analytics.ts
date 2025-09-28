"use client"

import { useState, useEffect } from "react"

interface DashboardStats {
  totalCollections: number
  totalOrders: number
  totalQuotes: number
  totalMicrosites: number
  totalRevenue: number
  pendingOrders: number
  activeQuotes: number
  publishedMicrosites: number
  newCollectionsThisMonth: number
  newOrdersThisMonth: number
  newQuotesThisMonth: number
  totalMicrositeVisits: number
  quoteToOrderConversion: number
}

interface MonthlyTrend {
  month: string
  orders: number
  quotes: number
  revenue: number
}

interface RecentActivity {
  orders: any[]
  quotes: any[]
}

export function useDashboardAnalytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({ orders: [], quotes: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/analytics/dashboard")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analytics")
      }

      setStats(data.stats)
      setMonthlyTrends(data.monthlyTrends)
      setRecentActivity(data.recentActivity)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return {
    stats,
    monthlyTrends,
    recentActivity,
    isLoading,
    error,
    refetch: fetchAnalytics,
  }
}
