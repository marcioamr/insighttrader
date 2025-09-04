'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { useRouter } from 'next/navigation'
import { MockUserStorage } from '../../lib/mock-storage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { UserAvatar } from '../../components/ui/user-avatar'
import { 
  Users, 
  Search, 
  Filter,
  ShieldCheck,
  ShieldX,
  Crown,
  UserCheck,
  UserX,
  MoreHorizontal,
  Calendar
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'

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


export default function UsersPage() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
    if (!isLoading && !isAdmin) {
      router.push('/')
      return
    }
    
    // Carregar usuários do mock storage
    if (!isLoading && isAdmin) {
      loadUsers()
    }
  }, [isAuthenticated, isLoading, isAdmin, router])

  const loadUsers = () => {
    MockUserStorage.init()
    const mockUsers = MockUserStorage.getAllUsers()
    const formattedUsers: User[] = mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
      role: user.role,
      status: user.status,
      plan: user.plan,
      createdAt: user.createdAt
    }))
    setUsers(formattedUsers)
  }

  const toggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    
    // Atualizar no mock storage
    const success = MockUserStorage.updateUserStatus(userId, newStatus as 'active' | 'blocked')
    
    if (success) {
      // Recarregar lista de usuários
      loadUsers()
      
      // Se for o usuário atual, forçar recarga da página para ativar o logout
      const currentUserEmail = localStorage.getItem('user-email')
      const targetUser = users.find(u => u.id === userId)
      if (targetUser && targetUser.email === currentUserEmail && newStatus === 'blocked') {
        // Dar um pequeno delay para o usuário ver a mudança
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    }
  }

  const updateUserPlan = (userId: string, newPlan: string) => {
    // Atualizar no mock storage
    const success = MockUserStorage.updateUserPlan(userId, newPlan as 'freemium' | 'premium' | 'enterprise')
    
    if (success) {
      // Recarregar lista de usuários
      loadUsers()
    }
  }

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesPlan = planFilter === 'all' || user.plan === planFilter
      return matchesSearch && matchesStatus && matchesPlan
    })
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-success/20 text-success border-success/30">
        <UserCheck className="h-3 w-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge className="bg-destructive/20 text-destructive border-destructive/30">
        <UserX className="h-3 w-3 mr-1" />
        Bloqueado
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-primary/20 text-primary border-primary/30">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge variant="outline">
        <Users className="h-3 w-3 mr-1" />
        Usuário
      </Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      freemium: { label: 'Freemium', className: 'bg-muted text-muted-foreground' },
      premium: { label: 'Premium', className: 'bg-warning/20 text-warning border-warning/30' },
      enterprise: { label: 'Enterprise', className: 'bg-primary/20 text-primary border-primary/30' }
    }
    
    const config = planConfig[plan as keyof typeof planConfig] || planConfig.freemium
    
    return (
      <Badge className={config.className}>
        <Crown className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const filteredUsers = getFilteredUsers()

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary" />
            Gerenciar Usuários
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Administre usuários, status e planos da plataforma
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="metric-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card className="metric-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">contas ativas</p>
          </CardContent>
        </Card>

        <Card className="metric-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Bloqueados</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {users.filter(u => u.status === 'blocked').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">contas bloqueadas</p>
          </CardContent>
        </Card>

        <Card className="metric-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Premium+</CardTitle>
            <Crown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {users.filter(u => u.plan !== 'freemium').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">assinantes pagos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="blocked">Bloqueados</option>
              </select>
            </div>

            <div className="sm:w-48">
              <Label htmlFor="plan">Plano</Label>
              <select
                id="plan"
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="freemium">Freemium</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Lista de todos os usuários da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <UserAvatar user={user} size="lg" />
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{user.name}</span>
                      {getRoleBadge(user.role || 'user')}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      {getStatusBadge(user.status || 'active')}
                      {getPlanBadge(user.plan || 'freemium')}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(user.createdAt || new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.role !== 'admin' && (
                      <DropdownMenuItem
                        onClick={() => toggleUserStatus(user.id, user.status || 'active')}
                        className="cursor-pointer"
                      >
                        {user.status === 'active' ? (
                          <>
                            <ShieldX className="h-4 w-4 mr-2 text-destructive" />
                            Bloquear
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-2 text-success" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem
                      onClick={() => updateUserPlan(user.id, 'freemium')}
                      className="cursor-pointer"
                    >
                      Alterar para Freemium
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() => updateUserPlan(user.id, 'premium')}
                      className="cursor-pointer"
                    >
                      Alterar para Premium
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem
                      onClick={() => updateUserPlan(user.id, 'enterprise')}
                      className="cursor-pointer"
                    >
                      Alterar para Enterprise
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum usuário encontrado</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}