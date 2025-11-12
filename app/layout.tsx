import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BPOOL Admin Dashboard",
  description: "School bus booking system admin dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} ${geistMono.className} font-sans antialiased`}
      >
        {/* Wrap everything with Session + React Query Providers */}
        <Providers>

          {children}
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}
