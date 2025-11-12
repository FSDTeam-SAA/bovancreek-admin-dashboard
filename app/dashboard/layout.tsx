import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Providers } from "../providers"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BPOOL Admin Dashboard",
  description: "School bus booking system admin dashboard",
  generator: "v0.app",
}

export default function AdminLayout({
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
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>

          {/* Global UI */}
          <Toaster position="top-right" />
        </Providers>

        <Analytics />
      </body>
    </html>
  )
}
