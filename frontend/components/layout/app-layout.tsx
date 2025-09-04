'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'
import { Navigation } from './navigation'
import { useEffect } from 'react'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  
  const isLoginPage = pathname === '/login'
  const showNavigation = isAuthenticated && !isLoginPage

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, isLoginPage, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecionando para login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
        {children}
      </main>
    </div>
  )
}