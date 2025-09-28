# 🎨 Atelier Luminform - UI Design System Guide

## Übersicht

Dieses Dokument beschreibt das Design System, Layout-Grid, Komponenten und Best Practices für die Atelier Luminform Plattform.

## 🎯 Design Prinzipien

### Quiet Luxury Aesthetic
- **Minimalistisch**: Weniger ist mehr
- **Hochwertig**: Premium Materialien und Texturen
- **Subtile Eleganz**: Zurückhaltende, aber wirkungsvolle Gestaltung
- **Timeless**: Zeitlose Designsprache

### Atelier Luminform Farbpalette

#### Primärfarben
```css
/* Ivory - Warmes Weiß */
--ivory-50: oklch(0.99 0.01 85)   /* #fefcf9 */
--ivory-100: oklch(0.97 0.02 85)  /* #faf7f2 */
--ivory-200: oklch(0.94 0.03 85)  /* #f3ede4 */
--ivory-300: oklch(0.9 0.04 85)   /* #e9dfd3 */
--ivory-400: oklch(0.85 0.05 85)  /* #dcccb7 */
--ivory-500: oklch(0.8 0.06 85)   /* #ccb695 */
--ivory-600: oklch(0.75 0.07 85)  /* #b89e71 */
--ivory-700: oklch(0.7 0.08 85)   /* #a2854f */
--ivory-800: oklch(0.65 0.09 85)  /* #8b6b2e */
--ivory-900: oklch(0.6 0.1 85)    /* #735012 */

/* Sage - Beruhigendes Grün */
--sage-50: oklch(0.95 0.02 140)   /* #f4f7f4 */
--sage-100: oklch(0.9 0.03 140)   /* #e8f0e8 */
--sage-200: oklch(0.85 0.04 140)  /* #d6e2d6 */
--sage-300: oklch(0.8 0.05 140)   /* #bfd0bf */
--sage-400: oklch(0.75 0.06 140)  /* #a5b8a5 */
--sage-500: oklch(0.7 0.07 140)   /* #8a9d8a */
--sage-600: oklch(0.65 0.08 140)  /* #6f826f */
--sage-700: oklch(0.6 0.09 140)   /* #566856 */
--sage-800: oklch(0.55 0.1 140)   /* #3f4f3f */
--sage-900: oklch(0.5 0.11 140)   /* #2a362a */

/* Gold - Luxuriöses Gold */
--gold-50: oklch(0.95 0.05 85)    /* #fdf9f0 */
--gold-100: oklch(0.9 0.08 85)    /* #faf0d9 */
--gold-200: oklch(0.85 0.1 85)    /* #f5e4b8 */
--gold-300: oklch(0.8 0.12 85)    /* #eed594 */
--gold-400: oklch(0.75 0.15 85)   /* #e5c266 */
--gold-500: oklch(0.7 0.17 85)    /* #d9ad35 */
--gold-600: oklch(0.65 0.19 85)   /* #cc9700 */
--gold-700: oklch(0.6 0.21 85)    /* #bd7f00 */
--gold-800: oklch(0.55 0.23 85)   /* #ab6500 */
--gold-900: oklch(0.5 0.25 85)    /* #964a00 */

/* Charcoal - Elegantes Dunkelgrau */
--charcoal-50: oklch(0.95 0 0)    /* #f2f2f2 */
--charcoal-100: oklch(0.85 0 0)   /* #d9d9d9 */
--charcoal-200: oklch(0.75 0 0)   /* #bfbfbf */
--charcoal-300: oklch(0.65 0 0)   /* #a6a6a6 */
--charcoal-400: oklch(0.55 0 0)   /* #8c8c8c */
--charcoal-500: oklch(0.45 0 0)   /* #737373 */
--charcoal-600: oklch(0.35 0 0)   /* #595959 */
--charcoal-700: oklch(0.3 0 0)    /* #4d4d4d */
--charcoal-800: oklch(0.25 0 0)   /* #404040 */
--charcoal-900: oklch(0.2 0 0)    /* #333333 */
```

#### Semantische Farben
```css
/* Status-Farben */
--success: oklch(0.6 0.15 140)    /* Sage-600 */
--warning: oklch(0.7 0.17 85)     /* Gold-500 */
--error: oklch(0.6 0.25 25)       /* Rot */
--info: oklch(0.65 0.15 240)      /* Blau */

/* Neutrale Farben */
--background: oklch(1 0 0)        /* Ivory */
--foreground: oklch(0.25 0 0)     /* Charcoal-800 */
--muted: oklch(0.92 0 0)          /* Warm Grey */
--border: oklch(0.88 0 0)         /* Light Grey */
```

## 📐 Layout System

### Container System
```css
/* Container-Klassen */
.container-fluid    /* Volle Breite mit Padding */
.container-narrow   /* Max 4xl (896px) */
.container-wide     /* Max 7xl (1400px) */
```

### Breakpoints
```css
/* Responsive Breakpoints */
xs: 475px      /* Extra Small */
sm: 640px      /* Small */
md: 768px      /* Medium */
lg: 1024px     /* Large */
xl: 1280px     /* Extra Large */
2xl: 1400px    /* 2X Large (Custom) */
3xl: 1600px    /* 3X Large */
4xl: 1920px    /* 4X Large */
```

### Grid System
```css
/* Grid Utilities */
.grid-auto-fit    /* Auto-fit mit min 280px */
.grid-auto-fill   /* Auto-fill mit min 280px */

/* Custom Grid Columns */
grid-cols-13      /* 13 Spalten */
grid-cols-14      /* 14 Spalten */
grid-cols-15      /* 15 Spalten */
grid-cols-16      /* 16 Spalten */
```

### Spacing Scale (4px/8px System)
```css
/* Spacing Tokens */
space-1: 0.25rem   /* 4px */
space-2: 0.5rem    /* 8px */
space-3: 0.75rem   /* 12px */
space-4: 1rem      /* 16px */
space-5: 1.25rem   /* 20px */
space-6: 1.5rem    /* 24px */
space-8: 2rem      /* 32px */
space-10: 2.5rem   /* 40px */
space-12: 3rem     /* 48px */
space-16: 4rem     /* 64px */
space-20: 5rem     /* 80px */
space-24: 6rem     /* 96px */
space-32: 8rem     /* 128px */

/* Responsive Spacing */
p-responsive       /* 4/6/8 */
px-responsive      /* 4/6/8 horizontal */
py-responsive      /* 4/6/8 vertical */
space-responsive   /* 4/6/8 gap */
```

## 📝 Typografie

### Font Stack
```css
/* Font Families */
--font-sans: 'Inter', system-ui, sans-serif
--font-serif: 'Playfair Display', Georgia, serif
--font-mono: 'Geist Mono', 'Fira Code', monospace
```

### Typography Scale
```css
/* Font Sizes mit line-height */
text-xs:    0.75rem/1rem     /* 12px/16px */
text-sm:    0.875rem/1.25rem /* 14px/20px */
text-base:  1rem/1.5rem      /* 16px/24px */
text-lg:    1.125rem/1.75rem /* 18px/28px */
text-xl:    1.25rem/1.75rem  /* 20px/28px */
text-2xl:   1.5rem/2rem      /* 24px/32px */
text-3xl:   1.875rem/2.25rem /* 30px/36px */
text-4xl:   2.25rem/2.5rem   /* 36px/40px */
text-5xl:   3rem/3rem        /* 48px/48px */
text-6xl:   3.75rem/3.75rem  /* 60px/60px */
text-7xl:   4.5rem/4.5rem    /* 72px/72px */
text-8xl:   6rem/6rem        /* 96px/96px */
text-9xl:   8rem/8rem        /* 128px/128px */

/* Responsive Typography */
text-responsive-sm     /* xs/sm */
text-responsive-base   /* sm/base */
text-responsive-lg     /* base/lg */
text-responsive-xl     /* lg/xl */
text-responsive-2xl    /* xl/2xl */
text-responsive-3xl    /* 2xl/3xl */
```

### Text Utilities
```css
/* Text Enhancement */
.text-balance    /* Text balancing */
.text-pretty     /* Pretty text wrapping */
```

## 🧩 Komponenten System

### Button System
```css
/* Button Base */
.btn {
  @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background;
}

/* Button Sizes */
.btn-sm    /* h-9 px-3 */
.btn-md    /* h-10 px-4 py-2 */
.btn-lg    /* h-11 px-8 */
.btn-xl    /* h-12 px-10 text-base */
```

### Card System
```css
/* Card Base */
.card {
  @apply bg-card text-card-foreground rounded-lg border shadow-sm;
}

/* Card Sections */
.card-header   /* p-6 pb-4 */
.card-content  /* p-6 pt-0 */
.card-footer   /* p-6 pt-4 */
```

### Form System
```css
/* Form Input */
.form-input {
  @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}

/* Form Label */
.form-label {
  @apply text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70;
}
```

## 🎭 States & Variants

### Component States
```css
/* Loading States */
.loading-skeleton {
  @apply animate-pulse bg-muted rounded;
}

/* Error States */
.error-state {
  @apply border-destructive bg-destructive/5 text-destructive;
}

/* Success States */
.success-state {
  @apply border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-950 dark:text-green-300;
}
```

### Focus States
```css
/* Consistent Focus */
.focus-visible-ring {
  &:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px var(--ring);
  }
}
```

## 🖼️ Medien & Assets

### Aspect Ratios
```css
/* Aspect Ratio Utilities */
.aspect-ratio-square   /* 1:1 */
.aspect-ratio-video    /* 16:9 */
.aspect-ratio-4-3      /* 4:3 */
.aspect-ratio-3-2      /* 3:2 */
```

### Image Optimization
```typescript
// Optimized Image Component
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={300}
  height={200}
  priority={false}
  placeholder="blur"
  className="rounded-lg"
/>

// Image Presets
<PresetImage preset="avatar" src="/avatar.jpg" alt="User" />
<PresetImage preset="card" src="/card.jpg" alt="Product" />
<PresetImage preset="hero" src="/hero.jpg" alt="Hero" />
<PresetImage preset="thumbnail" src="/thumb.jpg" alt="Thumbnail" />
```

## 🎬 Animationen & Transitions

### Animation Scale
```css
/* Animation Durations */
duration-75:  75ms
duration-100: 100ms
duration-150: 150ms
duration-200: 200ms  /* Standard */
duration-300: 300ms  /* Standard */
duration-500: 500ms
duration-700: 700ms
duration-1000: 1000ms
```

### Custom Animations
```css
/* Custom Keyframes */
@keyframes fadeIn {
  0% { opacity: 0 }
  100% { opacity: 1 }
}

@keyframes slideUp {
  0% { transform: translateY(10px); opacity: 0 }
  100% { transform: translateY(0); opacity: 1 }
}

@keyframes slideDown {
  0% { transform: translateY(-10px); opacity: 0 }
  100% { transform: translateY(0); opacity: 1 }
}

@keyframes scaleIn {
  0% { transform: scale(0.95); opacity: 0 }
  100% { transform: scale(1); opacity: 1 }
}
```

### Motion Utilities
```css
/* Reduced Motion Support */
.motion-safe {
  @apply motion-reduce:transition-none motion-reduce:animate-none;
}
```

## ♿ Accessibility

### Focus Management
```css
/* Focus Styles */
*:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}
```

### High Contrast Support
```css
/* High Contrast Mode */
.high-contrast {
  @apply contrast-more:border-contrast-more contrast-more:bg-contrast-more;
}
```

### Safe Areas (iOS)
```css
/* Safe Area Utilities */
.safe-top     /* padding-top: env(safe-area-inset-top) */
.safe-bottom  /* padding-bottom: env(safe-area-inset-bottom) */
.safe-left    /* padding-left: env(safe-area-inset-left) */
.safe-right   /* padding-right: env(safe-area-inset-right) */
```

## 📱 Responsive Patterns

### Mobile-First Approach
```css
/* Mobile First */
.component {
  /* Mobile styles (default) */
  padding: 1rem;
  
  /* Tablet */
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    padding: 2rem;
  }
}
```

### Container Queries
```css
/* Container Query Support */
.container-sm {
  container-type: inline-size;
  container-name: sm;
}

@container sm (min-width: 300px) {
  .component {
    /* Styles for larger containers */
  }
}
```

## 🎨 Best Practices

### Layout Guidelines
1. **Konsistente Abstände**: Verwende die 4px/8px Skala
2. **Vertikale Rhythmik**: Konsistente line-height und margin-bottom
3. **Container-Breiten**: Nutze die definierten Container-Klassen
4. **Grid-System**: Verwende auto-fit/auto-fill für responsive Layouts

### Color Usage
1. **Primärfarben**: Ivory für Hintergründe, Charcoal für Text
2. **Akzentfarben**: Sage für sekundäre Elemente, Gold für Highlights
3. **Status-Farben**: Konsistent für Feedback und States
4. **Kontrast**: Mindestens 4.5:1 für WCAG AA Compliance

### Typography Guidelines
1. **Hierarchie**: Verwende die definierte Typography-Skala
2. **Lesbarkeit**: Mindestens 16px für Body-Text
3. **Zeilenabstand**: Konsistente line-height für bessere Lesbarkeit
4. **Responsive**: Nutze responsive Typography-Klassen

### Component Guidelines
1. **Konsistenz**: Verwende die definierten Komponenten-Klassen
2. **States**: Implementiere alle notwendigen States (hover, focus, disabled)
3. **Accessibility**: Stelle sicher, dass alle Komponenten zugänglich sind
4. **Performance**: Nutze optimierte Komponenten für Bilder und Medien

## 📊 Performance Guidelines

### CLS Prevention
- Definiere feste Größen für Medien
- Nutze aspect-ratio für konsistente Layouts
- Vermeide dynamische Größenänderungen

### LCP Optimization
- Priorisiere Hero-Images mit `priority={true}`
- Nutze Next.js Image Optimization
- Implementiere Lazy Loading für nicht-kritische Bilder

### Bundle Optimization
- Nutze Tree Shaking für ungenutzte Code
- Implementiere Code Splitting
- Optimiere Bundle-Größe mit Bundle Analyzer

## 🔧 Development Tools

### CSS Utilities
```bash
# Tailwind CSS IntelliSense
# Installiere die VSCode Extension für Autocomplete

# CSS Custom Properties
# Nutze die definierten CSS-Variablen für Konsistenz
```

### Component Testing
```typescript
// Test verschiedene States
<Button variant="primary" size="lg" disabled={false}>
  Primary Button
</Button>

// Test responsive Verhalten
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid Items */}
</div>
```

### Design System Validation
1. **Konsistenz**: Prüfe alle Komponenten auf einheitliche Styling
2. **Responsive**: Teste alle Breakpoints
3. **Accessibility**: Validiere mit Screen Reader und Keyboard Navigation
4. **Performance**: Prüfe Lighthouse-Scores

---

**Letzte Aktualisierung**: $(date)
**Version**: 1.0.0
**Status**: Production Ready ✅
