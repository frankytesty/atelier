"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function SessionListener() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const { data } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [router])

  return null
}


