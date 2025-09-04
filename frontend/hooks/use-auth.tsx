'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { MockUserStorage } from '../lib/mock-storage'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider?: 'google' | 'email'
  role?: 'admin' | 'user'
  status?: 'active' | 'blocked'
  plan?: 'freemium' | 'premium' | 'enterprise'
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  handleGoogleAuthSuccess: (googleUser: { email: string; name: string; picture: string }) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Inicializa o mock storage
      MockUserStorage.init()
      
      const token = localStorage.getItem('auth-token')
      
      if (token) {
        const userEmail = localStorage.getItem('user-email') || 'usuario@insighttrader.com'
        
        // Busca o usuário no mock storage
        const storedUser = MockUserStorage.getUserByEmail(userEmail)
        
        if (storedUser && storedUser.status === 'blocked') {
          // Usuário está bloqueado, deslogar
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user-name')
          localStorage.removeItem('user-email')
          localStorage.removeItem('user-avatar')
          localStorage.removeItem('user-provider')
          localStorage.removeItem('user-created')
          localStorage.removeItem('user-status')
          setUser(null)
          return
        }

        if (storedUser) {
          // Sincronizar localStorage com o mock storage
          localStorage.setItem('user-status', storedUser.status || 'active')
          
          const mockUser: User = {
            id: storedUser.id,
            name: storedUser.name,
            email: storedUser.email,
            avatar: storedUser.avatar || '',
            provider: storedUser.provider || 'email',
            role: storedUser.role || 'user',
            status: storedUser.status || 'active',
            plan: storedUser.plan || 'freemium',
            createdAt: storedUser.createdAt || new Date().toISOString()
          }
          setUser(mockUser)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - in real app, call API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar credenciais
      if (!((email === 'demo@insighttrader.com' && password === 'demo123') ||
            (email === 'marcioamr@gmail.com' && password === 'admin123'))) {
        throw new Error('Credenciais inválidas')
      }
      
      // Buscar ou criar usuário no mock storage
      const storedUser = MockUserStorage.getUserByEmail(email)
      
      if (storedUser && storedUser.status === 'blocked') {
        throw new Error('Sua conta está bloqueada.')
      }
      
      const userData = storedUser || MockUserStorage.upsertUser({
        email,
        name: email === 'marcioamr@gmail.com' ? 'Marcio Rodrigues' : 'Demo User',
        provider: 'email',
        role: email === 'marcioamr@gmail.com' ? 'admin' : 'user',
        status: 'active',
        plan: email === 'marcioamr@gmail.com' ? 'enterprise' : 'freemium'
      })
      
      localStorage.setItem('auth-token', 'mock-token')
      localStorage.setItem('user-name', userData.name)
      localStorage.setItem('user-email', userData.email)
      localStorage.setItem('user-provider', userData.provider!)
      localStorage.setItem('user-created', userData.createdAt!)
      localStorage.setItem('user-status', userData.status!)
      
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar || '',
        provider: userData.provider || 'email',
        role: userData.role || 'user',
        status: userData.status || 'active',
        plan: userData.plan || 'freemium',
        createdAt: userData.createdAt || new Date().toISOString()
      }
      
      setUser(user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = () => {
    return new Promise<void>((resolve, reject) => {
      // Esta função será chamada pelo componente de login
      // A lógica real do Google Auth está no componente
      resolve()
    })
  }

  const handleGoogleAuthSuccess = async (googleUser: { email: string; name: string; picture: string }) => {
    setIsLoading(true)
    try {
      const googleEmail = googleUser.email
      
      // Verificar se usuário está bloqueado
      const storedUser = MockUserStorage.getUserByEmail(googleEmail)
      
      if (storedUser && storedUser.status === 'blocked') {
        throw new Error('Sua conta está bloqueada.')
      }
      
      // Buscar ou criar usuário no mock storage
      const userData = storedUser || MockUserStorage.upsertUser({
        email: googleEmail,
        name: googleUser.name,
        provider: 'google',
        avatar: googleUser.picture,
        role: googleEmail === 'marcioamr@gmail.com' ? 'admin' : 'user',
        status: 'active',
        plan: googleEmail === 'marcioamr@gmail.com' ? 'premium' : 'freemium'
      })
      
      localStorage.setItem('auth-token', 'google-token')
      localStorage.setItem('user-name', userData.name)
      localStorage.setItem('user-email', userData.email)
      localStorage.setItem('user-avatar', userData.avatar!)
      localStorage.setItem('user-provider', userData.provider!)
      localStorage.setItem('user-created', userData.createdAt!)
      localStorage.setItem('user-status', userData.status!)
      localStorage.setItem('user-plan', userData.plan!)
      localStorage.setItem('user-role', userData.role!)
      
      setUser(userData)
      return userData
    } catch (error) {
      setIsLoading(false)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock registration - in real app, call API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const user: User = {
        id: Date.now().toString(),
        name,
        email,
        avatar: '',
        provider: 'email',
        role: email === 'marcioamr@gmail.com' ? 'admin' : 'user',
        status: 'active',
        plan: 'freemium',
        createdAt: new Date().toISOString()
      }
      
      localStorage.setItem('auth-token', 'mock-register-token')
      localStorage.setItem('user-name', user.name)
      localStorage.setItem('user-email', user.email)
      localStorage.setItem('user-provider', user.provider!)
      localStorage.setItem('user-created', user.createdAt!)
      localStorage.setItem('user-status', user.status!)
      
      setUser(user)
    } catch (error) {
      throw new Error('Falha no registro')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-name')
    localStorage.removeItem('user-email')
    localStorage.removeItem('user-avatar')
    localStorage.removeItem('user-provider')
    localStorage.removeItem('user-created')
    localStorage.removeItem('user-status')
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return
    
    try {
      // Mock update - in real app, call API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUser = { ...user, ...data }
      
      // Atualizar no MockUserStorage
      const success = MockUserStorage.updateUser(user.id, {
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      })
      
      if (success) {
        setUser(updatedUser)
      } else {
        throw new Error('Falha ao atualizar no storage')
      }
    } catch (error) {
      throw new Error('Falha ao atualizar perfil')
    }
  }

  const uploadAvatar = async (file: File): Promise<string> => {
    try {
      // Mock upload - in real app, upload to cloud storage
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Converter para base64 para persistir através de recarregamentos
      const base64Url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      if (user) {
        // Atualizar no MockUserStorage diretamente
        const success = MockUserStorage.updateUser(user.id, { avatar: base64Url })
        
        if (success) {
          // Atualizar o estado local
          setUser({ ...user, avatar: base64Url })
        } else {
          throw new Error('Falha ao salvar avatar no storage')
        }
      }
      
      return base64Url
    } catch (error) {
      throw new Error('Falha no upload da imagem')
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    loginWithGoogle,
    handleGoogleAuthSuccess,
    register,
    logout,
    updateProfile,
    uploadAvatar,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}