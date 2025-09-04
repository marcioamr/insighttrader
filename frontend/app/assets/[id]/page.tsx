'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../components/ui/select'
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
} from '../../../components/ui/alert-dialog'
import { 
  ArrowLeft,
  Plus, 
  Minus,
  Trash2, 
  RefreshCw,
  Clock,
  Zap,
  CheckCircle,
  Search,
  Filter,
  Power,
  PowerOff
} from 'lucide-react'
import api from '../../../lib/api'
import { formatDate } from '../../../lib/utils'
import { AssetLogo } from '../../../components/ui/asset-logo'
import type { Asset, AnalysisTechnique, AssetTechnique, APIResponse } from '../../../types'

export default function AssetDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const assetId = params?.id as string

  const [asset, setAsset] = useState<Asset | null>(null)
  const [availableTechniques, setAvailableTechniques] = useState<AnalysisTechnique[]>([])
  const [filteredTechniques, setFilteredTechniques] = useState<AnalysisTechnique[]>([])
  const [assetTechniques, setAssetTechniques] = useState<AssetTechnique[]>([])
  const [loading, setLoading] = useState(true)
  const [techniquesLoading, setTechniquesLoading] = useState(false)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [periodicityFilter, setPeriodicityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all') // all, associated, available

  useEffect(() => {
    if (assetId) {
      fetchAssetData()
    }
  }, [assetId])

  useEffect(() => {
    filterTechniques()
  }, [searchTerm, periodicityFilter, statusFilter, availableTechniques, assetTechniques])

  const fetchAssetData = async () => {
    try {
      setLoading(true)
      const [assetRes, techniquesRes, assetTechniquesRes] = await Promise.all([
        api.get<APIResponse<Asset>>(`/api/assets/${assetId}`),
        api.get<APIResponse<AnalysisTechnique[]>>('/api/analysis-techniques?isActive=true'),
        api.get<APIResponse<AssetTechnique[]>>(`/api/asset-techniques?asset=${assetId}`)
      ])
      
      setAsset(assetRes.data.data)
      setAvailableTechniques(techniquesRes.data.data)
      setAssetTechniques(assetTechniquesRes.data.data)
    } catch (error) {
      console.error('Error fetching asset data:', error)
      router.push('/assets') // Redirect if asset not found
    } finally {
      setLoading(false)
    }
  }

  const filterTechniques = () => {
    let filtered = [...availableTechniques]

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(technique => 
        technique.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technique.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro de periodicidade
    if (periodicityFilter !== 'all') {
      filtered = filtered.filter(technique => technique.periodicity === periodicityFilter)
    }

    // Filtro de status (associada ou disponível)
    if (statusFilter === 'associated') {
      filtered = filtered.filter(technique => 
        assetTechniques.some(at => at.technique._id === technique._id)
      )
    } else if (statusFilter === 'available') {
      filtered = filtered.filter(technique => 
        !assetTechniques.some(at => at.technique._id === technique._id)
      )
    }

    setFilteredTechniques(filtered)
  }

  const handleAddTechnique = async (techniqueId: string) => {
    if (!asset) return

    try {
      setTechniquesLoading(true)
      await api.post('/api/asset-techniques', {
        asset: asset._id,
        technique: techniqueId,
        isActive: true
      })
      
      // Refresh asset techniques
      const assetTechniquesRes = await api.get<APIResponse<AssetTechnique[]>>(`/api/asset-techniques?asset=${assetId}`)
      setAssetTechniques(assetTechniquesRes.data.data)
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert('Esta técnica já está associada ao ativo')
      } else {
        console.error('Error adding technique:', error)
      }
    } finally {
      setTechniquesLoading(false)
    }
  }

  const handleRemoveTechnique = async (assetTechniqueId: string) => {
    try {
      setTechniquesLoading(true)
      await api.delete(`/api/asset-techniques/${assetTechniqueId}`)
      
      // Refresh asset techniques
      const assetTechniquesRes = await api.get<APIResponse<AssetTechnique[]>>(`/api/asset-techniques?asset=${assetId}`)
      setAssetTechniques(assetTechniquesRes.data.data)
    } catch (error) {
      console.error('Error removing technique:', error)
    } finally {
      setTechniquesLoading(false)
    }
  }

  const handleToggleTechniqueStatus = async (assetTechnique: AssetTechnique) => {
    try {
      setTechniquesLoading(true)
      await api.put(`/api/asset-techniques/${assetTechnique._id}`, {
        isActive: !assetTechnique.isActive
      })
      
      // Refresh asset techniques
      const assetTechniquesRes = await api.get<APIResponse<AssetTechnique[]>>(`/api/asset-techniques?asset=${assetId}`)
      setAssetTechniques(assetTechniquesRes.data.data)
    } catch (error) {
      console.error('Error toggling technique status:', error)
    } finally {
      setTechniquesLoading(false)
    }
  }

  const handleAddAllTechniques = async () => {
    if (!asset) return

    try {
      setTechniquesLoading(true)
      
      // Get techniques not yet associated
      const availableToAdd = availableTechniques.filter(technique => 
        !assetTechniques.some(at => at.technique._id === technique._id)
      )

      // Get inactive techniques that need to be reactivated
      const inactiveTechniques = assetTechniques.filter(at => !at.isActive)

      // Add new techniques and reactivate inactive ones in parallel
      const operations = [
        // Add new techniques
        ...availableToAdd.map(technique =>
          api.post('/api/asset-techniques', {
            asset: asset._id,
            technique: technique._id,
            isActive: true
          }).catch(error => {
            console.error(`Error adding technique ${technique.title}:`, error)
          })
        ),
        // Reactivate inactive techniques
        ...inactiveTechniques.map(assetTechnique =>
          api.put(`/api/asset-techniques/${assetTechnique._id}`, {
            isActive: true
          }).catch(error => {
            console.error(`Error reactivating technique ${assetTechnique.technique.title}:`, error)
          })
        )
      ]

      await Promise.all(operations)
      
      // Refresh asset techniques
      const assetTechniquesRes = await api.get<APIResponse<AssetTechnique[]>>(`/api/asset-techniques?asset=${assetId}`)
      setAssetTechniques(assetTechniquesRes.data.data)
    } catch (error) {
      console.error('Error adding/activating all techniques:', error)
    } finally {
      setTechniquesLoading(false)
    }
  }

  const handleRemoveAllTechniques = async () => {
    if (!asset || assetTechniques.length === 0) return

    try {
      setTechniquesLoading(true)
      
      // Remove all techniques in parallel
      await Promise.all(
        assetTechniques.map(assetTechnique =>
          api.delete(`/api/asset-techniques/${assetTechnique._id}`).catch(error => {
            console.error(`Error removing technique ${assetTechnique.technique.title}:`, error)
          })
        )
      )
      
      // Refresh asset techniques
      const assetTechniquesRes = await api.get<APIResponse<AssetTechnique[]>>(`/api/asset-techniques?asset=${assetId}`)
      setAssetTechniques(assetTechniquesRes.data.data)
    } catch (error) {
      console.error('Error removing all techniques:', error)
    } finally {
      setTechniquesLoading(false)
    }
  }

  const getPeriodicityLabel = (periodicity: string) => {
    const labels = {
      hourly: 'A cada hora',
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal'
    }
    return labels[periodicity as keyof typeof labels] || periodicity
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
        return 'bg-green-100 text-green-800 border-green-200'
      case 'USD':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CRYPTO':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isAssociated = (techniqueId: string) => {
    return assetTechniques.some(at => at.technique._id === techniqueId)
  }

  const getAssetTechnique = (techniqueId: string) => {
    return assetTechniques.find(at => at.technique._id === techniqueId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Ativo não encontrado</h1>
          <Button onClick={() => router.push('/assets')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Ativos
          </Button>
        </div>
      </div>
    )
  }

  // Calculado dinamicamente para atualizar em tempo real
  const availableToAdd = availableTechniques.filter(technique => 
    !assetTechniques.some(at => at.technique._id === technique._id)
  )
  
  // Técnicas que estão associadas mas inativas
  const inactiveTechniques = assetTechniques.filter(at => !at.isActive)
  
  // Total de técnicas que podem ser "ativadas" (não associadas + inativas)
  const actionableTechniques = availableToAdd.length + inactiveTechniques.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/assets')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <AssetLogo 
              symbol={asset.symbol} 
              type={asset.type} 
              size="lg"
              showFallback={true}
            />
            <div>
              <h1 className="text-3xl font-bold">{asset.symbol}</h1>
              <p className="text-muted-foreground">{asset.name}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getMarketColor(asset.market)}>
            {asset.market}
          </Badge>
          <Badge variant="outline">
            {getTypeLabel(asset.type)}
          </Badge>
          {!asset.isActive && (
            <Badge variant="secondary">Inativo</Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Técnicas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetTechniques.length}</div>
            <p className="text-xs text-muted-foreground">
              de {availableTechniques.length} disponíveis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Técnicas Ativas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assetTechniques.filter(at => at.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              técnicas em execução
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criado em</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(asset.createdAt)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar técnicas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={periodicityFilter} onValueChange={setPeriodicityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Periodicidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="hourly">A cada hora</SelectItem>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="associated">Associadas</SelectItem>
              <SelectItem value="available">Disponíveis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAssetData} variant="outline" disabled={techniquesLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          {/* Botão Vincular Todas/Restantes */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={techniquesLoading}
                variant={actionableTechniques > 0 ? "default" : "outline"}
              >
                <Plus className="h-4 w-4 mr-2" />
                {actionableTechniques === 0 
                  ? "Todas Ativas"
                  : availableToAdd.length === 0 && inactiveTechniques.length > 0
                    ? `Ativar Inativas (${inactiveTechniques.length})`
                    : availableToAdd.length === availableTechniques.length 
                      ? `Vincular Todas (${availableToAdd.length})`
                      : availableToAdd.length > 0 && inactiveTechniques.length > 0
                        ? `Vincular/Ativar (${actionableTechniques})`
                        : `Vincular Restantes (${availableToAdd.length})`
                }
              </Button>
            </AlertDialogTrigger>
            {actionableTechniques > 0 && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {availableToAdd.length === 0 && inactiveTechniques.length > 0
                      ? 'Ativar Técnicas Inativas'
                      : availableToAdd.length === availableTechniques.length 
                        ? 'Vincular Todas as Técnicas'
                        : availableToAdd.length > 0 && inactiveTechniques.length > 0
                          ? 'Vincular e Ativar Técnicas'
                          : 'Vincular Técnicas Restantes'
                    }
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {availableToAdd.length === 0 && inactiveTechniques.length > 0
                      ? `Tem certeza que deseja ativar as ${inactiveTechniques.length} técnicas inativas do ativo ${asset?.symbol}?`
                      : availableToAdd.length === availableTechniques.length 
                        ? `Tem certeza que deseja vincular todas as ${availableToAdd.length} técnicas disponíveis ao ativo ${asset?.symbol}?`
                        : availableToAdd.length > 0 && inactiveTechniques.length > 0
                          ? `Tem certeza que deseja vincular ${availableToAdd.length} novas técnicas e ativar ${inactiveTechniques.length} técnicas inativas do ativo ${asset?.symbol}?`
                          : `Tem certeza que deseja vincular as ${availableToAdd.length} técnicas restantes ao ativo ${asset?.symbol}? Você já possui ${assetTechniques.length} técnicas vinculadas.`
                    } {availableToAdd.length > 0 ? 'Todas serão ativadas por padrão.' : ''}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddAllTechniques}>
                    {availableToAdd.length === 0 && inactiveTechniques.length > 0
                      ? 'Ativar Inativas'
                      : availableToAdd.length === availableTechniques.length 
                        ? 'Vincular Todas'
                        : availableToAdd.length > 0 && inactiveTechniques.length > 0
                          ? 'Vincular e Ativar'
                          : 'Vincular Restantes'
                    }
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>

          {/* Botão Desvincular Todas */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                disabled={techniquesLoading || assetTechniques.length === 0}
                variant={assetTechniques.length > 0 ? "destructive" : "outline"}
              >
                <Minus className="h-4 w-4 mr-2" />
                Desvincular Todas ({assetTechniques.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desvincular Todas as Técnicas</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja desvincular todas as {assetTechniques.length} técnicas associadas ao ativo {asset?.symbol}? 
                  Esta ação removerá todas as associações e não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleRemoveAllTechniques}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Desvincular Todas
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Techniques Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTechniques.map((technique) => {
          const associated = isAssociated(technique._id)
          const assetTechnique = getAssetTechnique(technique._id)
          
          return (
            <Card key={technique._id} className={`relative ${associated ? 'ring-2 ring-primary ring-opacity-20' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{technique.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {getPeriodicityLabel(technique.periodicity)}
                      </Badge>
                      {associated && (
                        <Badge variant={assetTechnique?.isActive ? 'default' : 'secondary'} className="text-xs">
                          {assetTechnique?.isActive ? 'Ativa' : 'Inativa'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {associated ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => assetTechnique && handleToggleTechniqueStatus(assetTechnique)}
                          title={assetTechnique?.isActive ? 'Desativar' : 'Ativar'}
                          disabled={techniquesLoading}
                        >
                          {assetTechnique?.isActive ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => assetTechnique && handleRemoveTechnique(assetTechnique._id)}
                          title="Remover"
                          disabled={techniquesLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTechnique(technique._id)}
                        disabled={techniquesLoading}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {technique.description}
                </CardDescription>
                <div className="mt-4 text-xs text-muted-foreground">
                  Criado em {formatDate(technique.createdAt)}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTechniques.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Nenhuma técnica encontrada</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros para encontrar as técnicas desejadas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}