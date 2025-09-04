'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'
import { useToast } from '../../lib/toast'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Separator } from '../../components/ui/separator'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { BarChart3, Eye, EyeOff, Mail, Lock, User, AlertTriangle } from 'lucide-react'
import { GoogleSignInButton } from '../../components/auth/google-sign-in'
import { cn } from '../../lib/utils'

interface LoginForm {
  email: string
  password: string
}

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
  const toast = useToast()
  
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  })
  
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const { login, register, loginWithGoogle, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFormLoading(true)
    
    try {
      await login(loginForm.email, loginForm.password)
      toast.success('Login realizado!', 'Bem-vindo ao InsightTrader')
      router.push('/')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no login'
      toast.error('Erro no Login', errorMessage)
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Erro de Validação', 'As senhas não coincidem')
      return
    }
    
    if (registerForm.password.length < 6) {
      toast.error('Erro de Validação', 'A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    setIsFormLoading(true)
    
    try {
      await register(registerForm.name, registerForm.email, registerForm.password)
      toast.success('Conta criada!', 'Bem-vindo ao InsightTrader')
      router.push('/')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no registro'
      toast.error('Erro no Registro', errorMessage)
    } finally {
      setIsFormLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary shadow-lg shadow-primary/25">
              <BarChart3 className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            InsightTrader
          </h1>
          <p className="text-muted-foreground mt-1">Finance Analytics Platform</p>
        </div>

        <Card className="glass border-border/50 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? 'Fazer Login' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {isLogin 
                ? 'Entre com sua conta para continuar' 
                : 'Crie sua conta para começar'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">

            {/* Google Login Button */}
            <GoogleSignInButton 
              disabled={isFormLoading}
              className="w-full h-11 border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="pl-10 h-11 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-10 pr-10 h-11 border-border/50 focus:border-primary"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 btn-finance"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className="pl-10 h-11 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      className="pl-10 h-11 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      className="pl-10 pr-10 h-11 border-border/50 focus:border-primary"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua senha"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 h-11 border-border/50 focus:border-primary"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 btn-finance"
                  disabled={isFormLoading}
                >
                  {isFormLoading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            )}

            {/* Toggle between Login/Register */}
            <div className="text-center">
              <Button
                variant="link"
                className="text-muted-foreground hover:text-primary p-0"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setLoginForm({ email: '', password: '' })
                  setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' })
                }}
              >
                {isLogin 
                  ? 'Não tem uma conta? Cadastre-se' 
                  : 'Já tem uma conta? Faça login'
                }
              </Button>
            </div>

            {/* Demo Credentials */}
            {isLogin && (
              <div className="mt-6 space-y-3">
                <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                  <p className="text-xs text-muted-foreground text-center mb-2 font-medium">
                    Usuário Demo:
                  </p>
                  <div className="text-xs text-muted-foreground text-center space-y-1">
                    <div>Email: <span className="font-mono">demo@insighttrader.com</span></div>
                    <div>Senha: <span className="font-mono">demo123</span></div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary text-center mb-2 font-medium">
                    Administrador:
                  </p>
                  <div className="text-xs text-primary text-center space-y-1">
                    <div>Email: <span className="font-mono">marcioamr@gmail.com</span></div>
                    <div>Senha: <span className="font-mono">admin123</span></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}