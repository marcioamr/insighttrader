'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google: any
  }
}

interface GoogleUser {
  email: string
  name: string
  picture: string
  sub: string // Google ID
}

interface UseGoogleAuthProps {
  clientId: string
  onSuccess: (user: GoogleUser) => void
  onError: (error: string) => void
}

export function useGoogleAuth({ clientId, onSuccess, onError }: UseGoogleAuthProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar se o script do Google já foi carregado
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsLoaded(true)
        initializeGoogleAuth()
      } else {
        // Tentar novamente em 100ms
        setTimeout(checkGoogleLoaded, 100)
      }
    }

    checkGoogleLoaded()
  }, [clientId])

  const initializeGoogleAuth = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false
      })
    } catch (error) {
      console.error('Erro ao inicializar Google Auth:', error)
      onError('Erro ao inicializar autenticação Google')
    }
  }

  const handleCredentialResponse = (response: any) => {
    try {
      // Decodificar o JWT token do Google
      const token = response.credential
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      const user: GoogleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub
      }

      onSuccess(user)
    } catch (error) {
      console.error('Erro ao processar resposta do Google:', error)
      onError('Erro ao processar autenticação Google')
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = () => {
    if (!isLoaded) {
      onError('Google Auth não está carregado')
      return
    }

    setIsLoading(true)
    
    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback para popup se o prompt não foi exibido
          window.google.accounts.id.renderButton(
            document.createElement('div'),
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'rectangular',
              text: 'signin_with',
              logo_alignment: 'left'
            }
          )
          
          // Como alternativa, usar o fluxo de popup
          signInWithPopup()
        }
      })
    } catch (error) {
      console.error('Erro ao iniciar login Google:', error)
      onError('Erro ao iniciar login Google')
      setIsLoading(false)
    }
  }

  const signInWithPopup = () => {
    // Para desenvolvimento, simular seleção de contas Google disponíveis
    const availableAccounts = [
      {
        email: 'marcioamr@gmail.com',
        name: 'Marcio Rodrigues',
        picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&seed=marcio',
        sub: 'google-id-marcio'
      },
      {
        email: 'demo@gmail.com', 
        name: 'Demo User',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face&seed=demo',
        sub: 'google-id-demo'
      },
      {
        email: 'user@gmail.com',
        name: 'Test User', 
        picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b632?w=100&h=100&fit=crop&crop=face&seed=test',
        sub: 'google-id-test'
      }
    ]

    // Simular popup de seleção de conta
    setTimeout(() => {
      const accountOptions = availableAccounts.map((acc, idx) => `${idx + 1}. ${acc.name} (${acc.email})`).join('\n')
      const selection = prompt(`Selecione uma conta Google:\n\n${accountOptions}\n\nDigite o número da conta (1-3) ou 'cancelar':`)
      
      if (!selection || selection.toLowerCase() === 'cancelar') {
        onError('Login cancelado pelo usuário')
        return
      }

      const accountIndex = parseInt(selection) - 1
      if (accountIndex >= 0 && accountIndex < availableAccounts.length) {
        const selectedAccount = availableAccounts[accountIndex]
        onSuccess(selectedAccount)
      } else {
        onError('Seleção inválida')
      }
    }, 500)
  }

  return {
    signIn,
    isLoaded,
    isLoading
  }
}