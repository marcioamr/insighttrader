'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../../hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Textarea } from '../../../components/ui/textarea'
import { Switch } from '../../../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Badge } from '../../../components/ui/badge'
import { 
  ArrowLeft, 
  Save, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react'
import api from '../../../lib/api'
import type { AnalysisTechnique, APIResponse } from '../../../types'

interface TechniqueFormData {
  title: string
  description: string
  category: 'momentum' | 'trend' | 'volatility' | 'volume' | 'support_resistance' | 'patterns'
  periodicity: 'hourly' | 'daily' | 'weekly' | 'monthly'
  timeframe: string
  parameters: {
    period?: number
    signal_threshold?: number
    stop_loss?: number
    take_profit?: number
    lookback_period?: number
    sensitivity?: 'low' | 'medium' | 'high'
  }
  signal_conditions: {
    buy_condition?: string
    sell_condition?: string
    neutral_condition?: string
  }
  risk_level: 'low' | 'medium' | 'high'
  isActive: boolean
}

export default function CreateTechniquePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAdmin, isAuthenticated, isLoading } = useAuth()
  const techniqueId = searchParams?.get('id')
  const isEditing = !!techniqueId

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<TechniqueFormData>({
    title: '',
    description: '',
    category: 'momentum',
    periodicity: 'daily',
    timeframe: '1D',
    parameters: {
      period: 14,
      signal_threshold: 0.7,
      stop_loss: 5,
      take_profit: 10,
      lookback_period: 20,
      sensitivity: 'medium'
    },
    signal_conditions: {
      buy_condition: '',
      sell_condition: '',
      neutral_condition: ''
    },
    risk_level: 'medium',
    isActive: true
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }
    if (!isLoading && !isAdmin) {
      router.push('/techniques')
      return
    }
    if (isEditing && techniqueId) {
      fetchTechnique()
    }
  }, [isAuthenticated, isLoading, isAdmin, router, isEditing, techniqueId])

  const fetchTechnique = async () => {
    try {
      setLoading(true)
      const response = await api.get<APIResponse<AnalysisTechnique>>(`/api/analysis-techniques/${techniqueId}`)
      const technique = response.data.data
      
      setFormData({
        title: technique.title,
        description: technique.description,
        category: technique.category || 'momentum',
        periodicity: technique.periodicity,
        timeframe: technique.timeframe || '1D',
        parameters: technique.parameters || formData.parameters,
        signal_conditions: technique.signal_conditions || {
          buy_condition: formData.signal_conditions.buy_condition,
          sell_condition: formData.signal_conditions.sell_condition,
          neutral_condition: formData.signal_conditions.neutral_condition
        },
        risk_level: technique.risk_level || 'medium',
        isActive: technique.isActive
      })
    } catch (error) {
      console.error('Error fetching technique:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    } else if (formData.title.length > 200) {
      newErrors.title = 'Título deve ter no máximo 200 caracteres'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Descrição deve ter no máximo 1000 caracteres'
    }

    if (!formData.signal_conditions.buy_condition?.trim()) {
      newErrors.buy_condition = 'Condição de compra é obrigatória'
    }

    if (!formData.signal_conditions.sell_condition?.trim()) {
      newErrors.sell_condition = 'Condição de venda é obrigatória'
    }

    if (formData.parameters.period && (formData.parameters.period < 1 || formData.parameters.period > 200)) {
      newErrors.period = 'Período deve estar entre 1 e 200'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const payload = {
        ...formData,
        updatedAt: new Date().toISOString()
      }

      if (isEditing) {
        await api.put(`/api/analysis-techniques/${techniqueId}`, payload)
      } else {
        await api.post('/api/analysis-techniques', payload)
      }
      
      router.push('/techniques')
    } catch (error) {
      console.error('Error saving technique:', error)
      setErrors({ submit: 'Erro ao salvar técnica. Tente novamente.' })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      momentum: 'Momentum',
      trend: 'Tendência',
      volatility: 'Volatilidade',
      volume: 'Volume',
      support_resistance: 'Suporte/Resistência',
      patterns: 'Padrões Gráficos'
    }
    return labels[category as keyof typeof labels] || category
  }

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'text-success bg-success/10 border-success/30',
      medium: 'text-warning bg-warning/10 border-warning/30',
      high: 'text-destructive bg-destructive/10 border-destructive/30'
    }
    return colors[risk as keyof typeof colors] || colors.medium
  }

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/techniques')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {isEditing ? 'Editar Técnica' : 'Nova Técnica de Análise'}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {isEditing 
                ? 'Atualize as configurações da técnica de análise técnica'
                : 'Configure uma nova técnica de análise técnica para alertas de mercado'
              }
            </p>
          </div>
        </div>
      </div>

      {errors.submit && (
        <Alert className="border-destructive bg-destructive/10 border-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />  
          <AlertDescription className="font-medium text-destructive">{errors.submit}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-primary" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Configure as informações principais da técnica de análise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Técnica *</Label>
                <Input
                  id="title"
                  placeholder="Ex: RSI Divergência, MACD Crossover..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="momentum">📈 Momentum</SelectItem>
                    <SelectItem value="trend">📊 Tendência</SelectItem>
                    <SelectItem value="volatility">⚡ Volatilidade</SelectItem>
                    <SelectItem value="volume">📦 Volume</SelectItem>
                    <SelectItem value="support_resistance">🎯 Suporte/Resistência</SelectItem>
                    <SelectItem value="patterns">🔍 Padrões Gráficos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Técnica *</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente como esta técnica funciona, quando gera sinais e o que analisa..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="periodicity">Periodicidade</Label>
                <Select
                  value={formData.periodicity}
                  onValueChange={(value: any) => setFormData({ ...formData, periodicity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">⏰ A cada hora</SelectItem>
                    <SelectItem value="daily">📅 Diário</SelectItem>
                    <SelectItem value="weekly">📆 Semanal</SelectItem>
                    <SelectItem value="monthly">🗓️ Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={formData.timeframe}
                  onValueChange={(value) => setFormData({ ...formData, timeframe: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Minuto</SelectItem>
                    <SelectItem value="5m">5 Minutos</SelectItem>
                    <SelectItem value="15m">15 Minutos</SelectItem>
                    <SelectItem value="1H">1 Hora</SelectItem>
                    <SelectItem value="4H">4 Horas</SelectItem>
                    <SelectItem value="1D">1 Dia</SelectItem>
                    <SelectItem value="1W">1 Semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Parâmetros da Técnica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Parâmetros da Análise
            </CardTitle>
            <CardDescription>
              Configure os parâmetros específicos para cálculo da técnica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Input
                  id="period"
                  type="number"
                  placeholder="14"
                  value={formData.parameters.period || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parameters: { ...formData.parameters, period: parseInt(e.target.value) || undefined }
                  })}
                  className={errors.period ? 'border-red-500' : ''}
                />
                {errors.period && (
                  <p className="text-sm text-red-500">{errors.period}</p>
                )}
                <p className="text-xs text-muted-foreground">Períodos para cálculo (ex: RSI 14)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signal_threshold">Limiar do Sinal</Label>
                <Input
                  id="signal_threshold"
                  type="number"
                  step="0.1"
                  placeholder="0.7"
                  value={formData.parameters.signal_threshold || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parameters: { ...formData.parameters, signal_threshold: parseFloat(e.target.value) || undefined }
                  })}
                />
                <p className="text-xs text-muted-foreground">Força mínima do sinal (0-1)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lookback_period">Período de Análise</Label>
                <Input
                  id="lookback_period"
                  type="number"
                  placeholder="20"
                  value={formData.parameters.lookback_period || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parameters: { ...formData.parameters, lookback_period: parseInt(e.target.value) || undefined }
                  })}
                />
                <p className="text-xs text-muted-foreground">Barras para análise histórica</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="stop_loss">Stop Loss (%)</Label>
                <Input
                  id="stop_loss"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={formData.parameters.stop_loss || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parameters: { ...formData.parameters, stop_loss: parseFloat(e.target.value) || undefined }
                  })}
                />
                <p className="text-xs text-muted-foreground">Perda máxima recomendada</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="take_profit">Take Profit (%)</Label>
                <Input
                  id="take_profit"
                  type="number"
                  step="0.1"
                  placeholder="10.0"
                  value={formData.parameters.take_profit || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    parameters: { ...formData.parameters, take_profit: parseFloat(e.target.value) || undefined }
                  })}
                />
                <p className="text-xs text-muted-foreground">Lucro alvo recomendado</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sensitivity">Sensibilidade</Label>
                <Select
                  value={formData.parameters.sensitivity || 'medium'}
                  onValueChange={(value: any) => setFormData({ 
                    ...formData, 
                    parameters: { ...formData.parameters, sensitivity: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🐌 Baixa (menos sinais)</SelectItem>
                    <SelectItem value="medium">⚖️ Média (balanceado)</SelectItem>
                    <SelectItem value="high">🚀 Alta (mais sinais)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condições de Sinal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Condições de Sinal
            </CardTitle>
            <CardDescription>
              Defina as condições específicas que geram alertas de compra e venda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="buy_condition">Condição de Compra *</Label>
              <Textarea
                id="buy_condition"
                placeholder="Ex: RSI < 30 AND Preço > Média Móvel 20 AND Volume > Média Volume 10d"
                value={formData.signal_conditions.buy_condition || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  signal_conditions: { ...formData.signal_conditions, buy_condition: e.target.value }
                })}
                className={errors.buy_condition ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.buy_condition && (
                <p className="text-sm text-red-500">{errors.buy_condition}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Descreva as condições técnicas que indicam oportunidade de compra
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell_condition">Condição de Venda *</Label>
              <Textarea
                id="sell_condition"
                placeholder="Ex: RSI > 70 OR Preço < Média Móvel 20 OR Stop Loss atingido"
                value={formData.signal_conditions.sell_condition || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  signal_conditions: { ...formData.signal_conditions, sell_condition: e.target.value }
                })}
                className={errors.sell_condition ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.sell_condition && (
                <p className="text-sm text-red-500">{errors.sell_condition}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Descreva as condições técnicas que indicam saída da posição
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neutral_condition">Condição Neutra (Opcional)</Label>
              <Textarea
                id="neutral_condition"
                placeholder="Ex: RSI entre 30-70 AND sem divergências confirmadas"
                value={formData.signal_conditions.neutral_condition || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  signal_conditions: { ...formData.signal_conditions, neutral_condition: e.target.value }
                })}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Condições que indicam aguardar (não comprar nem vender)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Risco e Mercado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Risco e Aplicabilidade
            </CardTitle>
            <CardDescription>
              Configure o perfil de risco e condições ideais de mercado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="risk_level">Nível de Risco</Label>
                <Select
                  value={formData.risk_level}
                  onValueChange={(value: any) => setFormData({ ...formData, risk_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Baixo Risco</SelectItem>
                    <SelectItem value="medium">🟡 Risco Moderado</SelectItem>
                    <SelectItem value="high">🔴 Alto Risco</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Badge className={getRiskColor(formData.risk_level)}>
                    {formData.risk_level === 'low' && '🟢 Baixo Risco'}
                    {formData.risk_level === 'medium' && '🟡 Risco Moderado'}
                    {formData.risk_level === 'high' && '🔴 Alto Risco'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status da Técnica</Label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? '✅ Técnica Ativa' : '⏸️ Técnica Inativa'}
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/techniques')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="btn-finance"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar Técnica' : 'Criar Técnica')}
          </Button>
        </div>
      </form>
    </div>
  )
}