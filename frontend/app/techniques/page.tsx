'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
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
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  PowerOff, 
  RefreshCw,
  Clock,
  TrendingUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'
import api from '../../lib/api'
import { formatDate } from '../../lib/utils'
import type { AnalysisTechnique, APIResponse } from '../../types'


export default function TechniquesPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [techniques, setTechniques] = useState<AnalysisTechnique[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTechniques()
  }, [])

  const fetchTechniques = async () => {
    try {
      setLoading(true)
      const response = await api.get<APIResponse<AnalysisTechnique[]>>('/api/analysis-techniques')
      setTechniques(response.data.data)
    } catch (error) {
      console.error('Error fetching techniques:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleDelete = async (techniqueId: string) => {
    try {
      await api.delete(`/api/analysis-techniques/${techniqueId}`)
      await fetchTechniques()
    } catch (error) {
      console.error('Error deleting technique:', error)
    }
  }

  const handleToggleActive = async (technique: AnalysisTechnique) => {
    try {
      const endpoint = technique.isActive ? 'deactivate' : 'activate'
      await api.patch(`/api/analysis-techniques/${technique._id}/${endpoint}`)
      await fetchTechniques()
    } catch (error) {
      console.error('Error toggling technique status:', error)
    }
  }

  const handleOpenBacktest = (technique: AnalysisTechnique) => {
    router.push(`/backtest?technique=${technique._id}`)
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

  const getCategoryLabel = (category: string) => {
    const labels = {
      momentum: '📈 Momentum',
      trend: '📊 Tendência',
      volatility: '⚡ Volatilidade',
      volume: '📦 Volume',
      support_resistance: '🎯 S/R',
      patterns: '🔍 Padrões'
    }
    return labels[category as keyof typeof labels] || category
  }

  const getRiskLabel = (risk: string) => {
    const labels = {
      low: '🟢 Baixo',
      medium: '🟡 Médio',
      high: '🔴 Alto'
    }
    return labels[risk as keyof typeof labels] || risk
  }

  const getRiskBadgeColor = (risk: string) => {
    const colors = {
      low: 'bg-success/20 text-success border-success/30',
      medium: 'bg-warning/20 text-warning border-warning/30',
      high: 'bg-destructive/20 text-destructive border-destructive/30'
    }
    return colors[risk as keyof typeof colors] || colors.medium
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
            Técnicas de Análise
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gerencie as técnicas de análise técnica do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchTechniques} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          {isAdmin && (
            <Button onClick={() => router.push('/techniques/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Técnica
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {techniques.map((technique) => (
          <Card key={technique._id} className="metric-card card-hover group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{technique.title}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    {!technique.isActive && (
                      <Badge variant="secondary">
                        Inativo
                      </Badge>
                    )}
                    {technique.category && (
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(technique.category)}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {getPeriodicityLabel(technique.periodicity)}
                    </Badge>
                    {technique.timeframe && (
                      <Badge variant="outline" className="text-xs">
                        {technique.timeframe}
                      </Badge>
                    )}
                    {technique.risk_level && (
                      <Badge className={`text-xs ${getRiskBadgeColor(technique.risk_level)}`}>
                        {getRiskLabel(technique.risk_level)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 relative z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenBacktest(technique)
                    }}
                    title="Fazer Backtest"
                    className="pointer-events-auto"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleActive(technique)
                        }}
                        title={technique.isActive ? 'Desativar' : 'Ativar'}
                        className="pointer-events-auto"
                      >
                        {technique.isActive ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/techniques/create?id=${technique._id}`)
                        }}
                        title="Editar"
                        className="pointer-events-auto"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Excluir"
                            className="pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a técnica "{technique.title}"? 
                              Esta ação não pode ser desfeita e removerá todas as associações 
                              e análises relacionadas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(technique._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
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
        ))}
      </div>

      {techniques.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Nenhuma técnica cadastrada</h3>
              <p className="text-muted-foreground">
                Clique em "Nova Técnica" para adicionar sua primeira técnica de análise.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}