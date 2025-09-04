'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { Chrome } from 'lucide-react'
import { useGoogleAuth } from '../../hooks/use-google-auth'
import { useAuth } from '../../hooks/use-auth'
import { useToast } from '../../lib/toast'
import { useRouter } from 'next/navigation'

interface GoogleSignInButtonProps {
  className?: string
  disabled?: boolean
}

// Client ID do Google (para desenvolvimento - substitua pelo seu)
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo-client-id'

export function GoogleSignInButton({ className, disabled }: GoogleSignInButtonProps) {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const { handleGoogleAuthSuccess } = useAuth()
  const toast = useToast()
  const router = useRouter()

  const handleSuccess = async (googleUser: { email: string; name: string; picture: string }) => {
    try {
      setIsSigningIn(true)
      await handleGoogleAuthSuccess(googleUser)
      toast.success('Login realizado!', 'Bem-vindo ao InsightTrader')
      router.push('/')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na autenticação com Google'
      toast.error('Erro na Autenticação', errorMessage)
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleError = (error: string) => {
    toast.error('Erro na Autenticação', error)
    setIsSigningIn(false)
  }

  const { signIn, isLoaded, isLoading } = useGoogleAuth({
    clientId: GOOGLE_CLIENT_ID,
    onSuccess: handleSuccess,
    onError: handleError
  })

  const handleClick = () => {
    if (!isLoaded) {
      toast.error('Erro', 'Google Auth ainda não foi carregado')
      return
    }
    
    setIsSigningIn(true)
    signIn()
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || !isLoaded || isLoading || isSigningIn}
      variant="outline"
      className={className}
    >
      <Chrome className="h-5 w-5 mr-2 text-[#4285f4]" />
      {isSigningIn || isLoading ? 'Entrando...' : 'Entrar com Google'}
    </Button>
  )
}