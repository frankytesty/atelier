import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-sage-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-sage-200 shadow-xl text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="font-display text-2xl text-charcoal-900">Bewerbung eingegangen!</CardTitle>
            <CardDescription className="text-sage-600">
              Vielen Dank für Ihr Interesse an Atelier Luminform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-charcoal-700 leading-relaxed">
              Ihre Bewerbung wurde erfolgreich eingereicht. Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link, den
              wir Ihnen gesendet haben.
            </p>
            <p className="text-sm text-sage-600">
              Unser Team wird Ihre Bewerbung innerhalb von 2-3 Werktagen prüfen und sich bei Ihnen melden.
            </p>
            <div className="pt-4">
              <Link href="/" className="text-gold-600 hover:text-gold-700 font-medium underline underline-offset-4">
                Zurück zur Startseite
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
