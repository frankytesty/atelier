"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-ivory-50 to-sage-50 flex items-center justify-center p-4">
      <Card className="modern-card max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gold-600" />
          </div>
          <CardTitle className="text-2xl font-display text-charcoal-900">404 - Seite nicht gefunden</CardTitle>
          <CardDescription className="text-sage-600">
            Die gesuchte Seite konnte leider nicht gefunden werden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sage-700 mb-6">
              Möglicherweise wurde die Seite verschoben oder existiert nicht mehr.
            </p>
            <div className="flex gap-3">
              <Button asChild className="flex-1 btn-modern">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Zur Startseite
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex-1 glass-morphism border-gold-300 text-gold-700 hover:bg-gold-50"
              >
                Zurück
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
