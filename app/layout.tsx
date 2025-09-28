import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { SessionListener } from "@/components/auth/session-listener"
import { PWAProvider } from "@/components/pwa/pwa-provider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Atelier Luminform - Premium Hochzeitseinladungen",
  description:
    "Exklusive Hochzeitseinladungen und Event-Papeterie in bester Qualität. Professionelle B2B-Plattform für Hochzeitsplaner und Event-Manager.",
  generator: "Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Atelier Luminform",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Atelier Luminform",
    title: "Atelier Luminform - Premium Hochzeitseinladungen",
    description: "Exklusive Hochzeitseinladungen und Event-Papeterie in bester Qualität",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier Luminform - Premium Hochzeitseinladungen",
    description: "Exklusive Hochzeitseinladungen und Event-Papeterie in bester Qualität",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D4AF37",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`font-sans ${playfair.variable} ${inter.variable} ${GeistMono.variable} antialiased`}>
        <PWAProvider />
        <SessionListener />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
