'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { ThemeToggle } from '../theme/theme-toggle'
import { UserNav } from '../profile/user-nav'
import { useAuth } from '../../hooks/use-auth'
import { 
  Home, 
  Settings, 
  TrendingUp, 
  BarChart3,
  Briefcase
} from 'lucide-react'

const baseNavigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Técnicas',
    href: '/techniques',
    icon: Settings,
  },
  {
    name: 'Carteira',
    href: '/portfolio',
    icon: Briefcase,
  },
  {
    name: 'Backtest',
    href: '/backtest',
    icon: BarChart3,
  },
]

const adminNavigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Técnicas',
    href: '/techniques',
    icon: Settings,
  },
  {
    name: 'Ativos',
    href: '/assets',
    icon: TrendingUp,
  },
  {
    name: 'Carteira',
    href: '/portfolio',
    icon: Briefcase,
  },
  {
    name: 'Backtest',
    href: '/backtest',
    icon: BarChart3,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()
  
  const navigation = isAdmin ? adminNavigation : baseNavigation

  return (
    <nav className="glass border-b sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                InsightTrader
              </span>
              <div className="text-xs text-muted-foreground -mt-1">Finance Analytics</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className={cn(
                        'nav-item h-9 px-4 rounded-lg transition-all duration-200',
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 active' 
                          : 'hover:bg-muted/50 hover:text-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}