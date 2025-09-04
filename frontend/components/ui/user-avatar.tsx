'use client'

import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { useAvatar } from '../../hooks/use-avatar'
import { cn } from '../../lib/utils'

interface UserAvatarProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showFallbackIcon?: boolean
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6', 
  xl: 'h-8 w-8'
}

const textSizes = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base'
}

export function UserAvatar({ 
  user, 
  size = 'md', 
  className,
  showFallbackIcon = true 
}: UserAvatarProps) {
  const { shouldShowFallback } = useAvatar(user.avatar)
  
  const initials = user.name
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase() || user.email[0]?.toUpperCase() || 'U'

  const fallbackContent = showFallbackIcon && initials.length === 0 ? (
    <User className={iconSizes[size]} />
  ) : (
    initials
  )

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {!shouldShowFallback && user.avatar && (
        <AvatarImage src={user.avatar} alt={user.name} />
      )}
      <AvatarFallback className={cn(
        "bg-primary text-primary-foreground font-medium",
        textSizes[size]
      )}>
        {fallbackContent}
      </AvatarFallback>
    </Avatar>
  )
}