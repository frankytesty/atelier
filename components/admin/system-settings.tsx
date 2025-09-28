"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Database, Mail, Shield, Globe, Save, AlertCircle } from "lucide-react"

interface AdminUser {
  id: string
  role: string
  permissions: string[]
}

interface SystemSettingsProps {
  adminUser: AdminUser
}

export function SystemSettings({ }: SystemSettingsProps) {
  const [settings, setSettings] = useState({
    // Allgemeine Einstellungen
    siteName: "Atelier Luminform",
    siteDescription: "Exklusive Hochzeitseinladungen und Event-Papeterie",
    contactEmail: "kontakt@atelier-luminform.com",
    supportEmail: "support@atelier-luminform.com",

    // Partner-Einstellungen
    autoApprovePartners: false,
    requirePortfolio: true,
    minExperienceYears: 1,
    maxPendingDays: 7,

    // E-Mail-Einstellungen
    emailNotifications: true,
    welcomeEmailEnabled: true,
    approvalEmailEnabled: true,
    reminderEmailEnabled: true,

    // Sicherheitseinstellungen
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    passwordMinLength: 8,

    // System-Einstellungen
    maintenanceMode: false,
    debugMode: false,
    logLevel: "info",
    backupFrequency: "daily",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSave = async (section: string) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Hier würde normalerweise die API aufgerufen werden
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage({ type: "success", text: `${section} Einstellungen erfolgreich gespeichert.` })
    } catch (error) {
      setMessage({ type: "error", text: "Fehler beim Speichern der Einstellungen." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Allgemein
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Partner
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            E-Mail
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sicherheit
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Allgemeine Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Website-Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Kontakt E-Mail</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Website-Beschreibung</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                  className="border-sage-200 focus:border-gold-400"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support E-Mail</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
                  className="border-sage-200 focus:border-gold-400"
                />
              </div>
              <Button
                onClick={() => handleSave("Allgemeine")}
                disabled={isLoading}
                className="bg-gold-600 hover:bg-gold-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Partner-Verwaltung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Automatische Partner-Genehmigung</Label>
                  <p className="text-sm text-sage-600">Partner werden automatisch ohne manuelle Prüfung genehmigt</p>
                </div>
                <Switch
                  checked={settings.autoApprovePartners}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoApprovePartners: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Portfolio erforderlich</Label>
                  <p className="text-sm text-sage-600">
                    Partner müssen Portfolio-Bilder bei der Registrierung hochladen
                  </p>
                </div>
                <Switch
                  checked={settings.requirePortfolio}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, requirePortfolio: checked }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minExperienceYears">Mindest-Erfahrung (Jahre)</Label>
                  <Input
                    id="minExperienceYears"
                    type="number"
                    value={settings.minExperienceYears}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, minExperienceYears: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPendingDays">Max. Wartezeit (Tage)</Label>
                  <Input
                    id="maxPendingDays"
                    type="number"
                    value={settings.maxPendingDays}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, maxPendingDays: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSave("Partner")}
                disabled={isLoading}
                className="bg-gold-600 hover:bg-gold-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                E-Mail-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">E-Mail-Benachrichtigungen</Label>
                  <p className="text-sm text-sage-600">Automatische E-Mails an Partner und Administratoren</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Willkommens-E-Mail</Label>
                  <p className="text-sm text-sage-600">E-Mail an neue Partner nach der Registrierung</p>
                </div>
                <Switch
                  checked={settings.welcomeEmailEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, welcomeEmailEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Genehmigungs-E-Mail</Label>
                  <p className="text-sm text-sage-600">E-Mail bei Partner-Genehmigung oder -Ablehnung</p>
                </div>
                <Switch
                  checked={settings.approvalEmailEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, approvalEmailEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Erinnerungs-E-Mails</Label>
                  <p className="text-sm text-sage-600">Erinnerungen für ausstehende Aktionen</p>
                </div>
                <Switch
                  checked={settings.reminderEmailEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, reminderEmailEnabled: checked }))}
                />
              </div>

              <Button
                onClick={() => handleSave("E-Mail")}
                disabled={isLoading}
                className="bg-gold-600 hover:bg-gold-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Sicherheitseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session-Timeout (Stunden)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max. Login-Versuche</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, maxLoginAttempts: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="border-sage-200 focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Zwei-Faktor-Authentifizierung</Label>
                  <p className="text-sm text-sage-600">Erforderlich für alle Admin-Benutzer</p>
                </div>
                <Switch
                  checked={settings.requireTwoFactor}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, requireTwoFactor: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Mindest-Passwort-Länge</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, passwordMinLength: Number.parseInt(e.target.value) || 0 }))
                  }
                  className="border-sage-200 focus:border-gold-400"
                />
              </div>

              <Button
                onClick={() => handleSave("Sicherheits")}
                disabled={isLoading}
                className="bg-gold-600 hover:bg-gold-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Database className="w-5 h-5 mr-2 text-indigo-600" />
                System-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Wartungsmodus</Label>
                  <p className="text-sm text-sage-600">System für Wartungsarbeiten sperren</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-charcoal-700">Debug-Modus</Label>
                  <p className="text-sm text-sage-600">Erweiterte Fehlerprotokollierung aktivieren</p>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, debugMode: checked }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Log-Level</Label>
                  <select
                    id="logLevel"
                    value={settings.logLevel}
                    onChange={(e) => setSettings((prev) => ({ ...prev, logLevel: e.target.value }))}
                    className="w-full px-3 py-2 border border-sage-200 rounded-md focus:border-gold-400 focus:outline-none"
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup-Häufigkeit</Label>
                  <select
                    id="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings((prev) => ({ ...prev, backupFrequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-sage-200 rounded-md focus:border-gold-400 focus:outline-none"
                  >
                    <option value="hourly">Stündlich</option>
                    <option value="daily">Täglich</option>
                    <option value="weekly">Wöchentlich</option>
                    <option value="monthly">Monatlich</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={() => handleSave("System")}
                disabled={isLoading}
                className="bg-gold-600 hover:bg-gold-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
