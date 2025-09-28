/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        // Custom Atelier Luminform Palette
        ivory: {
          50: 'oklch(var(--color-ivory-50))',
          100: 'oklch(var(--color-ivory-100))',
          200: 'oklch(var(--color-ivory-200))',
          300: 'oklch(var(--color-ivory-300))',
          400: 'oklch(var(--color-ivory-400))',
          500: 'oklch(var(--color-ivory-500))',
          600: 'oklch(var(--color-ivory-600))',
          700: 'oklch(var(--color-ivory-700))',
          800: 'oklch(var(--color-ivory-800))',
          900: 'oklch(var(--color-ivory-900))',
        },
        sage: {
          50: 'oklch(var(--color-sage-50))',
          100: 'oklch(var(--color-sage-100))',
          200: 'oklch(var(--color-sage-200))',
          300: 'oklch(var(--color-sage-300))',
          400: 'oklch(var(--color-sage-400))',
          500: 'oklch(var(--color-sage-500))',
          600: 'oklch(var(--color-sage-600))',
          700: 'oklch(var(--color-sage-700))',
          800: 'oklch(var(--color-sage-800))',
          900: 'oklch(var(--color-sage-900))',
        },
        gold: {
          50: 'oklch(var(--color-gold-50))',
          100: 'oklch(var(--color-gold-100))',
          200: 'oklch(var(--color-gold-200))',
          300: 'oklch(var(--color-gold-300))',
          400: 'oklch(var(--color-gold-400))',
          500: 'oklch(var(--color-gold-500))',
          600: 'oklch(var(--color-gold-600))',
          700: 'oklch(var(--color-gold-700))',
          800: 'oklch(var(--color-gold-800))',
          900: 'oklch(var(--color-gold-900))',
        },
        charcoal: {
          50: 'oklch(var(--color-charcoal-50))',
          100: 'oklch(var(--color-charcoal-100))',
          200: 'oklch(var(--color-charcoal-200))',
          300: 'oklch(var(--color-charcoal-300))',
          400: 'oklch(var(--color-charcoal-400))',
          500: 'oklch(var(--color-charcoal-500))',
          600: 'oklch(var(--color-charcoal-600))',
          700: 'oklch(var(--color-charcoal-700))',
          800: 'oklch(var(--color-charcoal-800))',
          900: 'oklch(var(--color-charcoal-900))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
        display: ['var(--font-playfair)'], // Added for display headings
      },
      spacing: {
        '4px': '4px',
        '8px': '8px',
        '12px': '12px',
        '16px': '16px',
        '20px': '20px',
        '24px': '24px',
        '32px': '32px',
        '40px': '40px',
        '48px': '48px',
        '64px': '64px',
        '80px': '80px',
        '96px': '96px',
        '128px': '128px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
