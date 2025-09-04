// Sistema de logos usando CDNs públicos e logos disponíveis
// Fontes: Wikimedia, CDNs públicos, APIs abertas

interface LogoConfig {
  url: string
  fallbackColor: string
  description: string
  source: string
}

export const publicLogos: Record<string, LogoConfig> = {
  // Grandes bancos - logos oficiais via Wikimedia/CDNs públicos
  'ITUB4': {
    url: 'https://logos-world.net/wp-content/uploads/2021/03/Itau-Logo.png',
    fallbackColor: '#EC7000',
    description: 'Itaú Unibanco',
    source: 'public'
  },
  'BBDC4': {
    url: 'https://logoeps.com/wp-content/uploads/2013/03/bradesco-vector-logo.png',
    fallbackColor: '#CC092F', 
    description: 'Bradesco',
    source: 'public'
  },
  'BBAS3': {
    url: 'https://logoeps.com/wp-content/uploads/2013/03/banco-do-brasil-vector-logo.png',
    fallbackColor: '#FEDF00',
    description: 'Banco do Brasil',
    source: 'public'
  },

  // Commodities/Energia
  'PETR4': {
    url: 'https://logoeps.com/wp-content/uploads/2013/03/petrobras-vector-logo.png',
    fallbackColor: '#00A859',
    description: 'Petrobras',
    source: 'public'
  },
  'VALE3': {
    url: 'https://companieslogo.com/img/orig/VALE3.SA-b3173b25.png',
    fallbackColor: '#003A70',
    description: 'Vale',
    source: 'public'
  },

  // Varejo
  'MGLU3': {
    url: 'https://logoeps.com/wp-content/uploads/2013/03/magazine-luiza-vector-logo.png',
    fallbackColor: '#FF6B9D',
    description: 'Magazine Luiza',
    source: 'public'
  },
  'ABEV3': {
    url: 'https://logoeps.com/wp-content/uploads/2013/03/ambev-vector-logo.png',
    fallbackColor: '#0066CC',
    description: 'Ambev',
    source: 'public'
  },

  // Tecnologia/Industrial
  'WEGE3': {
    url: 'https://companieslogo.com/img/orig/WEGE3.SA-f3cb75de.png',
    fallbackColor: '#1E4D8F',
    description: 'WEG',
    source: 'public'
  },

  // Para ativos sem logo específica, vamos usar ícones do Phosphor Icons (CDN público)
  // Ações
  'DEFAULT_STOCK': {
    url: 'https://img.icons8.com/fluency/96/stocks.png',
    fallbackColor: '#0066CC',
    description: 'Ação',
    source: 'icons8'
  },
  // Moedas
  'DEFAULT_CURRENCY': {
    url: 'https://img.icons8.com/fluency/96/us-dollar.png',
    fallbackColor: '#00A859',
    description: 'Moeda',
    source: 'icons8'
  },
  // Commodities
  'DEFAULT_COMMODITY': {
    url: 'https://img.icons8.com/fluency/96/oil-industry.png',
    fallbackColor: '#FF4500',
    description: 'Commodity',
    source: 'icons8'
  },
  // Índices/ETFs
  'DEFAULT_INDEX': {
    url: 'https://img.icons8.com/fluency/96/line-chart.png',
    fallbackColor: '#8B1538',
    description: 'Índice/ETF',
    source: 'icons8'
  }
}

// Mapeamento de setores para ícones genéricos
const sectorIcons: Record<string, string> = {
  // Financeiro
  'bank': 'https://img.icons8.com/fluency/96/bank.png',
  'insurance': 'https://img.icons8.com/fluency/96/insurance.png',
  
  // Energia
  'oil': 'https://img.icons8.com/fluency/96/oil-industry.png',
  'energy': 'https://img.icons8.com/fluency/96/electrical.png',
  'utilities': 'https://img.icons8.com/fluency/96/electricity.png',
  
  // Tecnologia  
  'tech': 'https://img.icons8.com/fluency/96/computer.png',
  'software': 'https://img.icons8.com/fluency/96/code.png',
  'telecom': 'https://img.icons8.com/fluency/96/phone.png',
  
  // Varejo
  'retail': 'https://img.icons8.com/fluency/96/shopping-bag.png',
  'ecommerce': 'https://img.icons8.com/fluency/96/online-shop.png',
  
  // Industrial
  'manufacturing': 'https://img.icons8.com/fluency/96/factory.png',
  'construction': 'https://img.icons8.com/fluency/96/construction.png',
  'mining': 'https://img.icons8.com/fluency/96/mining.png',
  
  // Saúde
  'healthcare': 'https://img.icons8.com/fluency/96/health.png',
  'pharma': 'https://img.icons8.com/fluency/96/pill.png',
  
  // Transporte
  'logistics': 'https://img.icons8.com/fluency/96/truck.png',
  'airline': 'https://img.icons8.com/fluency/96/airplane.png',
  
  // Real Estate
  'realestate': 'https://img.icons8.com/fluency/96/real-estate.png',
  
  // Alimentação
  'food': 'https://img.icons8.com/fluency/96/restaurant.png',
  'agriculture': 'https://img.icons8.com/fluency/96/wheat.png'
}

// Função para determinar setor baseado no símbolo
function getSectorBySymbol(symbol: string): string {
  const symbolUpper = symbol.toUpperCase()
  
  // Bancos
  if (['ITUB4', 'BBDC4', 'BBAS3', 'ITSA4', 'SANB11'].includes(symbolUpper)) {
    return 'bank'
  }
  
  // Petróleo/Energia
  if (['PETR4', 'PETR3'].includes(symbolUpper)) {
    return 'oil'
  }
  
  // Utilities/Energia elétrica
  if (['EGIE3', 'CPFE3', 'EQTL3', 'ENBR3', 'TAEE11'].includes(symbolUpper)) {
    return 'utilities'
  }
  
  // Mineração
  if (['VALE3', 'USIM5', 'CSNA3', 'GGBR4'].includes(symbolUpper)) {
    return 'mining'
  }
  
  // Varejo
  if (['MGLU3', 'LREN3', 'VVAR3', 'AMER3', 'PCAR3', 'CRFB3'].includes(symbolUpper)) {
    return 'retail'
  }
  
  // Tecnologia
  if (['TOTS3', 'LWSA3', 'POSI3'].includes(symbolUpper)) {
    return 'tech'
  }
  
  // Industrial/Manufatura
  if (['WEGE3'].includes(symbolUpper)) {
    return 'manufacturing'
  }
  
  // Telecomunicações
  if (['VIVT3', 'TIMS3'].includes(symbolUpper)) {
    return 'telecom'
  }
  
  // Saúde
  if (['RDOR3', 'HAPV3', 'QUAL3'].includes(symbolUpper)) {
    return 'healthcare'
  }
  
  // Alimentação
  if (['JBSS3', 'BEEF3', 'BRFS3', 'SMTO3'].includes(symbolUpper)) {
    return 'food'
  }
  
  // Construção
  if (['MRVE3', 'CYRE3', 'EZTC3'].includes(symbolUpper)) {
    return 'construction'
  }
  
  // Real Estate (FIIs)
  if (symbolUpper.endsWith('11') && ['HGLG11', 'VISC11', 'XPLG11', 'KNRI11', 'BCFF11'].includes(symbolUpper)) {
    return 'realestate'
  }
  
  return 'default'
}

// Função principal para obter logo
export function getPublicLogo(symbol: string, type: string): LogoConfig {
  // Primeiro tenta logo específica
  if (publicLogos[symbol]) {
    return publicLogos[symbol]
  }
  
  // Determina setor e tenta ícone setorial
  const sector = getSectorBySymbol(symbol)
  if (sector !== 'default' && sectorIcons[sector]) {
    return {
      url: sectorIcons[sector],
      fallbackColor: getColorBySector(sector),
      description: symbol,
      source: 'sector'
    }
  }
  
  // Fallback por tipo de ativo
  switch (type) {
    case 'currency':
      return publicLogos['DEFAULT_CURRENCY']
    case 'commodity':
      return publicLogos['DEFAULT_COMMODITY']
    case 'index':
      return publicLogos['DEFAULT_INDEX']
    default:
      return publicLogos['DEFAULT_STOCK']
  }
}

// Cores por setor
function getColorBySector(sector: string): string {
  const sectorColors: Record<string, string> = {
    bank: '#EC7000',
    oil: '#00A859', 
    utilities: '#0066CC',
    mining: '#666666',
    retail: '#FF6B9D',
    tech: '#8B1538',
    manufacturing: '#1E4D8F',
    telecom: '#FF4500',
    healthcare: '#CC092F',
    food: '#FEDF00',
    construction: '#003A70',
    realestate: '#8B1538'
  }
  
  return sectorColors[sector] || '#0066CC'
}

// Função para verificar se logo está carregando
export async function validateLogoUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
    return true // Se não der erro, consideramos válida
  } catch {
    return false
  }
}