'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/button'
import { useTheme } from '../../hooks/use-theme'
import { cn } from '../../lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'relative w-9 h-9 p-0 glass hover:bg-muted/50 transition-all duration-200',
        className
      )}
      title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      <Sun className={cn(
        'h-4 w-4 rotate-0 scale-100 transition-all duration-300',
        theme === 'dark' && 'rotate-90 scale-0'
      )} />
      <Moon className={cn(
        'absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300',
        theme === 'dark' && 'rotate-0 scale-100'
      )} />
    </Button>
  )
}