"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function AdminSetupPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "super_admin"
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Fehler beim Erstellen des Admin-Benutzers")
      }

      toast({
        title: "Admin-Benutzer erstellt",
        description: "Sie können jetzt auf das Admin-Panel zugreifen.",
      })

      router.push("/admin/dashboard")
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-sage-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-sage-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="font-display text-2xl text-charcoal-900">
            Admin-Setup
          </CardTitle>
          <p className="text-sage-600 mt-2">
            Erstellen Sie Ihren ersten Admin-Benutzer
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@atelier-luminform.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Vollständiger Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Max Mustermann"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rolle</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Hinweis</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Sie müssen bereits als normaler Benutzer angemeldet sein, um einen Admin-Benutzer zu erstellen.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={isLoading}
            >
              {isLoading ? "Wird erstellt..." : "Admin-Benutzer erstellen"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-sage-600">
              Nach der Erstellung können Sie auf{" "}
              <a href="/admin/dashboard" className="text-red-600 hover:underline">
                /admin/dashboard
              </a>{" "}
              zugreifen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
