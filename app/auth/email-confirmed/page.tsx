"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function EmailConfirmedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-sage-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-md border-sage-200 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="font-display text-2xl text-charcoal-900">E-Mail bestätigt!</CardTitle>
          <CardDescription className="text-sage-600">
            Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können sich jetzt anmelden.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 text-center">
              Ihre Registrierung ist abgeschlossen. Willkommen bei Atelier Luminform!
            </p>
          </div>

          <Button asChild className="w-full bg-gold-600 hover:bg-gold-700 text-white">
            <Link href="/auth/login">Jetzt anmelden</Link>
          </Button>

          <div className="text-center">
            <Link href="/" className="text-sm text-sage-600 hover:text-sage-700 underline underline-offset-4">
              Zurück zur Startseite
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
