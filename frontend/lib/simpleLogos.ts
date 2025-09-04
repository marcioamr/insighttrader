// Sistema simplificado de logos usando apenas ícones setoriais
// Fonte: Icons8 (CDN público e confiável)

interface SimpleLogoConfig {
  url: string
  fallbackColor: string
  description: string
}

// Mapeamento direto de símbolos para ícones setoriais
const symbolToIcon: Record<string, SimpleLogoConfig> = {
  // Bancos - Ícone de banco
  'ITUB4': {
    url: 'https://img.icons8.com/fluency/96/bank.png',
    fallbackColor: '#EC7000',
    description: 'Itaú Unibanco'
  },
  'BBDC4': {
    url: 'https://img.icons8.com/fluency/96/bank.png',
    fallbackColor: '#CC092F',
    description: 'Bradesco'
  },
  'BBAS3': {
    url: 'https://img.icons8.com/fluency/96/bank.png',
    fallbackColor: '#FEDF00',
    description: 'Banco do Brasil'
  },
  'ITSA4': {
    url: 'https://img.icons8.com/fluency/96/bank.png',
    fallbackColor: '#EC7000',
    description: 'Itaúsa'
  },

  // Petróleo - Ícone de petróleo
  'PETR4': {
    url: 'https://img.icons8.com/fluency/96/oil-industry.png',
    fallbackColor: '#00A859',
    description: 'Petrobras'
  },

  // Mineração - Ícone de mineração
  'VALE3': {
    url: 'https://img.icons8.com/fluency/96/mining.png',
    fallbackColor: '#003A70',
    description: 'Vale'
  },
  'USIM5': {
    url: 'https://img.icons8.com/fluency/96/mining.png',
    fallbackColor: '#666666',
    description: 'Usiminas'
  },
  'CSNA3': {
    url: 'https://img.icons8.com/fluency/96/mining.png',
    fallbackColor: '#003A70',
    description: 'CSN'
  },
  'GGBR4': {
    url: 'https://img.icons8.com/fluency/96/mining.png',
    fallbackColor: '#FF4500',
    description: 'Gerdau'
  },

  // Varejo - Ícone de shopping
  'MGLU3': {
    url: 'https://img.icons8.com/fluency/96/shopping-bag.png',
    fallbackColor: '#FF6B9D',
    description: 'Magazine Luiza'
  },
  'LREN3': {
    url: 'https://img.icons8.com/fluency/96/shopping-bag.png',
    fallbackColor: '#8B1538',
    description: 'Lojas Renner'
  },
  'VVAR3': {
    url: 'https://img.icons8.com/fluency/96/online-shop.png',
    fallbackColor: '#FF4500',
    description: 'Via'
  },
  'AMER3': {
    url: 'https://img.icons8.com/fluency/96/shopping-cart.png',
    fallbackColor: '#E31E24',
    description: 'Americanas'
  },
  'PCAR3': {
    url: 'https://img.icons8.com/fluency/96/shopping-bag.png',
    fallbackColor: '#00A859',
    description: 'P.Açúcar-CBD'
  },
  'CRFB3': {
    url: 'https://img.icons8.com/fluency/96/shopping-cart.png',
    fallbackColor: '#0066CC',
    description: 'Carrefour Brasil'
  },

  // Tecnologia - Ícone de computador/código
  'TOTS3': {
    url: 'https://img.icons8.com/fluency/96/code.png',
    fallbackColor: '#00A859',
    description: 'Totvs'
  },
  'LWSA3': {
    url: 'https://img.icons8.com/fluency/96/server.png',
    fallbackColor: '#0066CC',
    description: 'Locaweb'
  },
  'POSI3': {
    url: 'https://img.icons8.com/fluency/96/computer.png',
    fallbackColor: '#666666',
    description: 'Positivo'
  },

  // Energia/Utilities - Ícone de energia
  'EGIE3': {
    url: 'https://img.icons8.com/fluency/96/electricity.png',
    fallbackColor: '#00A859',
    description: 'Engie Brasil'
  },
  'CPFE3': {
    url: 'https://img.icons8.com/fluency/96/electrical.png',
    fallbackColor: '#0066CC',
    description: 'CPFL Energia'
  },
  'EQTL3': {
    url: 'https://img.icons8.com/fluency/96/high-voltage.png',
    fallbackColor: '#FF4500',
    description: 'Equatorial'
  },
  'ENBR3': {
    url: 'https://img.icons8.com/fluency/96/electricity.png',
    fallbackColor: '#00A859',
    description: 'EDP Brasil'
  },
  'TAEE11': {
    url: 'https://img.icons8.com/fluency/96/electrical.png',
    fallbackColor: '#0066CC',
    description: 'Taesa'
  },

  // Industrial - Ícone de fábrica
  'WEGE3': {
    url: 'https://img.icons8.com/fluency/96/factory.png',
    fallbackColor: '#1E4D8F',
    description: 'WEG'
  },

  // Construção - Ícone de construção
  'MRVE3': {
    url: 'https://img.icons8.com/fluency/96/construction.png',
    fallbackColor: '#FF4500',
    description: 'MRV'
  },
  'CYRE3': {
    url: 'https://img.icons8.com/fluency/96/real-estate.png',
    fallbackColor: '#0066CC',
    description: 'Cyrela'
  },
  'EZTC3': {
    url: 'https://img.icons8.com/fluency/96/construction.png',
    fallbackColor: '#FEDF00',
    description: 'Eztec'
  },

  // Papel e Celulose - Ícone de árvore
  'SUZB3': {
    url: 'https://img.icons8.com/fluency/96/tree.png',
    fallbackColor: '#00A859',
    description: 'Suzano'
  },
  'KLBN11': {
    url: 'https://img.icons8.com/fluency/96/tree.png',
    fallbackColor: '#00A859',
    description: 'Klabin'
  },

  // Telecomunicações - Ícone de telefone
  'VIVT3': {
    url: 'https://img.icons8.com/fluency/96/phone.png',
    fallbackColor: '#8B1538',
    description: 'Vivo'
  },
  'TIMS3': {
    url: 'https://img.icons8.com/fluency/96/smartphone.png',
    fallbackColor: '#0066CC',
    description: 'Tim'
  },

  // Alimentação - Ícone de comida
  'BEEF3': {
    url: 'https://img.icons8.com/fluency/96/restaurant.png',
    fallbackColor: '#CC092F',
    description: 'Minerva'
  },
  'BRFS3': {
    url: 'https://img.icons8.com/fluency/96/restaurant.png',
    fallbackColor: '#FEDF00',
    description: 'BRF'
  },
  'JBSS3': {
    url: 'https://img.icons8.com/fluency/96/restaurant.png',
    fallbackColor: '#00A859',
    description: 'JBS'
  },
  'SMTO3': {
    url: 'https://img.icons8.com/fluency/96/wheat.png',
    fallbackColor: '#00A859',
    description: 'São Martinho'
  },
  'ABEV3': {
    url: 'https://img.icons8.com/fluency/96/beer.png',
    fallbackColor: '#0066CC',
    description: 'Ambev'
  },

  // Saúde - Ícone de saúde
  'RDOR3': {
    url: 'https://img.icons8.com/fluency/96/health.png',
    fallbackColor: '#CC092F',
    description: 'Rede D\'Or'
  },
  'HAPV3': {
    url: 'https://img.icons8.com/fluency/96/health.png',
    fallbackColor: '#00A859',
    description: 'Hapvida'
  },
  'QUAL3': {
    url: 'https://img.icons8.com/fluency/96/health.png',
    fallbackColor: '#0066CC',
    description: 'Qualicorp'
  },

  // ETFs - Ícone de gráfico
  'BOVA11': {
    url: 'https://img.icons8.com/fluency/96/line-chart.png',
    fallbackColor: '#003A70',
    description: 'iShares Ibovespa'
  },
  'SMAL11': {
    url: 'https://img.icons8.com/fluency/96/pie-chart.png',
    fallbackColor: '#8B1538',
    description: 'iShares Small Cap'
  },
  'IVVB11': {
    url: 'https://img.icons8.com/fluency/96/stocks.png',
    fallbackColor: '#00A859',
    description: 'iShares S&P 500'
  },

  // FIIs - Ícone de prédio/imóveis
  'HGLG11': {
    url: 'https://img.icons8.com/fluency/96/warehouse.png',
    fallbackColor: '#0066CC',
    description: 'CSHG Logística'
  },
  'VISC11': {
    url: 'https://img.icons8.com/fluency/96/shopping-mall.png',
    fallbackColor: '#8B1538',
    description: 'Vinci Shopping Centers'
  },
  'XPLG11': {
    url: 'https://img.icons8.com/fluency/96/truck.png',
    fallbackColor: '#0066CC',
    description: 'XP Log'
  },
  'KNRI11': {
    url: 'https://img.icons8.com/fluency/96/real-estate.png',
    fallbackColor: '#666666',
    description: 'Kinea Renda Imobiliária'
  },
  'BCFF11': {
    url: 'https://img.icons8.com/fluency/96/real-estate.png',
    fallbackColor: '#FEDF00',
    description: 'BC Ffii'
  },

  // Futuros - Ícone de moeda/gráfico
  'WDOM25': {
    url: 'https://img.icons8.com/fluency/96/us-dollar.png',
    fallbackColor: '#00A859',
    description: 'Mini Dólar Mar/25'
  },
  'WINM25': {
    url: 'https://img.icons8.com/fluency/96/line-chart.png',
    fallbackColor: '#FF4500',
    description: 'Mini Ibovespa Mar/25'
  }
}

// Ícones genéricos por tipo de ativo
const defaultIcons: Record<string, SimpleLogoConfig> = {
  stock: {
    url: 'https://img.icons8.com/fluency/96/stocks.png',
    fallbackColor: '#0066CC',
    description: 'Ação'
  },
  currency: {
    url: 'https://img.icons8.com/fluency/96/us-dollar.png',
    fallbackColor: '#00A859',
    description: 'Moeda'
  },
  commodity: {
    url: 'https://img.icons8.com/fluency/96/oil-industry.png',
    fallbackColor: '#FF4500',
    description: 'Commodity'
  },
  index: {
    url: 'https://img.icons8.com/fluency/96/line-chart.png',
    fallbackColor: '#8B1538',
    description: 'Índice/ETF'
  }
}

// Função principal para obter logo
export function getSimpleLogo(symbol: string, type: string): SimpleLogoConfig {
  // Primeiro tenta logo específica do símbolo
  if (symbolToIcon[symbol]) {
    return symbolToIcon[symbol]
  }
  
  // Fallback para ícone genérico por tipo
  if (defaultIcons[type]) {
    return {
      ...defaultIcons[type],
      description: symbol
    }
  }
  
  // Fallback final
  return {
    ...defaultIcons.stock,
    description: symbol
  }
}