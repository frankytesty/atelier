# 🏠 Lokale Entwicklung - Atelier Luminform

## 🚀 **Schnellstart:**

### 1. **Environment Variables einrichten:**
```bash
# Kopieren Sie die Beispiel-Datei
cp env.example .env.local

# Bearbeiten Sie .env.local mit Ihren Supabase-Daten
nano .env.local
```

### 2. **Supabase-Daten konfigurieren:**
In `.env.local` ersetzen Sie:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ihr-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr-anon-key
SUPABASE_SERVICE_ROLE_KEY=ihr-service-role-key
```

### 3. **Development Server starten:**
```bash
npm run dev
```

### 4. **Supabase-Datenbank einrichten:**
1. Gehen Sie zu [supabase.com/dashboard](https://supabase.com/dashboard)
2. Wählen Sie Ihr Projekt
3. Gehen Sie zu **SQL Editor**
4. Führen Sie die Scripts aus `scripts/` aus

## 🔧 **Troubleshooting:**

### **"Supabase client not found" Fehler:**
- ✅ Prüfen Sie `.env.local` existiert
- ✅ Prüfen Sie die Supabase-URL und Keys
- ✅ Starten Sie den Dev-Server neu

### **Datenbank-Fehler:**
- ✅ Führen Sie alle SQL-Scripts aus
- ✅ Prüfen Sie RLS-Policies
- ✅ Erstellen Sie einen Admin-User

## 📋 **Checklist:**
- [ ] `.env.local` erstellt
- [ ] Supabase-Daten eingetragen
- [ ] SQL-Scripts ausgeführt
- [ ] `npm run dev` gestartet
- [ ] App läuft auf http://localhost:3000
