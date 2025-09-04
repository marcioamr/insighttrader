'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'
import { UserAvatar } from '../ui/user-avatar'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { 
  User, 
  LogOut,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  if (!user) return null

  // Função para fechar o menu
  const closeMenu = () => {
    setIsOpen(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Função para iniciar o timer de auto-ocultação
  const startAutoHideTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      closeMenu()
    }, 5000) // 5 segundos sem interação
  }

  // Função para lidar com a mudança de estado do menu
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true)
      startAutoHideTimer()
    } else {
      closeMenu()
    }
  }

  // Função para lidar com movimento do mouse dentro da div
  const handleMouseMove = () => {
    if (isOpen) {
      startAutoHideTimer() // Reinicia o timer a cada movimento
    }
  }

  // Função para lidar com mouse entrando na div
  const handleMouseEnter = () => {
    if (isOpen && timeoutRef.current) {
      clearTimeout(timeoutRef.current) // Pausar o timer quando mouse está sobre o menu
      timeoutRef.current = null
    }
  }

  // Função específica para fechar com delay menor quando mouse sai
  const startQuickCloseTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      closeMenu()
    }, 1000) // 1 segundo quando mouse sai da área
  }

  // Função para lidar com mouse deixando a div
  const handleMouseLeave = () => {
    if (isOpen) {
      // Usar timer mais rápido quando mouse sai da área
      startQuickCloseTimer()
    }
  }

  // Adicionar listener para cliques fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isOpen) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Limpar timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleLogout = () => {
    closeMenu() // Fechar menu antes de fazer logout
    logout()
    router.push('/login')
  }

  // Função para fechar menu ao clicar em items
  const handleMenuItemClick = () => {
    closeMenu()
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-9 w-9 rounded-full glass hover:bg-muted/50 transition-all duration-200"
          >
            <UserAvatar 
              user={user} 
              size="md"
              className="transition-transform duration-200 hover:scale-105"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 glass" 
          align="end" 
          forceMount
        >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {user.role === 'admin' && (
                <span className="text-xs leading-none text-primary font-medium">
                  Administrador
                </span>
              )}
              {user.plan && (
                <span className="text-xs leading-none text-muted-foreground capitalize">
                  • {user.plan}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer" onClick={handleMenuItemClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin">
              <DropdownMenuItem className="cursor-pointer" onClick={handleMenuItemClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Administração</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}