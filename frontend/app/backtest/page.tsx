'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select'
import { 
  ArrowLeft,
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  DollarSign,
  Clock,
  Settings
} from 'lucide-react'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'
import { AssetLogo } from '../../components/ui/asset-logo'
import { LightweightChart } from '../../components/charts/lightweight-chart'
import type { Asset, AnalysisTechnique, APIResponse } from '../../types'

interface Signal {
  id: string
  date: string
  type: 'buy' | 'sell'
  price: number
  reason: string
  timestamp: number
}

interface ChartDataPoint {
  date: string
  price: number
  timestamp: number
  signal?: Signal
}

type PeriodPreset = '30d' | '60d' | '6m' | '12m' | 'custom'

export default function BacktestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const techniqueId = searchParams?.get('technique')

  const [assets, setAssets] = useState<Asset[]>([])
  const [techniques, setTechniques] = useState<AnalysisTechnique[]>([])
  const [selectedAsset, setSelectedAsset] = useState<string>('')
  const [selectedTechnique, setSelectedTechnique] = useState<string>(techniqueId || '')
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('6m')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [signals, setSignals] = useState<Signal[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [visibleData, setVisibleData] = useState<ChartDataPoint[]>([])
  const [speed, setSpeed] = useState<number>(500)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [assetsRes, techniquesRes] = await Promise.all([
        api.get<APIResponse<Asset[]>>('/api/assets?isActive=true'),
        api.get<APIResponse<AnalysisTechnique[]>>('/api/analysis-techniques?isActive=true')
      ])
      
      const fetchedAssets = assetsRes.data.data
      const fetchedTechniques = techniquesRes.data.data
      
      setAssets(fetchedAssets)
      setTechniques(fetchedTechniques)
      
      // Auto-select first asset if none selected and assets available
      if (!selectedAsset && fetchedAssets.length > 0) {
        setSelectedAsset(fetchedAssets[0]._id)
      }
      
      // Auto-select technique if passed in URL or select first if none
      if (!selectedTechnique && fetchedTechniques.length > 0) {
        const techniqueToSelect = techniqueId || fetchedTechniques[0]._id
        setSelectedTechnique(techniqueToSelect)
      }
      
      // Set default dates
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      
      setCustomEndDate(end.toISOString().split('T')[0])
      setCustomStartDate(start.toISOString().split('T')[0])
    } catch (error) {
      console.error('Error fetching initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPeriodDates = (): { startDate: string, endDate: string } => {
    const end = new Date()
    const start = new Date()
    
    switch (periodPreset) {
      case '30d':
        start.setDate(start.getDate() - 30)
        break
      case '60d':
        start.setDate(start.getDate() - 60)
        break
      case '6m':
        start.setMonth(start.getMonth() - 6)
        break
      case '12m':
        start.setFullYear(start.getFullYear() - 1)
        break
      case 'custom':
        return {
          startDate: customStartDate,
          endDate: customEndDate
        }
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }
  }

  // Generate mock data for demonstration
  const generateMockData = (): ChartDataPoint[] => {
    const { startDate, endDate } = getPeriodDates()
    const data: ChartDataPoint[] = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    let basePrice = 100 + Math.random() * 50
    
    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(currentDate.getDate() + i)
      
      // Simulate price movement
      const change = (Math.random() - 0.5) * 4 // -2% to +2% daily change
      basePrice = Math.max(basePrice * (1 + change / 100), 10) // Minimum price of 10
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        price: Number(basePrice.toFixed(2)),
        timestamp: currentDate.getTime()
      })
    }
    
    return data
  }

  // Generate mock signals based on technique
  const generateSignals = (data: ChartDataPoint[]): Signal[] => {
    const technique = techniques.find(t => t._id === selectedTechnique)
    if (!technique) return []
    
    const signals: Signal[] = []
    
    // Simple mock strategy based on technique periodicity
    const signalFrequency = technique.periodicity === 'daily' ? 7 : 
                           technique.periodicity === 'weekly' ? 30 : 
                           technique.periodicity === 'monthly' ? 90 : 3
    
    for (let i = signalFrequency; i < data.length; i += signalFrequency + Math.floor(Math.random() * 10)) {
      const point = data[i]
      const prevPoint = data[i - Math.floor(signalFrequency / 2)]
      
      if (point.price > prevPoint.price * 1.05) {
        signals.push({
          id: `signal-${i}`,
          date: point.date,
          type: 'buy',
          price: point.price,
          reason: `${technique.title} - Sinal de compra detectado`,
          timestamp: point.timestamp
        })
      } else if (point.price < prevPoint.price * 0.95) {
        signals.push({
          id: `signal-${i}`,
          date: point.date,
          type: 'sell',
          price: point.price,
          reason: `${technique.title} - Sinal de venda detectado`,
          timestamp: point.timestamp
        })
      }
    }
    
    return signals
  }

  const handleStartBacktest = () => {
    if (!selectedAsset || !selectedTechnique) return
    
    const mockData = generateMockData()
    const mockSignals = generateSignals(mockData)
    
    setChartData(mockData)
    setSignals(mockSignals)
    setCurrentIndex(0)
    setVisibleData([mockData[0]])
    setIsRunning(true)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCurrentIndex(0)
    setSignals([])
    setChartData([])
    setVisibleData([])
  }

  const handlePlayPause = () => {
    setIsRunning(!isRunning)
  }

  // Animation effect
  useEffect(() => {
    if (!isRunning || currentIndex >= chartData.length - 1) {
      setIsRunning(false)
      return
    }

    const timer = setTimeout(() => {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setVisibleData(chartData.slice(0, nextIndex + 1))
    }, speed)

    return () => clearTimeout(timer)
  }, [isRunning, currentIndex, chartData, speed])

  const currentSignals = signals.filter(signal => 
    signal.timestamp <= (chartData[currentIndex]?.timestamp || 0)
  )

  const selectedAssetData = assets.find(a => a._id === selectedAsset)
  const selectedTechniqueData = techniques.find(t => t._id === selectedTechnique)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
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
              Backtest de Técnicas
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Teste suas técnicas de análise com dados históricos
            </p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuração do Backtest
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Ativo</Label>
            <Select 
              value={selectedAsset} 
              onValueChange={(value) => {
                console.log('Asset changed to:', value)
                setSelectedAsset(value)
              }}
              disabled={false}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ativo" />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset._id} value={asset._id}>
                    <div className="flex items-center gap-2">
                      <AssetLogo symbol={asset.symbol} type={asset.type} size="sm" />
                      <span>{asset.symbol} - {asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Técnica</Label>
            <Select 
              value={selectedTechnique} 
              onValueChange={(value) => {
                console.log('Technique changed to:', value)
                setSelectedTechnique(value)
              }}
              disabled={false}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a técnica" />
              </SelectTrigger>
              <SelectContent>
                {techniques.map(technique => (
                  <SelectItem key={technique._id} value={technique._id}>
                    {technique.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <Select 
              value={periodPreset} 
              onValueChange={(value: PeriodPreset) => {
                console.log('Period changed to:', value)
                setPeriodPreset(value)
              }}
              disabled={false}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="60d">Últimos 60 dias</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="12m">Últimos 12 meses</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Velocidade</Label>
            <Select 
              value={speed.toString()} 
              onValueChange={(value) => {
                console.log('Speed changed to:', value)
                setSpeed(Number(value))
              }}
              disabled={false}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">Muito Rápida</SelectItem>
                <SelectItem value="250">Rápida</SelectItem>
                <SelectItem value="500">Normal</SelectItem>
                <SelectItem value="1000">Lenta</SelectItem>
                <SelectItem value="2000">Muito Lenta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom date inputs */}
          {periodPreset === 'custom' && (
            <>
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleStartBacktest}
            disabled={!selectedAsset || !selectedTechnique || isRunning}
            size="lg"
            className="btn-finance"
            title={
              !selectedAsset ? 'Selecione um ativo para iniciar' :
              !selectedTechnique ? 'Selecione uma técnica para iniciar' :
              'Ready to start backtest'
            }
          >
            <Play className="h-4 w-4 mr-2" />
            {!selectedAsset || !selectedTechnique ? 'Selecione Ativo e Técnica' : 'Iniciar Backtest'}
          </Button>
          
          {chartData.length > 0 && (
            <>
              <Button onClick={handlePlayPause} variant="outline">
                {isRunning ? (
                  <><Pause className="h-4 w-4 mr-2" /> Pausar</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Continuar</>
                )}
              </Button>
              
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            </>
          )}
        </div>

        {selectedAssetData && selectedTechniqueData && chartData.length > 0 && (
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <AssetLogo symbol={selectedAssetData.symbol} type={selectedAssetData.type} size="sm" />
              <span className="font-medium">{selectedAssetData.symbol}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(visibleData[currentIndex]?.date || getPeriodDates().startDate)}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              R$ {visibleData[currentIndex]?.price.toFixed(2) || '0.00'}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {currentIndex + 1}/{chartData.length}
            </div>
            <Badge variant="outline">
              Sinais: {currentSignals.length}
            </Badge>
          </div>
        )}
      </div>

      {/* Chart */}
      {visibleData.length > 0 && (
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Análise: {selectedTechniqueData?.title}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {selectedTechniqueData?.periodicity}
                </Badge>
                <Badge variant={currentSignals.length > 0 ? 'default' : 'secondary'} className="bg-primary/20 text-primary border-primary/30">
                  {currentSignals.length} sinais detectados
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <LightweightChart 
                data={visibleData}
                signals={currentSignals}
                width={1000}
                height={400}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signals Table */}
      {currentSignals.length > 0 && (
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sinais Detectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {currentSignals.map(signal => (
                <div 
                  key={signal.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {signal.type === 'buy' ? (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        <Badge variant={signal.type === 'buy' ? 'default' : 'destructive'}>
                          {signal.type === 'buy' ? 'COMPRA' : 'VENDA'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {signal.reason}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-lg">
                      R$ {signal.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(signal.date)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {chartData.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pronto para começar</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Selecione um ativo e uma técnica, configure o período desejado e clique em "Iniciar Backtest" para começar a análise.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}