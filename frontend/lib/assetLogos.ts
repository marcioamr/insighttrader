// URLs das logomarcas dos principais ativos da B3
// Fontes: Status Invest, InfoMoney, B3, sites oficiais das empresas

interface AssetLogoMap {
  [symbol: string]: {
    logo: string
    fallbackColor: string
    company: string
  }
}

export const assetLogos: AssetLogoMap = {
  // Principais Blue Chips
  'PETR4': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/PETR4.png',
    fallbackColor: '#00A859',
    company: 'Petrobras'
  },
  'VALE3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/VALE3.png',
    fallbackColor: '#003A70',
    company: 'Vale'
  },
  'ITUB4': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/ITUB4.png',
    fallbackColor: '#EC7000',
    company: 'Itaú Unibanco'
  },
  'BBDC4': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/BBDC4.png',
    fallbackColor: '#CC092F',
    company: 'Bradesco'
  },
  'ABEV3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/ABEV3.png',
    fallbackColor: '#0066CC',
    company: 'Ambev'
  },
  'WEGE3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/WEGE3.png',
    fallbackColor: '#1E4D8F',
    company: 'WEG'
  },
  'MGLU3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/MGLU3.png',
    fallbackColor: '#FF6B9D',
    company: 'Magazine Luiza'
  },
  'ITSA4': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/ITSA4.png',
    fallbackColor: '#EC7000',
    company: 'Itaúsa'
  },
  'BBAS3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/BBAS3.png',
    fallbackColor: '#FEDF00',
    company: 'Banco do Brasil'
  },
  'JBSS3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/JBSS3.png',
    fallbackColor: '#00A859',
    company: 'JBS'
  },

  // Varejo
  'LREN3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/LREN3.png',
    fallbackColor: '#8B1538',
    company: 'Lojas Renner'
  },
  'VVAR3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/VVAR3.png',
    fallbackColor: '#FF4500',
    company: 'Via'
  },
  'AMER3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/AMER3.png',
    fallbackColor: '#E31E24',
    company: 'Americanas'
  },
  'PCAR3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/PCAR3.png',
    fallbackColor: '#00A859',
    company: 'P.Açúcar-CBD'
  },
  'CRFB3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/CRFB3.png',
    fallbackColor: '#0066CC',
    company: 'Carrefour Brasil'
  },

  // Tecnologia
  'TOTS3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/TOTS3.png',
    fallbackColor: '#00A859',
    company: 'Totvs'
  },
  'LWSA3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/LWSA3.png',
    fallbackColor: '#0066CC',
    company: 'Locaweb'
  },
  'POSI3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/POSI3.png',
    fallbackColor: '#666666',
    company: 'Positivo'
  },

  // Energia
  'EGIE3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/EGIE3.png',
    fallbackColor: '#00A859',
    company: 'Engie Brasil'
  },
  'CPFE3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/CPFE3.png',
    fallbackColor: '#0066CC',
    company: 'CPFL Energia'
  },
  'EQTL3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/EQTL3.png',
    fallbackColor: '#FF4500',
    company: 'Equatorial'
  },
  'ENBR3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/ENBR3.png',
    fallbackColor: '#00A859',
    company: 'EDP Brasil'
  },

  // Construção
  'MRVE3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/MRVE3.png',
    fallbackColor: '#FF4500',
    company: 'MRV'
  },
  'CYRE3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/CYRE3.png',
    fallbackColor: '#0066CC',
    company: 'Cyrela'
  },
  'EZTC3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/EZTC3.png',
    fallbackColor: '#FEDF00',
    company: 'Eztec'
  },

  // Siderurgia
  'USIM5': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/USIM5.png',
    fallbackColor: '#666666',
    company: 'Usiminas'
  },
  'CSNA3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/CSNA3.png',
    fallbackColor: '#003A70',
    company: 'CSN'
  },
  'GGBR4': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/GGBR4.png',
    fallbackColor: '#FF4500',
    company: 'Gerdau'
  },

  // Papel e Celulose
  'SUZB3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/SUZB3.png',
    fallbackColor: '#00A859',
    company: 'Suzano'
  },
  'KLBN11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/KLBN11.png',
    fallbackColor: '#00A859',
    company: 'Klabin'
  },

  // Telecomunicações
  'VIVT3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/VIVT3.png',
    fallbackColor: '#8B1538',
    company: 'Vivo'
  },
  'TIMS3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/TIMS3.png',
    fallbackColor: '#0066CC',
    company: 'Tim'
  },

  // Alimentação
  'BEEF3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/BEEF3.png',
    fallbackColor: '#CC092F',
    company: 'Minerva'
  },
  'BRFS3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/BRFS3.png',
    fallbackColor: '#FEDF00',
    company: 'BRF'
  },
  'SMTO3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/SMTO3.png',
    fallbackColor: '#00A859',
    company: 'São Martinho'
  },

  // Saúde
  'RDOR3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/RDOR3.png',
    fallbackColor: '#CC092F',
    company: 'Rede D\'Or'
  },
  'HAPV3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/HAPV3.png',
    fallbackColor: '#00A859',
    company: 'Hapvida'
  },
  'QUAL3': {
    logo: 'https://statusinvest.com.br/Content/images/icons-acoes/QUAL3.png',
    fallbackColor: '#0066CC',
    company: 'Qualicorp'
  },

  // ETFs
  'BOVA11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/BOVA11.png',
    fallbackColor: '#003A70',
    company: 'iShares Ibovespa'
  },
  'SMAL11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/SMAL11.png',
    fallbackColor: '#8B1538',
    company: 'iShares Small Cap'
  },
  'IVVB11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/IVVB11.png',
    fallbackColor: '#00A859',
    company: 'iShares S&P 500'
  },

  // FIIs
  'HGLG11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/HGLG11.png',
    fallbackColor: '#0066CC',
    company: 'CSHG Logística'
  },
  'VISC11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/VISC11.png',
    fallbackColor: '#8B1538',
    company: 'Vinci Shopping Centers'
  },
  'XPLG11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/XPLG11.png',
    fallbackColor: '#0066CC',
    company: 'XP Log'
  },
  'KNRI11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/KNRI11.png',
    fallbackColor: '#666666',
    company: 'Kinea Renda Imobiliária'
  },
  'BCFF11': {
    logo: 'https://statusinvest.com.br/Content/images/icons-fundos/BCFF11.png',
    fallbackColor: '#FEDF00',
    company: 'BC Ffii'
  }
}

// URLs alternativas caso a primeira falhe
export const alternativeLogoSources = {
  statusInvest: (symbol: string) => `https://statusinvest.com.br/Content/images/icons-acoes/${symbol}.png`,
  fundamentus: (symbol: string) => `https://fundamentus.com.br/logos/${symbol.toLowerCase()}.png`,
  b3: (symbol: string) => `https://www.b3.com.br/data/files/A0/42/77/0B/logos/${symbol}.png`,
  // Fallback para logos genéricos por setor
  generic: {
    bank: 'https://img.icons8.com/color/96/bank.png',
    oil: 'https://img.icons8.com/color/96/oil-industry.png',
    mining: 'https://img.icons8.com/color/96/mining.png',
    retail: 'https://img.icons8.com/color/96/shopping-bag.png',
    tech: 'https://img.icons8.com/color/96/computer.png',
    energy: 'https://img.icons8.com/color/96/electrical.png',
    construction: 'https://img.icons8.com/color/96/construction.png',
    telecom: 'https://img.icons8.com/color/96/phone.png',
    healthcare: 'https://img.icons8.com/color/96/health.png',
    food: 'https://img.icons8.com/color/96/restaurant.png',
    default: 'https://img.icons8.com/color/96/stocks.png'
  }
}

// Função para obter a logo do ativo
export const getAssetLogo = (symbol: string, type: string, sector?: string) => {
  // Primeiro tenta a logo específica
  if (assetLogos[symbol]) {
    return {
      logo: assetLogos[symbol].logo,
      fallbackColor: assetLogos[symbol].fallbackColor,
      company: assetLogos[symbol].company,
      hasLogo: true
    }
  }
  
  // Tenta fontes alternativas
  return {
    logo: alternativeLogoSources.statusInvest(symbol),
    fallbackColor: '#0066CC',
    company: symbol,
    hasLogo: false
  }
}

// Função para determinar ícone genérico baseado no setor/tipo
export const getGenericSectorIcon = (symbol: string, type: string) => {
  const symbolUpper = symbol.toUpperCase()
  
  // Bancos
  if (['ITUB4', 'BBDC4', 'BBAS3', 'ITSA4'].includes(symbolUpper)) {
    return alternativeLogoSources.generic.bank
  }
  
  // Petróleo
  if (['PETR4'].includes(symbolUpper)) {
    return alternativeLogoSources.generic.oil
  }
  
  // Mineração
  if (['VALE3', 'USIM5', 'CSNA3', 'GGBR4'].includes(symbolUpper)) {
    return alternativeLogoSources.generic.mining
  }
  
  // Varejo
  if (['MGLU3', 'LREN3', 'VVAR3', 'AMER3'].includes(symbolUpper)) {
    return alternativeLogoSources.generic.retail
  }
  
  // Tecnologia
  if (['TOTS3', 'LWSA3', 'POSI3', 'WEGE3'].includes(symbolUpper)) {
    return alternativeLogoSources.generic.tech
  }
  
  // Por tipo
  switch (type) {
    case 'currency':
      return 'https://img.icons8.com/color/96/money.png'
    case 'index':
      return 'https://img.icons8.com/color/96/line-chart.png'
    default:
      return alternativeLogoSources.generic.default
  }
}