'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { 
  Upload,
  Download,
  FileText,
  Trash2,
  RefreshCw,
  Plus,
  TrendingUp,
  Database,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react'
import { useToast } from '../../../lib/toast'
import Link from 'next/link'

interface CargaItem {
  id: string
  type: 'assets' | 'techniques' | 'users' | 'market_data'
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  createdAt: string
  updatedAt: string
  records?: number
  errorMessage?: string
}

export function CargasTab() {
  const router = useRouter()
  const [cargas, setCargas] = useState<CargaItem[]>([
    {
      id: '1',
      type: 'assets',
      name: 'Carga de Ativos B3',
      description: 'Importação de ativos da bolsa brasileira',
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:45:00Z',
      records: 420
    },
    {
      id: '2',
      type: 'techniques',
      name: 'Técnicas de Análise Padrão',
      description: 'Conjunto básico de técnicas de análise técnica',
      status: 'completed',
      createdAt: '2024-01-14T09:00:00Z',
      updatedAt: '2024-01-14T09:15:00Z',
      records: 25
    },
    {
      id: '3',
      type: 'market_data',
      name: 'Dados Históricos - Q4 2023',
      description: 'Preços históricos do quarto trimestre',
      status: 'running',
      createdAt: '2024-01-16T14:20:00Z',
      updatedAt: '2024-01-16T14:30:00Z'
    }
  ])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newCarga, setNewCarga] = useState<{
    type: CargaItem['type']
    name: string
    description: string
  }>({
    type: 'assets',
    name: '',
    description: ''
  })
  
  const { error, success } = useToast()

  const getStatusIcon = (status: CargaItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'running':
        return <Clock className="h-4 w-4 text-warning animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: CargaItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30'
      case 'running':
        return 'bg-warning/20 text-warning border-warning/30'
      case 'error':
        return 'bg-destructive/20 text-destructive border-destructive/30'
      default:
        return 'bg-muted/20 text-muted-foreground border-border'
    }
  }

  const getTypeIcon = (type: CargaItem['type']) => {
    switch (type) {
      case 'assets':
        return <TrendingUp className="h-4 w-4" />
      case 'techniques':
        return <FileText className="h-4 w-4" />
      case 'market_data':
        return <Database className="h-4 w-4" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: CargaItem['type']) => {
    const labels = {
      assets: 'Ativos',
      techniques: 'Técnicas',
      users: 'Usuários',
      market_data: 'Dados de Mercado'
    }
    return labels[type]
  }

  const handleCreateCarga = () => {
    // Se for carga de ativos, redirecionar para página de sincronização
    if (newCarga.type === 'assets') {
      setDialogOpen(false)
      router.push('/admin/asset-sync')
      return
    }

    if (!newCarga.name.trim() || !newCarga.description.trim()) {
      error("Erro", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const carga: CargaItem = {
      id: Date.now().toString(),
      type: newCarga.type,
      name: newCarga.name,
      description: newCarga.description,
      status: 'running',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCargas(prev => [carga, ...prev])
    setNewCarga({ type: 'assets', name: '', description: '' })
    setDialogOpen(false)

    success("Carga Iniciada", `A carga "${carga.name}" foi iniciada com sucesso.`)

    // Simular conclusão da carga após 3 segundos
    setTimeout(() => {
      setCargas(prev => prev.map(c => 
        c.id === carga.id 
          ? { ...c, status: 'completed' as const, records: Math.floor(Math.random() * 1000) + 100, updatedAt: new Date().toISOString() }
          : c
      ))
      
      success("Carga Concluída", `A carga "${carga.name}" foi concluída com sucesso.`)
    }, 3000)
  }

  const handleDeleteCarga = (id: string) => {
    const carga = cargas.find(c => c.id === id)
    setCargas(prev => prev.filter(c => c.id !== id))
    
    success("Carga Removida", `A carga "${carga?.name}" foi removida.`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Gestão de Cargas</h3>
          <p className="text-muted-foreground">
            Gerencie importações e cargas de dados do sistema
          </p>
        </div>
        <div className="flex gap-2 relative z-20">
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation()
              window.location.reload()
            }}
            className="hover:bg-primary/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation()
              router.push('/admin/asset-sync')
            }}
            className="hover:bg-primary/10"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Sincronizar Ativos
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Carga
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Carga de Dados</DialogTitle>
                <DialogDescription>
                  Configure uma nova carga de informações básicas do sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Carga</Label>
                  <Select
                    value={newCarga.type}
                    onValueChange={(value: CargaItem['type']) =>
                      setNewCarga({ ...newCarga, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assets">Ativos Financeiros</SelectItem>
                      <SelectItem value="techniques">Técnicas de Análise</SelectItem>
                      <SelectItem value="users">Usuários do Sistema</SelectItem>
                      <SelectItem value="market_data">Dados de Mercado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Carga</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Carga de Ativos B3..."
                    value={newCarga.name}
                    onChange={(e) => setNewCarga({ ...newCarga, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o que será importado nesta carga..."
                    value={newCarga.description}
                    onChange={(e) => setNewCarga({ ...newCarga, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCarga}>
                  Iniciar Carga
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Cargas
                </p>
                <p className="text-2xl font-bold">{cargas.length}</p>
              </div>
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Concluídas
                </p>
                <p className="text-2xl font-bold text-success">
                  {cargas.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Em Execução
                </p>
                <p className="text-2xl font-bold text-warning">
                  {cargas.filter(c => c.status === 'running').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Registros
                </p>
                <p className="text-2xl font-bold">
                  {cargas.reduce((sum, c) => sum + (c.records || 0), 0).toLocaleString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cargas List */}
      <div className="grid gap-4">
        {cargas.map((carga) => (
          <Card key={carga.id} className="border-2 border-transparent hover:border-primary/20 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {getTypeIcon(carga.type)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{carga.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(carga.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {carga.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Criada: {formatDate(carga.createdAt)}</span>
                      <span>Atualizada: {formatDate(carga.updatedAt)}</span>
                      {carga.records && (
                        <span className="font-medium">{carga.records.toLocaleString()} registros</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(carga.status)}
                    <Badge className={getStatusColor(carga.status)}>
                      {carga.status === 'completed' && 'Concluída'}
                      {carga.status === 'running' && 'Executando'}
                      {carga.status === 'error' && 'Erro'}
                      {carga.status === 'pending' && 'Pendente'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" title="Download Log">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCarga(carga.id)
                      }}
                      title="Remover"
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cargas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma carga encontrada</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Clique em "Nova Carga" para iniciar a importação de dados básicos do sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}