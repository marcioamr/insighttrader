'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { 
  ArrowLeft,
  Settings,
  Database,
  Upload,
  Users,
  BarChart3,
  Shield
} from 'lucide-react'
import { CargasTab } from './components/cargas-tab'
import { UsersTab } from './components/users-tab'

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()} className="glass">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Administração do Sistema
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Painel de controle e gestão do InsightTrader
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary">
          <Shield className="h-3 w-3 mr-1" />
          Administrador
        </Badge>
      </div>

      {/* Admin Tabs */}
      <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Ferramentas Administrativas
          </CardTitle>
          <CardDescription>
            Gerencie todos os aspectos do sistema InsightTrader
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cargas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="cargas" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Cargas</span>
              </TabsTrigger>
              <TabsTrigger value="usuarios" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Usuários</span>
              </TabsTrigger>
              <TabsTrigger value="sistema" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Sistema</span>
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Relatórios</span>
              </TabsTrigger>
              <TabsTrigger value="configuracoes" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Config</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cargas">
              <CargasTab />
            </TabsContent>

            <TabsContent value="usuarios">
              <UsersTab />
            </TabsContent>

            <TabsContent value="sistema">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações do Sistema</CardTitle>
                  <CardDescription>
                    Monitore performance, logs e configurações gerais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4" />
                    <p>Funcionalidade em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="relatorios">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Administrativos</CardTitle>
                  <CardDescription>
                    Relatórios de uso, performance e analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Funcionalidade em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuracoes">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Avançadas</CardTitle>
                  <CardDescription>
                    Configurações de segurança, integração e personalização
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4" />
                    <p>Funcionalidade em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}