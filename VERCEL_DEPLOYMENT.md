# 🚀 Vercel Deployment Guide - Atelier Luminform

## ❌ **Aktueller Fehler:**
```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## ✅ **Lösung: Umgebungsvariablen auf Vercel konfigurieren**

### 1. **Supabase-Projekt erstellen (falls noch nicht vorhanden):**
1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Notieren Sie sich die **Project URL** und **API Keys**

### 2. **Vercel Environment Variables konfigurieren:**

#### **In Vercel Dashboard:**
1. Gehen Sie zu Ihrem Projekt auf [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klicken Sie auf **Settings** → **Environment Variables**
3. Fügen Sie folgende Variablen hinzu:

#### **🔑 Erforderliche Supabase-Variablen:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### **🌐 App-Konfiguration:**
```bash
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Atelier Luminform
NEXT_PUBLIC_APP_DESCRIPTION=Luxury event planning and design platform
```

#### **🔐 Sicherheit:**
```bash
JWT_SECRET=your-jwt-secret-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

#### **📧 Email (optional):**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@atelier-luminform.com
SMTP_FROM_NAME=Atelier Luminform
```

### 3. **Supabase-Datenbank einrichten:**

#### **SQL-Scripts ausführen:**
1. Gehen Sie zu Ihrem Supabase Dashboard
2. Klicken Sie auf **SQL Editor**
3. Führen Sie die Scripts in dieser Reihenfolge aus:

```sql
-- 1. Auth Tables
-- 2. Product Tables  
-- 3. Dashboard Tables
-- 4. Microsite Tables
-- 5. Admin Tables
```

#### **Scripts finden Sie in:**
- `scripts/001_create_auth_tables.sql`
- `scripts/002_create_product_tables.sql`
- `scripts/004_create_dashboard_tables.sql`
- `scripts/005_create_microsite_tables.sql`
- `scripts/007_create_admin_tables.sql`

### 4. **Vercel Deployment neu starten:**
1. Nach dem Hinzufügen der Environment Variables
2. Gehen Sie zu **Deployments**
3. Klicken Sie auf **Redeploy** für den letzten Deployment

### 5. **Verification:**
Nach dem Redeploy sollte die App funktionieren:
- ✅ Homepage lädt ohne Fehler
- ✅ Supabase-Verbindung funktioniert
- ✅ Admin-Panel ist erreichbar
- ✅ Partner-Portal funktioniert

## 🔧 **Troubleshooting:**

### **Falls immer noch Fehler:**
1. **Environment Variables prüfen:**
   - Sind alle Variablen korrekt gesetzt?
   - Sind die Supabase-Keys gültig?

2. **Supabase RLS Policies:**
   - Sind die Row Level Security Policies aktiviert?
   - Sind die Tabellen korrekt erstellt?

3. **Vercel Logs prüfen:**
   - Gehen Sie zu **Functions** → **View Function Logs**
   - Schauen Sie nach spezifischen Fehlern

## 📋 **Checklist für erfolgreiches Deployment:**

- [ ] Supabase-Projekt erstellt
- [ ] Supabase URL und Keys kopiert
- [ ] Environment Variables in Vercel gesetzt
- [ ] SQL-Scripts in Supabase ausgeführt
- [ ] Vercel Deployment neu gestartet
- [ ] App funktioniert ohne Fehler

## 🎯 **Nächste Schritte nach erfolgreichem Deployment:**

1. **Admin-User erstellen:**
   - Gehen Sie zu `/auth/admin/setup`
   - Erstellen Sie den ersten Super-Admin

2. **Test-Partner erstellen:**
   - Gehen Sie zu `/auth/apply`
   - Testen Sie den Partner-Registrierungsprozess

3. **Datenbank testen:**
   - Erstellen Sie Test-Produkte
   - Testen Sie Bestellungen und Angebote

---

**💡 Tipp:** Alle Environment Variables sind in `env.example` dokumentiert!

---

## 🚀 **Deployment Status:**
- ✅ Code zu GitHub gepusht
- ✅ Vercel sollte automatisch deployen
- ⚠️ **Wichtig:** Environment Variables in Vercel setzen!
