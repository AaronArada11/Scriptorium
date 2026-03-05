import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '../../components/ConvexClientProvider'
import UserSync from '@/components/UserSync'
import { ThemeProvider } from "@/components/theme-provider"  
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Scriptorium',
  description: 'Scriptorium is a collaborative workspace where teams upload files, create documents, and leverage AI to unlock insights from their collective knowledge.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <UserSync />
              {children}
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}