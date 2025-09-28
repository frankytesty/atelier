"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-ivory-50 to-sage-50 flex items-center justify-center p-4">
      <Card className="modern-card max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-display text-charcoal-900">Oops! Ein Fehler ist aufgetreten</CardTitle>
          <CardDescription className="text-sage-600">
            Es tut uns leid, aber etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Fehler:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Fehler-ID: {error.digest}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={reset}
              className="flex-1 btn-modern"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Erneut versuchen
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/'
                }
              }}
              className="flex-1 glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50"
            >
              Zur Startseite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
