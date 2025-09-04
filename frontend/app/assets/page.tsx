'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  Zap,
  BarChart3,
  Settings,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { AssetLogo } from '../../components/ui/asset-logo'
import type { Asset, APIResponse } from '../../types'

interface AssetFormData {
  symbol: string
  name: string
  type: 'stock' | 'currency' | 'commodity' | 'index'
  market: 'B3' | 'USD' | 'CRYPTO'
  isActive: boolean
}

export default function AssetsPage() {
  const router = useRouter()
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [marketFilter, setMarketFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalAssets, setTotalAssets] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [formData, setFormData] = useState<AssetFormData>({
    symbol: '',
    name: '',
    type: 'stock',
    market: 'B3',
    isActive: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchAssets()
  }, [currentPage, itemsPerPage, typeFilter, marketFilter, statusFilter])

  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [typeFilter, marketFilter, statusFilter])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (marketFilter !== 'all') params.append('market', marketFilter)
      if (statusFilter !== 'all') params.append('isActive', statusFilter === 'active' ? 'true' : 'false')
      
      const response = await fetch(`/api/assets?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setAssets(data.data)
        setFilteredAssets(data.data) // Since filtering is now done server-side
        setTotalPages(data.pagination.pages)
        setTotalAssets(data.pagination.total)
      } else {
        console.error('Error fetching assets:', data.error)
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  // Removed applyFilters function since filtering is now done server-side

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Símbolo é obrigatório'
    } else if (formData.symbol.length > 10) {
      newErrors.symbol = 'Símbolo deve ter no máximo 10 caracteres'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.length > 200) {
      newErrors.name = 'Nome deve ter no máximo 200 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const submitData = {
        ...formData,
        symbol: formData.symbol.toUpperCase()
      }

      const url = editingAsset ? `/api/assets/${editingAsset._id}` : '/api/assets'
      const method = editingAsset ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      
      if (response.ok) {
        await fetchAssets()
        handleCloseDialog()
      } else {
        const errorData = await response.json()
        if (response.status === 400 && errorData.message?.includes('already exists')) {
          setErrors({ symbol: 'Este símbolo já está cadastrado' })
        } else {
          console.error('Error saving asset:', errorData)
        }
      }
    } catch (error) {
      console.error('Error saving asset:', error)
    }
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setFormData({
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      market: asset.market,
      isActive: asset.isActive
    })
    setDialogOpen(true)
  }

  const handleDelete = async (assetId: string) => {
    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchAssets()
      } else {
        console.error('Error deleting asset')
      }
    } catch (error) {
      console.error('Error deleting asset:', error)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingAsset(null)
    setFormData({
      symbol: '',
      name: '',
      type: 'stock',
      market: 'B3',
      isActive: true
    })
    setErrors({})
  }

  const renderAssetLogo = (asset: Asset) => {
    // Prioridade: logoPath (imagem baixada localmente) sobre as URLs remotas
    const logoPath = asset.logoPath || null
    return (
      <AssetLogo 
        symbol={asset.symbol} 
        type={asset.type} 
        size="lg"
        showFallback={true}
        logoPath={logoPath}
      />
    )
  }

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return null
    
    if (marketCap >= 1e9) {
      return `R$ ${(marketCap / 1e9).toFixed(1)}B`
    } else if (marketCap >= 1e6) {
      return `R$ ${(marketCap / 1e6).toFixed(1)}M`
    } else {
      return `R$ ${marketCap.toLocaleString()}`
    }
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      stock: 'Ação',
      currency: 'Moeda',
      commodity: 'Commodity',
      index: 'Índice'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getMarketColor = (market: string) => {
    switch (market) {
      case 'B3':
        return 'bg-success/20 text-success border-success/30'
      case 'USD':
        return 'bg-info/20 text-info border-info/30'
      case 'CRYPTO':
        return 'bg-warning/20 text-warning border-warning/30'
      default:
        return 'bg-muted/20 text-muted-foreground border-border'
    }
  }

  if (loading) {
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Gestão de Ativos
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gerencie os ativos financeiros para análise técnica
          </p>
        </div>
        <div className="flex gap-2 items-center">
          {/* Items per page selector */}
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Filtros */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="stock">Ações</SelectItem>
              <SelectItem value="currency">Moedas</SelectItem>
              <SelectItem value="commodity">Commodities</SelectItem>
              <SelectItem value="index">Índices</SelectItem>
            </SelectContent>
          </Select>

          <Select value={marketFilter} onValueChange={setMarketFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Mercado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="B3">B3</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="CRYPTO">Crypto</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={fetchAssets} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Ativo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAsset ? 'Editar Ativo' : 'Novo Ativo'}
                </DialogTitle>
                <DialogDescription>
                  {editingAsset 
                    ? 'Atualize as informações do ativo.'
                    : 'Adicione um novo ativo para análise técnica.'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="symbol">Símbolo</Label>
                  <Input
                    id="symbol"
                    placeholder="Ex: PETR4, VALE3, WDOM25..."
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    className={errors.symbol ? 'border-red-500' : ''}
                    maxLength={10}
                  />
                  {errors.symbol && (
                    <p className="text-sm text-red-500">{errors.symbol}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Petrobras PN, Vale ON..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                    maxLength={200}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'stock' | 'currency' | 'commodity' | 'index') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Ação</SelectItem>
                      <SelectItem value="currency">Moeda</SelectItem>
                      <SelectItem value="commodity">Commodity</SelectItem>
                      <SelectItem value="index">Índice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="market">Mercado</Label>
                  <Select
                    value={formData.market}
                    onValueChange={(value: 'B3' | 'USD' | 'CRYPTO') =>
                      setFormData({ ...formData, market: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mercado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B3">B3 (Brasil)</SelectItem>
                      <SelectItem value="USD">USD (Internacional)</SelectItem>
                      <SelectItem value="CRYPTO">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Ativo para análises</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingAsset ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Asset Stats */}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalAssets)} de {totalAssets} ativos
          </div>
          <div>
            Página {currentPage} de {totalPages}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAssets.map((asset) => (
          <Card key={asset._id} className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {renderAssetLogo(asset)}
                    <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {!asset.isActive && (
                      <Badge variant="secondary">
                        Inativo
                      </Badge>
                    )}
                    <Badge className={getMarketColor(asset.market)}>
                      {asset.market}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {getTypeLabel(asset.type)}
                  </Badge>
                </div>
                <div className="flex gap-1 relative z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(asset)
                    }}
                    title="Editar"
                    className="hover:bg-primary/10"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/assets/${asset._id}`)
                    }}
                    title="Gerenciar Técnicas"
                    className="hover:bg-primary/10"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Excluir"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o ativo "{asset.symbol}"? 
                          Esta ação não pode ser desfeita e removerá todas as associações 
                          e análises relacionadas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(asset._id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm font-medium">
                {asset.name}
              </CardDescription>
              
              {/* Informações da API HG Brasil */}
              {asset.metadata?.hg_data && (
                <div className="mt-3 space-y-2">
                  {asset.metadata.hg_data.sector && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BarChart3 className="h-3 w-3" />
                      <span>{asset.metadata.hg_data.sector}</span>
                    </div>
                  )}
                  
                  {asset.metadata.hg_data.market_cap && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>{formatMarketCap(asset.metadata.hg_data.market_cap)}</span>
                    </div>
                  )}
                  
                  {asset.metadata.hg_data.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {asset.metadata.hg_data.description}
                    </p>
                  )}
                  
                  {asset.metadata.hg_data.website && (
                    <div className="flex items-center gap-2 text-xs">
                      <a 
                        href={asset.metadata.hg_data.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 relative z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3 w-3" />
                        Website
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 text-xs text-muted-foreground">
                Atualizado em {formatDate(asset.updatedAt)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                {totalAssets === 0 ? 'Nenhum ativo cadastrado' : 'Nenhum ativo encontrado'}
              </h3>
              <p className="text-muted-foreground">
                {totalAssets === 0 
                  ? 'Clique em "Novo Ativo" para adicionar seu primeiro ativo para análise.'
                  : 'Tente ajustar os filtros para encontrar os ativos desejados.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}