import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ThemeProvider } from '../hooks/use-theme'
import { AuthProvider } from '../hooks/use-auth'
import { ToastProvider } from '../lib/toast'
import { AppLayout } from '../components/layout/app-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InsightTrader - Análise Técnica de Ativos',
  description: 'Sistema escalável para análises técnicas de ativos financeiros',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="insight-trader-theme">
          <ToastProvider>
            <AuthProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </AuthProvider>
            
            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}