"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Shield, 
  Mail, 
  Database, 
  Bell, 
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

interface AdminSettingsProps {
  settings: any
  adminUser: AdminUser
}

export function AdminSettings({ }: AdminSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // System-Einstellungen
  const [systemSettings, setSystemSettings] = useState({
    siteName: "Atelier Luminform",
    siteDescription: "Exclusive Wedding Supply Platform",
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxFileSize: "10",
    sessionTimeout: "24",
    defaultLanguage: "de",
    timezone: "Europe/Berlin",
  })

  // E-Mail-Einstellungen
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    fromEmail: "noreply@atelier-luminform.com",
    fromName: "Atelier Luminform",
    replyTo: "support@atelier-luminform.com",
  })

  // Sicherheits-Einstellungen
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: "8",
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: "5",
    lockoutDuration: "30",
    twoFactorRequired: false,
    sessionTimeout: "24",
  })

  // Benachrichtigungs-Einstellungen
  const [notificationSettings, setNotificationSettings] = useState({
    newPartnerRegistration: true,
    newOrderCreated: true,
    orderStatusChanged: true,
    paymentReceived: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
  })

  const handleSave = async (section: string) => {
    setIsLoading(true)
    try {
      // Hier würde normalerweise die API aufgerufen werden
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simuliert API-Call
      
      toast({
        title: "Einstellungen gespeichert",
        description: `${section} wurde erfolgreich aktualisiert.`,
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="email">E-Mail</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="advanced">Erweitert</TabsTrigger>
        </TabsList>

        {/* System-Einstellungen */}
        <TabsContent value="system" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Allgemeine Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Seitenname</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Standard-Sprache</Label>
                  <Select value={systemSettings.defaultLanguage} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, defaultLanguage: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Seitenbeschreibung</Label>
                <Textarea
                  id="siteDescription"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max. Dateigröße (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session-Timeout (Stunden)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Wartungsmodus</Label>
                    <p className="text-sm text-sage-600">Plattform für Benutzer sperren</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrationEnabled">Registrierung aktiviert</Label>
                    <p className="text-sm text-sage-600">Neue Partner können sich registrieren</p>
                  </div>
                  <Switch
                    id="registrationEnabled"
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, registrationEnabled: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("System-Einstellungen")} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* E-Mail-Einstellungen */}
        <TabsContent value="email" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-green-600" />
                E-Mail-Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP-Host</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    placeholder="smtp.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP-Port</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP-Benutzername</Label>
                  <Input
                    id="smtpUser"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP-Passwort</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Absender-E-Mail</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">Absender-Name</Label>
                  <Input
                    id="fromName"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("E-Mail-Einstellungen")} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sicherheits-Einstellungen */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Sicherheits-Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Min. Passwort-Länge</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max. Login-Versuche</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="passwordRequireSpecial">Sonderzeichen erforderlich</Label>
                    <p className="text-sm text-sage-600">Passwort muss Sonderzeichen enthalten</p>
                  </div>
                  <Switch
                    id="passwordRequireSpecial"
                    checked={securitySettings.passwordRequireSpecial}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, passwordRequireSpecial: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="passwordRequireNumbers">Zahlen erforderlich</Label>
                    <p className="text-sm text-sage-600">Passwort muss Zahlen enthalten</p>
                  </div>
                  <Switch
                    id="passwordRequireNumbers"
                    checked={securitySettings.passwordRequireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, passwordRequireNumbers: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="passwordRequireUppercase">Großbuchstaben erforderlich</Label>
                    <p className="text-sm text-sage-600">Passwort muss Großbuchstaben enthalten</p>
                  </div>
                  <Switch
                    id="passwordRequireUppercase"
                    checked={securitySettings.passwordRequireUppercase}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, passwordRequireUppercase: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorRequired">Zwei-Faktor-Authentifizierung</Label>
                    <p className="text-sm text-sage-600">2FA für alle Benutzer erforderlich</p>
                  </div>
                  <Switch
                    id="twoFactorRequired"
                    checked={securitySettings.twoFactorRequired}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorRequired: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("Sicherheits-Einstellungen")} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benachrichtigungs-Einstellungen */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-purple-600" />
                Benachrichtigungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newPartnerRegistration">Neue Partner-Registrierung</Label>
                    <p className="text-sm text-sage-600">Benachrichtigung bei neuen Partner-Anmeldungen</p>
                  </div>
                  <Switch
                    id="newPartnerRegistration"
                    checked={notificationSettings.newPartnerRegistration}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newPartnerRegistration: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newOrderCreated">Neue Bestellung</Label>
                    <p className="text-sm text-sage-600">Benachrichtigung bei neuen Bestellungen</p>
                  </div>
                  <Switch
                    id="newOrderCreated"
                    checked={notificationSettings.newOrderCreated}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newOrderCreated: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderStatusChanged">Bestellungs-Status geändert</Label>
                    <p className="text-sm text-sage-600">Benachrichtigung bei Status-Änderungen</p>
                  </div>
                  <Switch
                    id="orderStatusChanged"
                    checked={notificationSettings.orderStatusChanged}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, orderStatusChanged: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentReceived">Zahlung erhalten</Label>
                    <p className="text-sm text-sage-600">Benachrichtigung bei Zahlungseingängen</p>
                  </div>
                  <Switch
                    id="paymentReceived"
                    checked={notificationSettings.paymentReceived}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, paymentReceived: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlerts">System-Warnungen</Label>
                    <p className="text-sm text-sage-600">Kritische System-Benachrichtigungen</p>
                  </div>
                  <Switch
                    id="systemAlerts"
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports">Wöchentliche Berichte</Label>
                    <p className="text-sm text-sage-600">Automatische wöchentliche Zusammenfassung</p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="monthlyReports">Monatliche Berichte</Label>
                    <p className="text-sm text-sage-600">Automatische monatliche Zusammenfassung</p>
                  </div>
                  <Switch
                    id="monthlyReports"
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, monthlyReports: checked }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("Benachrichtigungs-Einstellungen")} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Erweiterte Einstellungen */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="font-display text-xl text-charcoal-900 flex items-center">
                <Database className="w-5 h-5 mr-2 text-orange-600" />
                Erweiterte Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h4 className="font-medium text-orange-900">Warnung</h4>
                  </div>
                  <p className="text-sm text-orange-700">
                    Diese Einstellungen können die Funktionalität der Plattform beeinträchtigen. 
                    Änderungen sollten nur von erfahrenen Administratoren vorgenommen werden.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Datenbank-Backup erstellen
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Cache leeren
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    SSL-Zertifikat prüfen
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    System-Integrität prüfen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
