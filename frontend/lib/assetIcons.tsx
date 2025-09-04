import {
  // Setor Financeiro
  Building2, CreditCard, Landmark, PiggyBank, DollarSign,
  // Setor de Energia/Petróleo
  Fuel, Zap, Lightbulb, Battery, Power,
  // Setor de Mineração
  Mountain, Hammer, 
  // Setor de Tecnologia
  Monitor, Smartphone, Code, Server,
  // Setor de Varejo
  ShoppingBag, Store, ShoppingCart, Package,
  // Setor de Alimentação
  UtensilsCrossed, Wheat, Coffee,
  // Setor de Saúde
  Heart, Stethoscope,
  // Setor de Construção/Imobiliário
  Home, Building, Construction,
  // Setor de Telecomunicações
  Phone,
  // ETFs e Índices
  BarChart3, PieChart, TrendingUp, LineChart,
  // Futuros
  TrendingDown,
  // FIIs
  MapPin, Warehouse, Truck,
  // Papel e Celulose
  TreePine, Leaf,
  // Genérico
  Circle
} from 'lucide-react'

interface AssetIconMap {
  [symbol: string]: {
    icon: any
    color: string
    bgColor: string
  }
}

export const assetIcons: AssetIconMap = {
  // Petróleo e Energia
  'PETR4': { icon: Fuel, color: 'text-green-600', bgColor: 'bg-green-100' },
  'EGIE3': { icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  'CPFE3': { icon: Power, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'EQTL3': { icon: Lightbulb, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'ENBR3': { icon: Battery, color: 'text-green-600', bgColor: 'bg-green-100' },

  // Mineração
  'VALE3': { icon: Mountain, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  'USIM5': { icon: Hammer, color: 'text-slate-600', bgColor: 'bg-slate-100' },
  'CSNA3': { icon: Hammer, color: 'text-zinc-600', bgColor: 'bg-zinc-100' },
  'GGBR4': { icon: Hammer, color: 'text-stone-600', bgColor: 'bg-stone-100' },

  // Bancos
  'ITUB4': { icon: Building2, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'BBDC4': { icon: CreditCard, color: 'text-red-600', bgColor: 'bg-red-100' },
  'BBAS3': { icon: Landmark, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  'ITSA4': { icon: PiggyBank, color: 'text-orange-600', bgColor: 'bg-orange-100' },

  // Bebidas/Alimentação
  'ABEV3': { icon: Coffee, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'JBSS3': { icon: UtensilsCrossed, color: 'text-red-600', bgColor: 'bg-red-100' },
  'BEEF3': { icon: UtensilsCrossed, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'BRFS3': { icon: UtensilsCrossed, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  'SMTO3': { icon: Wheat, color: 'text-green-600', bgColor: 'bg-green-100' },

  // Tecnologia
  'WEGE3': { icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'TOTS3': { icon: Code, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'LWSA3': { icon: Server, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'POSI3': { icon: Monitor, color: 'text-gray-600', bgColor: 'bg-gray-100' },

  // Varejo
  'MGLU3': { icon: ShoppingBag, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  'LREN3': { icon: Store, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'VVAR3': { icon: ShoppingCart, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'AMER3': { icon: Package, color: 'text-red-600', bgColor: 'bg-red-100' },
  'PCAR3': { icon: ShoppingBag, color: 'text-green-600', bgColor: 'bg-green-100' },
  'CRFB3': { icon: ShoppingCart, color: 'text-blue-600', bgColor: 'bg-blue-100' },

  // Construção/Imobiliário
  'MRVE3': { icon: Home, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'CYRE3': { icon: Building, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'EZTC3': { icon: Construction, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },

  // Papel e Celulose
  'SUZB3': { icon: TreePine, color: 'text-green-600', bgColor: 'bg-green-100' },
  'KLBN11': { icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-100' },

  // Telecomunicações
  'VIVT3': { icon: Phone, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'TIMS3': { icon: Smartphone, color: 'text-blue-600', bgColor: 'bg-blue-100' },

  // Saúde
  'RDOR3': { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100' },
  'HAPV3': { icon: Heart, color: 'text-green-600', bgColor: 'bg-green-100' },
  'QUAL3': { icon: Stethoscope, color: 'text-blue-600', bgColor: 'bg-blue-100' },

  // ETFs e Índices
  'BOVA11': { icon: BarChart3, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'SMAL11': { icon: PieChart, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'IVVB11': { icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
  'WINM25': { icon: LineChart, color: 'text-orange-600', bgColor: 'bg-orange-100' },

  // Futuros
  'WDOM25': { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },

  // FIIs
  'HGLG11': { icon: Warehouse, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  'VISC11': { icon: Store, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'XPLG11': { icon: Truck, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'KNRI11': { icon: Building, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  'BCFF11': { icon: MapPin, color: 'text-red-600', bgColor: 'bg-red-100' }
}

// Ícones genéricos por tipo
export const genericTypeIcons = {
  stock: { icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  currency: { icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
  commodity: { icon: Mountain, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  index: { icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-100' }
}

// Função para obter ícone do ativo
export const getAssetIcon = (symbol: string, type: string) => {
  // Primeiro tenta o ícone específico
  if (assetIcons[symbol]) {
    return assetIcons[symbol]
  }
  
  // Fallback para ícone genérico do tipo
  if (genericTypeIcons[type as keyof typeof genericTypeIcons]) {
    return genericTypeIcons[type as keyof typeof genericTypeIcons]
  }
  
  // Fallback final
  return { icon: Circle, color: 'text-gray-600', bgColor: 'bg-gray-100' }
}