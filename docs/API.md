# 📡 Atelier Luminform - API Documentation

## Übersicht

Die Atelier Luminform API ist eine RESTful API, die auf Next.js API Routes basiert und Supabase als Backend verwendet.

## 🔐 Authentifizierung

### Admin Authentication
Alle Admin-Endpunkte erfordern Authentifizierung als aktiver Admin-Benutzer.

```http
Authorization: Bearer <admin_jwt_token>
```

### Partner Authentication
Partner-Endpunkte erfordern Authentifizierung als registrierter Partner.

```http
Authorization: Bearer <partner_jwt_token>
```

## 📋 Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1234567890_abcdef123",
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {
      "resource": "partner",
      "id": "123"
    },
    "field": "id"
  },
  "message": "The requested resource could not be found",
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1234567890_abcdef123"
  }
}
```

## 🚫 Error Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|--------------|
| `UNAUTHORIZED` | 401 | Authentifizierung erforderlich |
| `FORBIDDEN` | 403 | Unzureichende Berechtigungen |
| `INVALID_TOKEN` | 401 | Ungültiger oder abgelaufener Token |
| `VALIDATION_ERROR` | 400 | Validierungsfehler |
| `NOT_FOUND` | 404 | Ressource nicht gefunden |
| `ALREADY_EXISTS` | 409 | Ressource existiert bereits |
| `DATABASE_ERROR` | 500 | Datenbankfehler |
| `INTERNAL_ERROR` | 500 | Interner Serverfehler |

## 👥 Admin Endpoints

### Partner Management

#### GET /api/admin/partners
Ruft alle Partner ab (nur für Admins).

**Query Parameters:**
- `status` (optional): Filter nach Status (`pending`, `approved`, `rejected`)
- `search` (optional): Suche nach Name oder E-Mail
- `page` (optional): Seitennummer (Standard: 1)
- `limit` (optional): Anzahl pro Seite (Standard: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_name": "Event Planning GmbH",
      "contact_person": "Max Mustermann",
      "email": "max@eventplanning.de",
      "status": "approved",
      "business_type": "wedding_planner",
      "created_at": "2024-01-01T00:00:00.000Z",
      "approved_at": "2024-01-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": { /* ... */ }
  }
}
```

#### PATCH /api/admin/partners
Aktualisiert den Status eines Partners.

**Request Body:**
```json
{
  "partnerId": "uuid",
  "status": "approved"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "approved",
    "approved_at": "2024-01-02T00:00:00.000Z"
  }
}
```

### Bestellungen Management

#### GET /api/admin/orders
Ruft alle Bestellungen ab.

**Query Parameters:**
- `status` (optional): Filter nach Status
- `search` (optional): Suche nach Bestellnummer oder Kunde
- `page`, `limit` (optional): Pagination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-2024-001",
      "partner_id": "uuid",
      "status": "confirmed",
      "total_amount": 1500.00,
      "client_name": "Anna Schmidt",
      "client_email": "anna@example.com",
      "created_at": "2024-01-01T00:00:00.000Z",
      "partners": {
        "company_name": "Event Planning GmbH",
        "contact_person": "Max Mustermann"
      },
      "order_items": [
        {
          "id": "uuid",
          "quantity": 2,
          "unit_price": 750.00,
          "product": {
            "name": "Luxury Wedding Package",
            "base_price": 750.00
          }
        }
      ]
    }
  ]
}
```

#### PATCH /api/admin/orders
Aktualisiert eine Bestellung.

**Request Body:**
```json
{
  "orderId": "uuid",
  "updates": {
    "status": "in_production",
    "notes": "Production started"
  }
}
```

### Angebote Management

#### GET /api/admin/quotes
Ruft alle Angebote ab.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "quote_number": "QUO-2024-001",
      "partner_id": "uuid",
      "status": "pending",
      "total_amount": 2000.00,
      "client_name": "Tom Weber",
      "valid_until": "2024-01-15T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z",
      "partners": {
        "company_name": "Event Planning GmbH"
      }
    }
  ]
}
```

### Admin-Benutzer Management

#### GET /api/admin/users
Ruft alle Admin-Benutzer ab (nur für Super Admins).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "admin@atelier-luminform.com",
      "full_name": "Admin User",
      "role": "super_admin",
      "permissions": ["partner_management", "system_settings"],
      "is_active": true,
      "last_login": "2024-01-01T12:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/admin/users
Erstellt einen neuen Admin-Benutzer (nur für Super Admins).

**Request Body:**
```json
{
  "email": "newadmin@atelier-luminform.com",
  "full_name": "New Admin",
  "role": "admin",
  "permissions": ["partner_management"],
  "is_active": true
}
```

#### PATCH /api/admin/users
Aktualisiert einen Admin-Benutzer.

**Request Body:**
```json
{
  "userId": "uuid",
  "updates": {
    "role": "moderator",
    "is_active": false
  }
}
```

#### DELETE /api/admin/users?userId=uuid
Löscht einen Admin-Benutzer (nur für Super Admins).

### Analytics

#### GET /api/admin/analytics
Ruft Analytics-Daten ab.

**Query Parameters:**
- `period` (optional): Zeitraum (`7d`, `30d`, `90d`, `1y`)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPartners": 150,
      "totalOrders": 89,
      "totalQuotes": 234,
      "totalRevenue": 125000.00,
      "conversionRate": 38.03,
      "activeMicrosites": 45,
      "partnerGrowthRate": 12.5
    },
    "charts": {
      "monthlyData": [
        {
          "month": "Jan 2024",
          "partners": 15,
          "revenue": 15000
        }
      ],
      "businessTypeDistribution": [
        {
          "name": "Wedding Planner",
          "value": 45,
          "color": "#3b82f6"
        }
      ]
    }
  }
}
```

## 🏢 Partner Endpoints

### Bestellungen

#### GET /api/orders
Ruft Bestellungen des authentifizierten Partners ab.

**Query Parameters:**
- `status` (optional): Filter nach Status
- `search` (optional): Suche

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-2024-001",
      "status": "confirmed",
      "total_amount": 1500.00,
      "client_name": "Anna Schmidt",
      "created_at": "2024-01-01T00:00:00.000Z",
      "order_items": [
        {
          "id": "uuid",
          "quantity": 2,
          "unit_price": 750.00,
          "product": {
            "name": "Luxury Wedding Package",
            "images": ["image1.jpg"]
          }
        }
      ]
    }
  ]
}
```

#### POST /api/orders
Erstellt eine neue Bestellung.

**Request Body:**
```json
{
  "client_name": "Anna Schmidt",
  "client_email": "anna@example.com",
  "client_phone": "+49123456789",
  "event_date": "2024-06-15",
  "delivery_address": {
    "street": "Musterstraße 1",
    "city": "Berlin",
    "zip": "10115"
  },
  "notes": "Special requirements",
  "order_items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 750.00,
      "personalization_data": {
        "colors": ["gold", "ivory"],
        "theme": "vintage"
      }
    }
  ]
}
```

### Angebote

#### GET /api/quotes
Ruft Angebote des authentifizierten Partners ab.

#### POST /api/quotes
Erstellt ein neues Angebot.

**Request Body:**
```json
{
  "client_name": "Tom Weber",
  "client_email": "tom@example.com",
  "event_date": "2024-07-20",
  "valid_until": "2024-01-15",
  "notes": "Quote for wedding",
  "quote_items": [
    {
      "product_id": "uuid",
      "quantity": 1,
      "unit_price": 2000.00,
      "description": "Complete wedding package"
    }
  ]
}
```

### Kollektionen

#### GET /api/collections
Ruft Kollektionen des authentifizierten Partners ab.

#### POST /api/collections
Erstellt eine neue Kollektion.

**Request Body:**
```json
{
  "name": "Summer Wedding Collection",
  "description": "Perfect for summer weddings",
  "is_public": true
}
```

### Microsites

#### GET /api/microsites
Ruft Microsites des authentifizierten Partners ab.

#### POST /api/microsites
Erstellt ein neues Microsite.

**Request Body:**
```json
{
  "title": "My Wedding Portfolio",
  "description": "Showcase of my work",
  "subdomain": "myportfolio",
  "collection_id": "uuid",
  "brand_kit_id": "uuid"
}
```

## 🔧 Utility Endpoints

### Health Check

#### GET /api/health
Prüft die System-Gesundheit.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "database": "connected",
    "services": {
      "supabase": "online",
      "storage": "online"
    }
  }
}
```

### Session Debug

#### GET /api/debug/session
Debug-Informationen zur aktuellen Session (nur in Development).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "partner"
    },
    "session": {
      "expires_at": "2024-01-01T12:00:00.000Z",
      "token_type": "bearer"
    }
  }
}
```

## 📊 Rate Limiting

- **Standard**: 100 Requests pro 15 Minuten
- **Admin**: 200 Requests pro 15 Minuten
- **Upload**: 10 Requests pro Stunde

Bei Überschreitung:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded"
  }
}
```

## 🔒 Sicherheit

### CORS
- Origin: Konfigurierbar über Environment-Variable
- Methods: GET, POST, PATCH, DELETE, OPTIONS
- Headers: Content-Type, Authorization

### Headers
Alle Responses enthalten Sicherheits-Headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

### Validierung
- Alle Eingaben werden validiert
- SQL Injection Protection durch Supabase
- XSS Protection durch Input Sanitization

## 📝 Beispiele

### cURL Beispiele

#### Admin Partner abrufen
```bash
curl -X GET "http://localhost:3000/api/admin/partners?status=approved" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

#### Neue Bestellung erstellen
```bash
curl -X POST "http://localhost:3000/api/orders" \
  -H "Authorization: Bearer <partner_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Anna Schmidt",
    "client_email": "anna@example.com",
    "order_items": [
      {
        "product_id": "uuid",
        "quantity": 2,
        "unit_price": 750.00
      }
    ]
  }'
```

#### Partner-Status aktualisieren
```bash
curl -X PATCH "http://localhost:3000/api/admin/partners" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "partnerId": "uuid",
    "status": "approved"
  }'
```

### JavaScript Beispiele

#### Fetch API
```javascript
// Partner abrufen
const response = await fetch('/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
if (data.success) {
  console.log('Orders:', data.data)
} else {
  console.error('Error:', data.error)
}
```

#### React Hook Beispiel
```javascript
const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return { orders, loading, refetch: fetchOrders }
}
```

---

**Letzte Aktualisierung**: $(date)
**Version**: 1.0.0
**Status**: Production Ready ✅
