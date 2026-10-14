import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'OneStop Intelligent SACCO',
  description: 'Staff portal — core banking, reconciliation, CRM and insurance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-screen bg-[#F5F5F0] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
