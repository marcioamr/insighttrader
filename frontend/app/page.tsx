'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { TrendingUp, TrendingDown, Minus, Activity, Target, Eye, EyeOff } from 'lucide-react'
import api from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'
import { AssetLogo } from '../components/ui/asset-logo'
import type { DashboardStats, Insight, APIResponse } from '../types'

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [suggestions, setSuggestions] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [portfolioFilter, setPortfolioFilter] = useState<{assets: string[], alertsEnabled: boolean} | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get user's portfolio
      const portfolio = localStorage.getItem(`portfolio-${user?.id}`)
      const portfolioData = portfolio ? JSON.parse(portfolio) : null
      const portfolioAssets = portfolioData?.assets || []
      
      const [statsRes, suggestionsRes] = await Promise.all([
        api.get<APIResponse<DashboardStats>>('/api/insights/dashboard'),
        api.get<APIResponse<Insight[]>>('/api/insights/suggestions?limit=50')
      ])
      
      setStats(statsRes.data.data)
      
      // Filter suggestions by portfolio assets if portfolio exists and alerts are enabled
      let filteredSuggestions = suggestionsRes.data.data
      if (portfolioData?.alertsEnabled && portfolioAssets.length > 0) {
        filteredSuggestions = suggestionsRes.data.data.filter(insight => 
          portfolioAssets.includes(insight.asset._id)
        ).slice(0, 10)
      } else {
        filteredSuggestions = suggestionsRes.data.data.slice(0, 10)
      }
      
      setSuggestions(filteredSuggestions)
      setPortfolioFilter(portfolioData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const hideInsight = async (insightId: string) => {
    try {
      await api.patch(`/api/insights/${insightId}/hide`)
      fetchDashboardData()
    } catch (error) {
      console.error('Error hiding insight:', error)
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-success" />
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Minus className="h-4 w-4 text-warning" />
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return 'status-up'
      case 'sell':
        return 'status-down'
      default:
        return 'bg-warning/20 text-warning border-warning/30'
    }
  }

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return 'Investir'
      case 'sell':
        return 'Sair da posição'
      default:
        return 'Manter'
    }
  }

  const renderAssetLogo = (asset: any) => {
    return (
      <AssetLogo 
        symbol={asset.symbol} 
        type={asset.type} 
        size="sm"
        showFallback={true}
      />
    )
  }

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Análise Técnica de Ativos Financeiros
          </p>
        </div>
        <Button onClick={fetchDashboardData} className="btn-finance">
          <Activity className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="metric-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Insights</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totals.insights}</div>
              <p className="text-xs text-muted-foreground mt-1">análises realizadas</p>
            </CardContent>
          </Card>

          <Card className="metric-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recomendações de Compra</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{stats.totals.buy}</div>
              <p className="text-xs text-muted-foreground mt-1">oportunidades detectadas</p>
            </CardContent>
          </Card>

          <Card className="metric-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recomendações de Venda</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.totals.sell}</div>
              <p className="text-xs text-muted-foreground mt-1">sinais de saída</p>
            </CardContent>
          </Card>

          <Card className="metric-card card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confiança Média</CardTitle>
              <Target className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info">
                {stats.avgConfidence.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">precisão das análises</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggestions">Sugestões de Posição</TabsTrigger>
          <TabsTrigger value="recent">Insights Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {/* Portfolio Filter Info */}
          {portfolioFilter && portfolioFilter.alertsEnabled && portfolioFilter.assets.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-primary">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Mostrando apenas alertas da sua carteira ({portfolioFilter.assets.length} ativos)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Sugestões de Posição</CardTitle>
              <CardDescription>
                {portfolioFilter?.alertsEnabled && portfolioFilter.assets.length > 0 
                  ? 'Recomendações filtradas pelos ativos da sua carteira'
                  : 'Recomendações baseadas nas análises técnicas mais recentes'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((insight) => (
                  <div
                    key={insight._id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center space-x-4">
                      {renderAssetLogo(insight.asset)}
                      {getRecommendationIcon(insight.recommendation)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{insight.asset.symbol}</span>
                          <Badge className={getRecommendationColor(insight.recommendation)}>
                            {getRecommendationText(insight.recommendation)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.asset.name} • {insight.technique.title}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Preço: </span>
                        <span className="font-medium">{formatCurrency(insight.price)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Confiança: </span>
                        <span className="font-medium">{insight.confidence}%</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => hideInsight(insight._id)}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {suggestions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma sugestão disponível no momento
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights Recentes</CardTitle>
              <CardDescription>
                Últimas análises realizadas pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentInsights.map((insight) => (
                  <div
                    key={insight._id}
                    className="p-4 rounded-lg border bg-card space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {renderAssetLogo(insight.asset)}
                        <span className="font-semibold">{insight.asset.symbol}</span>
                        <Badge className={getRecommendationColor(insight.recommendation)}>
                          {getRecommendationText(insight.recommendation)}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(insight.executedAt)}
                      </span>
                    </div>
                    
                    <p className="text-sm">{insight.analysis}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Técnica: {insight.technique.title}</span>
                      <span>Confiança: {insight.confidence}%</span>
                      <span>Preço: {formatCurrency(insight.price)}</span>
                    </div>
                  </div>
                ))}
                
                {!stats?.recentInsights.length && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum insight recente encontrado
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