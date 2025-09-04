'use client'

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Progress } from '../../../components/ui/progress'
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Database,
  Clock,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { useToast } from '../../../lib/toast'
import { useRouter } from 'next/navigation'

// Lista de símbolos populares B3 para fallback
const popularB3Symbols = [
  'ABEV3', 'AZUL4', 'B3SA3', 'BBAS3', 'BBDC3', 'BBDC4', 'BBSE3',
  'BEEF3', 'BPAC11', 'BRAP4', 'BRDT3', 'BRFS3', 'BRKM5', 'BRML3',
  'BTOW3', 'CCRO3', 'CIEL3', 'CMIG4', 'COGN3', 'CPFE3', 'CRFB3',
  'CSAN3', 'CSNA3', 'CVCB3', 'CYRE3', 'ECOR3', 'EGIE3', 'ELET3',
  'ELET6', 'EMBR3', 'ENBR3', 'EQTL3', 'EZTC3', 'FLRY3', 'GGBR4',
  'GOAU4', 'GOLL4', 'HAPV3', 'HYPE3', 'IGTA3', 'IRBR3', 'ITSA4',
  'ITUB4', 'JBSS3', 'KLBN11', 'LAME4', 'LREN3', 'LWSA3', 'MGLU3',
  'MRFG3', 'MRVE3', 'MULT3', 'NTCO3', 'OIBR3', 'OIBR4', 'PCAR3',
  'PETR3', 'PETR4', 'PETZ3', 'POSI3', 'QUAL3', 'RADL3', 'RAIL3',
  'RDOR3', 'RENT3', 'RRRP3', 'SANB11', 'SBSP3', 'SLCE3', 'SMTO3',
  'SUZB3', 'TAEE11', 'TIMS3', 'TOTS3', 'UGPA3', 'USIM5', 'VALE3',
  'VIVT3', 'VVAR3', 'WEGE3', 'YDUQ3'
]

interface AssetSyncStatus {
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error' | 'stopping'
  progress: number
  totalAssets: number
  processedAssets: number
  successCount: number
  errorCount: number
  currentAsset?: string
  startTime?: Date
  endTime?: Date
  errors: Array<{
    symbol: string
    error: string
    details?: string
    stackTrace?: string
    httpStatus?: number
    timestamp: Date
    request?: {
      url: string
      method: string
      headers?: Record<string, string>
    }
  }>
  symbolStatus: Record<string, 'pending' | 'processing' | 'success' | 'error'>
}

interface HGAsset {
  symbol: string
  name: string
  company_name: string
  document: string
  description: string
  website: string
  region: string
  currency: string
  market_time: {
    open: string
    close: string
    timezone: number
  }
  market_cap: number
  price: number
  change_percent: number
  updated_at: string
  logo: string
  sector: string
  type: string
}

export function AssetSyncPage() {
  const router = useRouter()
  const { error, success } = useToast()
  
  const [syncStatus, setSyncStatus] = useState<AssetSyncStatus>({
    status: 'idle',
    progress: 0,
    totalAssets: 0,
    processedAssets: 0,
    successCount: 0,
    errorCount: 0,
    errors: [],
    symbolStatus: {}
  })

  // Estados para controle de abas e expansão de erros
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set())

  // Estados para armazenar informações dos ativos
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([])
  const [symbolsByType, setSymbolsByType] = useState<Record<string, string[]>>({})
  const [loadingSymbols, setLoadingSymbols] = useState(true)
  const [shouldStop, setShouldStop] = useState(false)


  // Não carregar símbolos na inicialização - somente ao iniciar sincronização
  React.useEffect(() => {
    setLoadingSymbols(false)
    setAvailableSymbols([])
    setSymbolsByType({})
  }, [])


  const startSync = useCallback(async () => {
    try {
      // Reset do flag de parada
      setShouldStop(false)
      
      // Primeira etapa: Carregar lista de ativos disponíveis
      success("Iniciando Sincronização", "Carregando lista de ativos disponíveis da HG Brasil...")
      
      console.log('🔄 Loading available assets from HG Brasil ticker_list API...')
      const response = await fetch('/api/hg-brasil/ticker-list')
      console.log('📡 HG Brasil API Response:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('📊 HG Brasil API Data:', result)
      
      if (!result || !result.results) {
        throw new Error("Formato de resposta inválido da API HG Brasil")
      }

      // A API HG Brasil retorna results como array de strings (símbolos)
      const symbols = Array.isArray(result.results) ? result.results.filter(Boolean) : []
      
      console.log('✅ Found HG Brasil symbols:', symbols.length)
      
      // Para o ticker_list, todos são considerados 'stock' por padrão
      const byType = {
        stock: symbols
      }
      
      setAvailableSymbols(symbols)
      setSymbolsByType(byType)

      // Inicializar status de todos os símbolos como 'pending'
      const initialSymbolStatus: Record<string, 'pending' | 'processing' | 'success' | 'error'> = {}
      symbols.forEach(symbol => {
        initialSymbolStatus[symbol] = 'pending'
      })
      
      setSyncStatus({
        status: 'running',
        progress: 0,
        totalAssets: symbols.length,
        processedAssets: 0,
        successCount: 0,
        errorCount: 0,
        startTime: new Date(),
        errors: [],
        symbolStatus: initialSymbolStatus
      })

      success("Lista Carregada", `${symbols.length} ativos encontrados. Iniciando sincronização individual...`)

      // Segunda etapa: Processar ativos individuais da HG Brasil API
      let processedCount = 0
      const errors: Array<{
        symbol: string
        error: string
        details?: string
        stackTrace?: string
        httpStatus?: number
        timestamp: Date
        request?: {
          url: string
          method: string
          headers?: Record<string, string>
        }
      }> = []

      // Processar ativos em lotes para evitar sobrecarregar a API
      const batchSize = 5
      const batches = []
      for (let i = 0; i < symbols.length; i += batchSize) {
        batches.push(symbols.slice(i, i + batchSize))
      }

      for (const batch of batches) {
        // Verificar se deve parar antes de processar cada lote
        if (shouldStop) {
          setSyncStatus(prev => ({
            ...prev,
            status: 'completed',
            currentAsset: undefined,
            endTime: new Date(),
            errors: errors // Garantir que erros sejam salvos ao parar
          }))
          success("Sincronização Interrompida", `Processamento interrompido pelo usuário. Processados ${processedCount} de ${symbols.length} ativos.`)
          return
        }

        const batchPromises = batch.map(async (symbol) => {
          // Definir URLs no início da função para estarem disponíveis no catch
          const assetUrl = `/api/hg-brasil/stock-price?symbol=${symbol}`
          const saveUrl = '/api/asset-sync/save-asset'
          
          try {
            // Verificar se deve parar antes de cada ativo
            if (shouldStop) {
              return { symbol, success: false, error: 'Processamento interrompido' }
            }

            // Atualizar status para 'processing'
            setSyncStatus(prev => ({
              ...prev,
              currentAsset: symbol,
              symbolStatus: {
                ...prev.symbolStatus,
                [symbol]: 'processing'
              }
            }))

            // Buscar dados individuais do ativo da HG Brasil através do proxy
            const assetResponse = await fetch(assetUrl)
            
            if (!assetResponse.ok) {
              let errorMessage = `HTTP ${assetResponse.status} - ${assetResponse.statusText}`
              try {
                const errorData = await assetResponse.json()
                if (errorData.error) {
                  errorMessage = errorData.error
                  if (errorData.details) {
                    errorMessage += ` - ${errorData.details}`
                  }
                }
              } catch (e) {
                // Se não conseguir fazer parse do JSON, usar mensagem padrão
              }
              const error = new Error(errorMessage)
              ;(error as any).status = assetResponse.status
              throw error
            }

            const assetData = await assetResponse.json()
            
            if (!assetData.results || !assetData.results[symbol]) {
              throw new Error(`Dados não encontrados para ${symbol}`)
            }

            // Enviar dados para o backend para salvar
            const saveResponse = await fetch(saveUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                symbol: symbol,
                data: assetData.results[symbol]
              })
            })

            if (!saveResponse.ok) {
              let errorMessage = `Erro ao salvar ${symbol}: HTTP ${saveResponse.status}`
              try {
                const errorData = await saveResponse.json()
                if (errorData.error) {
                  errorMessage = `Erro ao salvar ${symbol}: ${errorData.error}`
                  if (errorData.details) {
                    errorMessage += ` - ${errorData.details}`
                  }
                }
              } catch (e) {
                // Se não conseguir fazer parse do JSON, usar mensagem padrão
              }
              const error = new Error(errorMessage)
              ;(error as any).status = saveResponse.status
              throw error
            }

            return { symbol, success: true }
          } catch (err: any) {
            // Capturar informações de qual requisição causou o erro
            let requestInfo = { url: assetUrl, method: 'GET' }
            
            // Se o erro foi no salvamento, atualizar as informações da requisição
            if (err.message.includes('Erro ao salvar')) {
              requestInfo = { url: saveUrl, method: 'POST' }
            }
            
            return { 
              symbol, 
              success: false, 
              error: err.message,
              httpStatus: err.status || 500,
              request: requestInfo
            }
          }
        })

        // Processar lote atual
        const batchResults = await Promise.all(batchPromises)
        
        // Atualizar status baseado nos resultados
        batchResults.forEach(result => {
          processedCount++
          
          setSyncStatus(prev => ({
            ...prev,
            processedAssets: processedCount,
            progress: (processedCount / symbols.length) * 100,
            successCount: result.success ? prev.successCount + 1 : prev.successCount,
            errorCount: result.success ? prev.errorCount : prev.errorCount + 1,
            symbolStatus: {
              ...prev.symbolStatus,
              [result.symbol]: result.success ? 'success' : 'error'
            }
          }))

          if (!result.success) {
            const newError = {
              symbol: result.symbol,
              error: `Falha na sincronização de ${result.symbol}`,
              details: result.error,
              httpStatus: result.httpStatus,
              timestamp: new Date(),
              request: result.request
            }
            errors.push(newError)
            
            // Atualizar erros em tempo real
            setSyncStatus(prev => ({
              ...prev,  
              errors: [...prev.errors, newError]
            }))
          }
        })

        // Adicionar delay entre lotes para respeitar rate limits
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // 1 segundo entre lotes
        }
      }

      // Finalizar sincronização
      setSyncStatus(prev => ({
        ...prev,
        status: 'completed',
        progress: 100,
        endTime: new Date(),
        currentAsset: undefined,
        errors: errors
      }))

      success("Sincronização Concluída", `Processados ${symbols.length} ativos: ${processedCount - errors.length} sucessos, ${errors.length} erros.`)

    } catch (err: any) {
      console.log('🚨 Error during overall process:', err)
      
      setSyncStatus(prev => ({
        ...prev,
        status: 'error',
        endTime: new Date(),
        currentAsset: undefined
      }))

      // Determinar o tipo de erro e mostrar mensagem apropriada
      if (err.message.includes('ticker_list') || err.message.includes('HTTP')) {
        error("Erro ao carregar ativos", `Não foi possível conectar com a API da HG Brasil: ${err.message}`)
      } else {
        error("Erro na Sincronização", err.message || 'Falha geral na sincronização.')
      }
    }
  }, [success, error])


  const resetSync = () => {
    setSyncStatus({
      status: 'idle',
      progress: 0,
      totalAssets: 0,
      processedAssets: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      symbolStatus: {}
    })
    
    // Limpar também os símbolos carregados
    setAvailableSymbols([])
    setSymbolsByType({})
  }

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start) return ''
    const endTime = end || new Date()
    const duration = Math.round((endTime.getTime() - start.getTime()) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = () => {
    switch (syncStatus.status) {
      case 'completed':
        return 'text-success'
      case 'error':
        return 'text-destructive'
      case 'running':
        return 'text-warning'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusIcon = () => {
    switch (syncStatus.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />
      case 'running':
        return <Clock className="h-5 w-5 text-warning animate-spin" />
      default:
        return <Database className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getSymbolBadgeVariant = (symbol: string) => {
    const status = syncStatus.symbolStatus[symbol]
    switch (status) {
      case 'processing':
        return 'secondary' // Amarelo
      case 'success':
        return 'default' // Verde
      case 'error':
        return 'destructive' // Vermelho  
      default:
        return 'outline' // Padrão
    }
  }

  const getSymbolBadgeClass = (symbol: string) => {
    const status = syncStatus.symbolStatus[symbol]
    const isCurrentAsset = syncStatus.currentAsset === symbol
    
    let baseClass = "justify-center transition-all duration-300"
    
    if (isCurrentAsset && syncStatus.status === 'running') {
      baseClass += " animate-pulse ring-2 ring-primary/50 scale-110"
    }
    
    switch (status) {
      case 'processing':
        return baseClass + " bg-yellow-100 text-yellow-800 border-yellow-300"
      case 'success':
        return baseClass + " bg-green-100 text-green-800 border-green-300"
      case 'error':
        return baseClass + " bg-red-100 text-red-800 border-red-300"
      default:
        return baseClass + " bg-gray-100 text-gray-600 border-gray-300"
    }
  }

  const toggleErrorExpansion = (index: number) => {
    console.log('Toggling error expansion for index:', index)
    const newExpanded = new Set(expandedErrors)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedErrors(newExpanded)
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
              Sincronização de Ativos
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Importe dados atualizados dos principais ativos da B3
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Sincronização de Ativos B3
          </CardTitle>
          <CardDescription>
            Sincronize dados atualizados dos principais ativos da B3 com imagens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>
              {availableSymbols.length > 0 
                ? `Ativos carregados: ${availableSymbols.length} símbolos da HG Brasil API`
                : 'Clique em "Iniciar Sincronização" para carregar os ativos da HG Brasil API'
              }
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="h-4 w-4" />
            <span>Sincronização completa com download de imagens disponível</span>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {syncStatus.status !== 'idle' && (
            <>
              {getStatusIcon()}
              <span className={getStatusColor()}>
                {syncStatus.status === 'running' && (syncStatus.currentAsset ? `Processando ${syncStatus.currentAsset}...` : 'Processando ativos...')}
                {syncStatus.status === 'completed' && 'Sincronização concluída'}
                {syncStatus.status === 'error' && 'Erro na sincronização'}
              </span>
              {syncStatus.startTime && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(syncStatus.startTime, syncStatus.endTime)}
                </Badge>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {syncStatus.status !== 'idle' && syncStatus.status !== 'running' && (
            <Button onClick={resetSync} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </Button>
          )}
          
          {syncStatus.status === 'running' && (
            <Button 
              onClick={() => setShouldStop(true)}
              variant="destructive"
              disabled={shouldStop}
            >
              <Pause className="h-4 w-4 mr-2" />
              {shouldStop ? 'Parando...' : 'Parar Processamento'}
            </Button>
          )}
          
          <Button 
            onClick={startSync}
            disabled={syncStatus.status === 'running'}
            size="lg"
          >
            <Play className="h-4 w-4 mr-2" />
            {syncStatus.status === 'running' ? 'Sincronizando...' : 'Iniciar Sincronização'}
          </Button>
        </div>
      </div>

      {/* Results with Tabs */}
      {syncStatus.status !== 'idle' && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Progresso
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Ativos ({availableSymbols.length})
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2" disabled={syncStatus.errors.length === 0 && syncStatus.status === 'idle'}>
              <AlertCircle className="h-4 w-4" />
              Erros ({syncStatus.errors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="metric-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Progresso da Sincronização</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {syncStatus.processedAssets}/{syncStatus.totalAssets} ativos
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={syncStatus.progress} className="w-full" />
                
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Sucessos</p>
                          <p className="text-2xl font-bold text-success">{syncStatus.successCount}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-success" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Erros</p>
                          <p className="text-2xl font-bold text-destructive">{syncStatus.errorCount}</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-destructive" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Processados</p>
                          <p className="text-2xl font-bold">{syncStatus.processedAssets}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card className="metric-card">
              <CardHeader>
                <CardTitle>Status dos Ativos</CardTitle>
                <CardDescription>
                  Lista dos {availableSymbols.length} ativos disponíveis na HG Brasil API com status de sincronização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-6 lg:grid-cols-8">
                  {availableSymbols.map((symbol, index) => (
                    <Badge 
                      key={`${symbol}-${index}`} 
                      variant={getSymbolBadgeVariant(symbol)} 
                      className={getSymbolBadgeClass(symbol)}
                      title={`Ativo: ${symbol}`}
                    >
                      {symbol}
                      {syncStatus.currentAsset === symbol && syncStatus.status === 'running' && (
                        <span className="ml-1 animate-spin">⟳</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            {syncStatus.errors.length > 0 && (
              <Card className="metric-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Erros Detalhados ({syncStatus.errors.length})
                  </CardTitle>
                  <CardDescription>
                    Clique nos erros para ver detalhes técnicos e stack traces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {syncStatus.errors.map((error, index) => (
                      <Card key={index} className="border-destructive/20">
                        <CardHeader 
                          className="pb-3 cursor-pointer hover:bg-destructive/5 transition-colors relative z-10"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleErrorExpansion(index)
                          }}
                          style={{ pointerEvents: 'auto' }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant="destructive" className="font-mono">
                                {error.symbol}
                              </Badge>
                              <div>
                                <p className="font-medium text-destructive">{error.error}</p>
                                <p className="text-sm text-muted-foreground">
                                  {error.timestamp.toLocaleString()} 
                                  {error.httpStatus && (
                                    <span className="ml-2 font-mono bg-muted px-1 rounded text-xs">
                                      HTTP {error.httpStatus}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8">
                                {expandedErrors.has(index) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        {expandedErrors.has(index) && (
                          <CardContent className="pt-0 space-y-3 relative z-10">
                            {error.request && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <ExternalLink className="h-4 w-4" />
                                  Informações da Requisição
                                </h4>
                                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Método:</span>
                                    <Badge variant="outline" className="font-mono text-xs">
                                      {error.request.method}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">URL:</span>
                                    <code className="text-xs bg-background px-1 rounded border">
                                      {error.request.url}
                                    </code>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => navigator.clipboard.writeText(error.request?.url || '')}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {error.details && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Detalhes do Erro
                                </h4>
                                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                  {error.details}
                                </p>
                              </div>
                            )}
                            {error.stackTrace && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                  <Database className="h-4 w-4" />
                                  Stack Trace
                                </h4>
                                <pre className="text-xs text-muted-foreground bg-muted p-3 rounded-md overflow-x-auto font-mono">
                                  {error.stackTrace}
                                </pre>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

    </div>
  )
}