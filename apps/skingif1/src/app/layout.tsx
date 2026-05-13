import type { Metadata } from "next"
import { Outfit, Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/context/LanguageContext"
import { ToastProvider } from "@/components/ui/ToastProvider"
import { PayPalProvider } from "@/components/providers/PayPalProvider"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { Watermark } from "@/components/ui/Watermark"
import { AccessTracker } from "@/components/ui/AccessTracker"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const { headers } = await import('next/headers')
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isEcoServing = false;

  return {
    title: "SkinIQ™ | Powered by Skingif1",
    description: "Plataforma de Inteligencia Artificial para el cuidado de la piel.",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <ToastProvider>
            <PayPalProvider>
              {children}
              <AccessTracker portalName="Skingif1" />
              <WhatsAppButton />
              <Watermark />
            </PayPalProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
