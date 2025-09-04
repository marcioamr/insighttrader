'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { AssetLogo } from '../../components/ui/asset-logo'
import { 
  Briefcase, 
  Plus, 
  Minus, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Bell,
  BellOff,
  Filter,
  CheckCircle2,
  Circle
} from 'lucide-react'
import api from '../../lib/api'
import type { Asset, APIResponse } from '../../types'

interface Portfolio {
  userId: string
  assets: string[]
  alertsEnabled: boolean
}

export default function PortfolioPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  
  const [assets, setAssets] = useState<Asset[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio>({ userId: '', assets: [], alertsEnabled: true })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
    if (isAuthenticated && user) {
      fetchData()
    }
  }, [isAuthenticated, isLoading, user, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [assetsRes] = await Promise.all([
        api.get<APIResponse<Asset[]>>('/api/assets?limit=100')
      ])
      
      setAssets(assetsRes.data.data)
      
      // Load portfolio from localStorage (mock)
      const savedPortfolio = localStorage.getItem(`portfolio-${user?.id}`)
      if (savedPortfolio) {
        setPortfolio(JSON.parse(savedPortfolio))
      } else {
        setPortfolio({
          userId: user?.id || '',
          assets: [],
          alertsEnabled: true
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePortfolio = async (newPortfolio: Portfolio) => {
    setSaving(true)
    try {
      // Save to localStorage (mock)
      localStorage.setItem(`portfolio-${user?.id}`, JSON.stringify(newPortfolio))
      setPortfolio(newPortfolio)
    } catch (error) {
      console.error('Error saving portfolio:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleAssetInPortfolio = async (assetId: string) => {
    const newAssets = portfolio.assets.includes(assetId)
      ? portfolio.assets.filter(id => id !== assetId)
      : [...portfolio.assets, assetId]
    
    await savePortfolio({
      ...portfolio,
      assets: newAssets
    })
  }

  const toggleAlerts = async () => {
    await savePortfolio({
      ...portfolio,
      alertsEnabled: !portfolio.alertsEnabled
    })
  }

  const clearPortfolio = async () => {
    await savePortfolio({
      ...portfolio,
      assets: []
    })
  }

  const addAllFilteredAssets = async () => {
    const filteredAssets = getFilteredAssets()
    const newAssets = Array.from(new Set([...portfolio.assets, ...filteredAssets.map(a => a._id)]))
    
    await savePortfolio({
      ...portfolio,
      assets: newAssets
    })
  }

  const getFilteredAssets = () => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || asset.type === selectedType
      return matchesSearch && matchesType
    })
  }

  const portfolioAssets = assets.filter(asset => portfolio.assets.includes(asset._id))
  const filteredAssets = getFilteredAssets()
  const availableTypes = Array.from(new Set(assets.map(asset => asset.type)))

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-primary" />
            Minha Carteira
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Selecione os ativos para receber alertas personalizados
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleAlerts}
            variant={portfolio.alertsEnabled ? "default" : "outline"}
            className="btn-finance"
          >
            {portfolio.alertsEnabled ? (
              <Bell className="h-4 w-4 mr-2" />
            ) : (
              <BellOff className="h-4 w-4 mr-2" />
            )}
            Alertas {portfolio.alertsEnabled ? 'Ativados' : 'Desativados'}
          </Button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="metric-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos na Carteira</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolio.assets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">ativos selecionados</p>
          </CardContent>
        </Card>

        <Card className="metric-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            {portfolio.alertsEnabled ? (
              <Bell className="h-4 w-4 text-success" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {portfolio.alertsEnabled ? 'Ativo' : 'Inativo'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {portfolio.alertsEnabled ? 'recebendo alertas' : 'alertas pausados'}
            </p>
          </CardContent>
        </Card>

        <Card className="metric-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <TrendingUp className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">{assets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">ativos disponíveis</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolio">Minha Carteira</TabsTrigger>
          <TabsTrigger value="add">Adicionar Ativos</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Ativos Selecionados</CardTitle>
                <CardDescription>
                  Ativos que você está acompanhando em sua carteira
                </CardDescription>
              </div>
              <Button
                onClick={clearPortfolio}
                variant="outline"
                size="sm"
                disabled={portfolio.assets.length === 0 || saving}
              >
                <Minus className="h-4 w-4 mr-2" />
                Limpar Tudo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {portfolioAssets.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum ativo selecionado</p>
                    <p className="text-sm">Use a aba "Adicionar Ativos" para começar</p>
                  </div>
                ) : (
                  portfolioAssets.map((asset) => (
                    <div
                      key={asset._id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <AssetLogo
                          symbol={asset.symbol}
                          type={asset.type}
                          size="sm"
                          showFallback={true}
                        />
                        <div>
                          <div className="font-medium">{asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => toggleAssetInPortfolio(asset._id)}
                        variant="outline"
                        size="sm"
                        disabled={saving}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Ativos</CardTitle>
              <CardDescription>
                Selecione os ativos que deseja acompanhar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nome ou código do ativo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="sm:w-48">
                  <Label htmlFor="type">Tipo</Label>
                  <select
                    id="type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="all">Todos os tipos</option>
                    {availableTypes.map(type => (
                      <option key={type} value={type}>{type.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredAssets.length} ativos encontrados
                </p>
                <Button
                  onClick={addAllFilteredAssets}
                  variant="outline"
                  size="sm"
                  disabled={filteredAssets.length === 0 || saving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Todos
                </Button>
              </div>

              {/* Assets List */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                {filteredAssets.map((asset) => {
                  const isInPortfolio = portfolio.assets.includes(asset._id)
                  
                  return (
                    <div
                      key={asset._id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <AssetLogo
                          symbol={asset.symbol}
                          type={asset.type}
                          size="sm"
                          showFallback={true}
                        />
                        <div>
                          <div className="font-medium flex items-center">
                            {asset.symbol}
                            {isInPortfolio && (
                              <CheckCircle2 className="h-4 w-4 ml-2 text-success" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => toggleAssetInPortfolio(asset._id)}
                        variant={isInPortfolio ? "default" : "outline"}
                        size="sm"
                        disabled={saving}
                      >
                        {isInPortfolio ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )
                })}
                
                {filteredAssets.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum ativo encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}