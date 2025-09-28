"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()

      // Anmelden
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError("Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre Eingaben.")
        return
      }

      if (!data.user) {
        setError("Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.")
        return
      }

      // Prüfe Admin-Berechtigung
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (adminError || !adminUser) {
        setError("Sie haben keine Admin-Berechtigung für dieses System.")
        await supabase.auth.signOut()
        return
      }

      if (!adminUser.is_active) {
        setError("Ihr Admin-Konto ist deaktiviert. Wenden Sie sich an einen Super-Admin.")
        await supabase.auth.signOut()
        return
      }

      toast.success(`Willkommen zurück, ${adminUser.full_name}!`)
      
      // Weiterleitung zum Admin-Dashboard
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError("Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Zurück zur normalen Login-Seite */}
        <div className="mb-6">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zur normalen Anmeldung
          </Link>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-display text-charcoal-900">
                Admin-Anmeldung
              </CardTitle>
              <CardDescription className="text-sage-600">
                Zugang zum Admin-Bereich von Atelier Luminform
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-charcoal-700">
                  Admin-E-Mail
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@atelier-luminform.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-sage-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-charcoal-700">
                  Passwort
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-sage-200 focus:border-red-500 focus:ring-red-500"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-sage-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-sage-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Anmeldung läuft...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin-Bereich betreten
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-sage-500">
                Nur autorisierte Administratoren haben Zugang zu diesem Bereich.
                <br />
                Bei Problemen wenden Sie sich an den System-Administrator.
              </p>
              <div className="mt-4 pt-4 border-t border-sage-200">
                <Link 
                  href="/auth/admin/setup"
                  className="text-sm text-red-600 hover:text-red-700 hover:underline"
                >
                  Ersten Admin-Benutzer erstellen
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Atelier Luminform. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  )
}
