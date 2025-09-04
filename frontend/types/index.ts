export interface AnalysisTechnique {
  _id: string
  title: string
  description: string
  category?: 'momentum' | 'trend' | 'volatility' | 'volume' | 'support_resistance' | 'patterns'
  periodicity: 'hourly' | 'daily' | 'weekly' | 'monthly'
  timeframe?: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M'
  parameters?: {
    period?: number
    signal_threshold?: number
    stop_loss?: number
    take_profit?: number
  }
  signal_conditions?: {
    buy_condition?: string
    sell_condition?: string
    neutral_condition?: string
  }
  risk_level?: 'low' | 'medium' | 'high'
  min_volume?: number
  market_cap_filter?: 'small' | 'medium' | 'large' | 'any'
  backtest_results?: {
    win_rate?: number
    profit_factor?: number
    max_drawdown?: number
    sharpe_ratio?: number
    last_backtest?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Asset {
  _id: string
  symbol: string
  name: string
  type: 'stock' | 'currency' | 'commodity' | 'index'
  market: 'B3' | 'USD' | 'CRYPTO'
  isActive: boolean
  logoPath?: string | null
  metadata?: {
    hg_data?: {
      description?: string
      website?: string
      sector?: string
      market_cap?: number
      logo?: string | {
        small?: string
        big?: string
      }
      currency?: string
      document?: string
    }
  }
  createdAt: string
  updatedAt: string
}

export interface AssetTechnique {
  _id: string
  asset: Asset
  technique: AnalysisTechnique
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Insight {
  _id: string
  asset: Asset
  technique: AnalysisTechnique
  analysis: string
  recommendation: 'buy' | 'sell' | 'hold'
  confidence: number
  price: number
  targetPrice?: number
  stopLoss?: number
  isHidden: boolean
  executedAt: string
  createdAt: string
}

export interface DashboardStats {
  totals: {
    insights: number
    buy: number
    sell: number
    hold: number
    hidden: number
  }
  avgConfidence: number
  recentInsights: Insight[]
}

export interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    current: number
    pages: number
    total: number
  }
}