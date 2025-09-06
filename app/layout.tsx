import "./globals.css"
import { Inter, Space_Grotesk } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import { FirebaseAuthProvider } from "@/contexts/firebase-auth-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Glintly - Learn. Grow. Repeat.",
  description:
    "Discover bite-sized learning content in cooking, tech, motivation, and more. Your personalized learning journey starts here.",

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-background text-foreground antialiased`}
      >
        <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
      </body>
    </html>
  )
}
