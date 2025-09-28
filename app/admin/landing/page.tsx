import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowRight, Lock, Users, BarChart3, Settings } from "lucide-react"

export default function AdminLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-display text-white mb-4">
            Admin-Bereich
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Willkommen im Verwaltungsbereich von Atelier Luminform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Mandanten-Management</CardTitle>
              <CardDescription>
                Verwalten Sie alle Partner und deren Status zentral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-sage-600 space-y-2">
                <li>• Partner-Genehmigungen</li>
                <li>• Status-Verwaltung</li>
                <li>• Detaillierte Analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Analytics & Berichte</CardTitle>
              <CardDescription>
                Umfassende Einblicke in Ihre Partner-Basis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-sage-600 space-y-2">
                <li>• Registrierungsverlauf</li>
                <li>• Branchen-Analyse</li>
                <li>• Performance-Metriken</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">System-Verwaltung</CardTitle>
              <CardDescription>
                Vollständige Kontrolle über Ihr System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-sage-600 space-y-2">
                <li>• System-Einstellungen</li>
                <li>• Audit-Logs</li>
                <li>• Benutzer-Verwaltung</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-display text-charcoal-900">
              Admin-Zugang
            </CardTitle>
            <CardDescription className="text-sage-600">
              Melden Sie sich an, um auf den Admin-Bereich zuzugreifen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                <Link href="/auth/admin" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Admin-Anmeldung
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="text-center pt-6 border-t border-sage-200">
              <p className="text-sm text-sage-600 mb-4">
                Erste Einrichtung des Systems?
              </p>
              <Link 
                href="/auth/admin/setup"
                className="text-red-600 hover:text-red-700 hover:underline font-medium"
              >
                Ersten Admin-Benutzer erstellen
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Atelier Luminform. Alle Rechte vorbehalten.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Zur Hauptseite
            </Link>
            <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors">
              Partner-Anmeldung
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
