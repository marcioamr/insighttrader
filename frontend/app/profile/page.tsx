'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { UserAvatar } from '../../components/ui/user-avatar'
import { Separator } from '../../components/ui/separator'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { 
  User, 
  Mail, 
  Calendar,
  Shield,
  Crown,
  Camera,
  Save,
  X,
  Edit,
  CheckCircle
} from 'lucide-react'

export default function ProfilePage() {
  const { user, updateProfile, uploadAvatar, isAuthenticated, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaveLoading] = useState(false)
  const [isUploadingAvatar, setUploadingAvatar] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setMessage('')
    setError('')
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaveLoading(true)
    setMessage('')
    setError('')
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email
      })
      setMessage('Perfil atualizado com sucesso!')
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    })
    setIsEditing(false)
    setMessage('')
    setError('')
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida')
      return
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    setUploadingAvatar(true)
    setMessage('')
    setError('')

    try {
      await uploadAvatar(file)
      setMessage('Avatar atualizado com sucesso!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem')
    } finally {
      setUploadingAvatar(false)
      // Reset input
      event.target.value = ''
    }
  }

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      freemium: { 
        label: 'Freemium', 
        className: 'bg-muted text-muted-foreground',
        icon: User
      },
      premium: { 
        label: 'Premium', 
        className: 'bg-warning/20 text-warning border-warning/30',
        icon: Crown
      },
      enterprise: { 
        label: 'Enterprise', 
        className: 'bg-primary/20 text-primary border-primary/30',
        icon: Shield
      }
    }
    
    const config = planConfig[plan as keyof typeof planConfig] || planConfig.freemium
    const IconComponent = config.icon
    
    return (
      <Badge className={config.className}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center">
            <User className="h-8 w-8 mr-3 text-primary" />
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <Alert className="border-success/50 text-success bg-success/10">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-destructive/50 text-destructive bg-destructive/10">
          <X className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações básicas
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave}
                  size="sm"
                  disabled={isSaving}
                  className="btn-finance"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Seu nome completo"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing && isAdmin ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    disabled={isSaving}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Plano Atual</Label>
                <div className="flex items-center space-x-2">
                  {getPlanBadge(user.plan || 'freemium')}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Conta</Label>
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Administrador
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <User className="h-3 w-3 mr-1" />
                      Usuário
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Membro desde</Label>
              <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(user.createdAt || new Date().toISOString())}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
            <CardDescription>
              Clique na imagem para alterar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <UserAvatar 
                user={user} 
                size="xl"
                className="transition-all duration-200 group-hover:opacity-80"
              />
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Clique na imagem para alterar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos: JPG, PNG, GIF (máx. 5MB)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Detalhes sobre sua conta na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Método de Login</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline">
                    {user.provider === 'google' ? '🔍 Google' : '📧 Email'}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Status da Conta</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-success/20 text-success border-success/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ativa
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">ID do Usuário</Label>
                <div className="p-2 bg-muted/30 rounded text-xs font-mono mt-1">
                  {user.id}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Último Acesso</Label>
                <div className="p-2 bg-muted/30 rounded text-sm mt-1">
                  Agora
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}