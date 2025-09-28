# 🚀 Atelier Luminform - Runbook

## Übersicht

Dieses Runbook enthält alle notwendigen Informationen zum Setup, Start und Deployment der Atelier Luminform Plattform.

## 📋 Voraussetzungen

### System-Anforderungen
- **Node.js**: v18.17.0 oder höher
- **pnpm**: v8.0.0 oder höher (empfohlen) oder npm v9.0.0+
- **Git**: v2.30.0 oder höher
- **Supabase Account**: Für Datenbank und Authentication

### Browser-Unterstützung
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🛠️ Setup

### 1. Repository klonen
```bash
git clone <repository-url>
cd atelier-luminform
```

### 2. Dependencies installieren
```bash
# Mit pnpm (empfohlen)
pnpm install

# Oder mit npm
npm install
```

### 3. Environment-Variablen konfigurieren
```bash
# Kopiere die Beispiel-Konfiguration
cp env.example .env.local

# Bearbeite die Konfiguration
nano .env.local
```

**Wichtige Environment-Variablen:**
```env
# Supabase (erforderlich)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Supabase Setup
1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Führe die SQL-Scripts in der richtigen Reihenfolge aus:
   ```bash
   # In der Supabase SQL Editor ausführen:
   # 1. scripts/001_create_auth_tables.sql
   # 2. scripts/002_create_product_tables.sql
   # 3. scripts/003_seed_products.sql
   # 4. scripts/004_create_dashboard_tables.sql
   # 5. scripts/005_create_microsite_tables.sql
   # 6. scripts/006_create_indexes_and_functions.sql
   # 7. scripts/007_create_admin_tables.sql
   # 8. scripts/008_create_admin_user.sql
   ```

## 🚀 Entwicklung

### Development Server starten
```bash
pnpm dev
# oder
npm run dev
```

Die Anwendung ist dann verfügbar unter: `http://localhost:3000`

### Verfügbare Scripts
```bash
# Development
pnpm dev          # Startet den Development Server
pnpm build        # Erstellt Production Build
pnpm start        # Startet Production Server
pnpm lint         # Führt ESLint aus
pnpm type-check   # TypeScript Type Checking
```

### Code-Qualität
```bash
# Alle Checks ausführen
pnpm lint && pnpm type-check

# Automatische Fixes
pnpm lint --fix
```

## 🏗️ Build & Deployment

### Production Build
```bash
# Build erstellen
pnpm build

# Build testen
pnpm start
```

### Deployment-Optionen

#### Vercel (Empfohlen)
1. Verbinde dein Repository mit Vercel
2. Setze die Environment-Variablen in Vercel
3. Deploy automatisch bei Push

#### Docker
```bash
# Docker Image bauen
docker build -t atelier-luminform .

# Container starten
docker run -p 3000:3000 atelier-luminform
```

#### Manual Deployment
```bash
# Build erstellen
pnpm build

# Static Export (falls gewünscht)
pnpm export

# Dateien auf Server hochladen
# Node.js Server starten
```

## 🔧 Konfiguration

### Tailwind CSS
- Konfiguration: `tailwind.config.js`
- Globale Styles: `app/globals.css`
- Design System: CSS-Variablen in `:root`

### Next.js
- Konfiguration: `next.config.mjs`
- Features: Image Optimization, Security Headers
- Performance: Bundle Optimization

### Supabase
- Client: `lib/supabase/client.ts`
- Server: `lib/supabase/server.ts`
- Middleware: `lib/supabase/middleware.ts`

## 🐛 Troubleshooting

### Häufige Probleme

#### Build-Fehler
```bash
# Node Modules neu installieren
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Cache leeren
pnpm store prune
```

#### Supabase-Verbindungsfehler
1. Prüfe Environment-Variablen
2. Prüfe Supabase-Projekt-Status
3. Prüfe RLS-Policies

#### TypeScript-Fehler
```bash
# Type Checking ausführen
pnpm type-check

# Types neu generieren (falls Supabase)
npx supabase gen types typescript --local > lib/database.types.ts
```

### Debug-Modus
```bash
# Debug-Logs aktivieren
NEXT_PUBLIC_DEBUG=true pnpm dev
```

### Performance-Probleme
1. Prüfe Bundle-Größe: `pnpm build --analyze`
2. Prüfe Lighthouse-Scores
3. Prüfe Network-Tab in DevTools

## 📊 Monitoring

### Performance-Metriken
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Logs
- Development: Console-Logs im Browser
- Production: Vercel Analytics oder Sentry

### Health Checks
```bash
# API Health Check
curl http://localhost:3000/api/health

# Database Connection
curl http://localhost:3000/api/debug/session
```

## 🔐 Sicherheit

### Environment-Variablen
- Niemals Secrets in Code committen
- Verwende `.env.local` für lokale Entwicklung
- Verwende sichere Werte in Production

### Supabase-Sicherheit
- RLS-Policies sind aktiviert
- Service Role Key nur serverseitig verwenden
- Anon Key für Client-Side

### Headers
- Security Headers sind in `next.config.mjs` konfiguriert
- CORS ist für notwendige Domains konfiguriert

## 📈 Skalierung

### Database
- Supabase Auto-Scaling
- Connection Pooling aktiviert
- Indexes für Performance optimiert

### CDN
- Vercel Edge Network
- Image Optimization aktiviert
- Static Assets cached

### Monitoring
- Vercel Analytics
- Error Tracking (optional)
- Performance Monitoring

## 🆘 Support

### Dokumentation
- [API Documentation](./API.md)
- [UI Guide](./UI-GUIDE.md)
- [System Overview](../SYSTEM_OVERVIEW.md)

### Kontakt
- **Entwickler**: AI Assistant
- **Repository**: [GitHub Link]
- **Issues**: GitHub Issues verwenden

### Bekannte Limitations
- IE11 wird nicht unterstützt
- Server-Side Rendering für alle Seiten
- Supabase als einzige Datenbank-Option

## 🔄 Updates

### Dependencies aktualisieren
```bash
# Prüfe veraltete Pakete
pnpm outdated

# Aktualisiere alle Dependencies
pnpm update

# Prüfe Breaking Changes
pnpm audit
```

### Database Migrations
1. Neue SQL-Scripts erstellen
2. In Supabase SQL Editor ausführen
3. Types neu generieren (falls nötig)

---

**Letzte Aktualisierung**: $(date)
**Version**: 1.0.0
**Status**: Production Ready ✅
