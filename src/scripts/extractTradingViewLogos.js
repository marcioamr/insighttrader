const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

// Lista dos principais ativos da B3 para buscar no TradingView
const b3Assets = [
  'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3', 'WEGE3', 'MGLU3', 'ITSA4', 'BBAS3', 'JBSS3',
  'LREN3', 'VVAR3', 'AMER3', 'PCAR3', 'CRFB3', 'TOTS3', 'LWSA3', 'POSI3', 'EGIE3', 'CPFE3',
  'EQTL3', 'ENBR3', 'MRVE3', 'CYRE3', 'EZTC3', 'USIM5', 'CSNA3', 'GGBR4', 'SUZB3', 'KLBN11',
  'VIVT3', 'TIMS3', 'BEEF3', 'BRFS3', 'SMTO3', 'RDOR3', 'HAPV3', 'QUAL3', 'BOVA11', 'SMAL11',
  'IVVB11', 'HGLG11', 'VISC11', 'XPLG11', 'KNRI11', 'BCFF11', 'RAIZ4', 'AZUL4', 'GOAU4',
  'RENT3', 'RAIL3', 'CCRO3', 'CIEL3', 'NTCO3', 'TAEE11', 'CMIN3', 'MULT3', 'PETZ3', 'RADL3'
];

class TradingViewLogoExtractor {
  constructor() {
    this.baseUrl = 'https://br.tradingview.com';
    this.logoCache = new Map();
    this.results = [];
  }

  // Função para gerar URLs do TradingView baseado no padrão observado
  generateTradingViewLogoUrl(symbol) {
    // TradingView usa diferentes formatos de URL para logos
    const formats = [
      `https://s3-symbol-logo.tradingview.com/BMFBOVESPA/${symbol.toLowerCase()}.svg`,
      `https://s3-symbol-logo.tradingview.com/bovespa/${symbol.toLowerCase()}.svg`,
      `https://s3-symbol-logo.tradingview.com/${symbol.toLowerCase()}.svg`,
      `https://static.tradingview.com/static/bundles/embed-widget-symbol-info.f964ebb8dcb1ed5ad99b.js.gz`,
    ];
    
    // Retorna o primeiro formato como padrão
    return formats[0];
  }

  // Verifica se a URL da logo é válida
  async validateLogoUrl(url) {
    try {
      const response = await axios.head(url, { 
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Busca informações do símbolo no TradingView
  async fetchSymbolInfo(symbol) {
    try {
      const searchUrl = `https://symbol-search.tradingview.com/symbol_search/?text=${symbol}&exchange=BMFBOVESPA&lang=pt&type=stock&domain=production`;
      
      const response = await axios.get(searchUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://br.tradingview.com/',
          'Accept': 'application/json'
        }
      });

      if (response.data && response.data.symbols && response.data.symbols.length > 0) {
        const symbolData = response.data.symbols[0];
        return {
          symbol: symbolData.symbol,
          description: symbolData.description,
          logoid: symbolData.logoid,
          exchange: symbolData.exchange
        };
      }
    } catch (error) {
      logger.warn(`Error fetching symbol info for ${symbol}:`, error.message);
    }
    return null;
  }

  // Extrai logos para todos os símbolos
  async extractAllLogos() {
    logger.info('Starting TradingView logo extraction...');
    
    for (const symbol of b3Assets) {
      try {
        logger.info(`Processing ${symbol}...`);
        
        // Busca informações do símbolo
        const symbolInfo = await this.fetchSymbolInfo(symbol);
        
        // Gera URLs possíveis para a logo
        const logoUrls = [
          this.generateTradingViewLogoUrl(symbol),
          `https://s3-symbol-logo.tradingview.com/BOVESPA/${symbol.toLowerCase()}.svg`,
          `https://s3-symbol-logo.tradingview.com/${symbol.toLowerCase()}.svg`,
          symbolInfo?.logoid ? `https://s3-symbol-logo.tradingview.com/${symbolInfo.logoid}.svg` : null
        ].filter(Boolean);

        let validUrl = null;
        let symbolData = symbolInfo;

        // Testa cada URL até encontrar uma válida
        for (const url of logoUrls) {
          if (await this.validateLogoUrl(url)) {
            validUrl = url;
            break;
          }
        }

        // Se não encontrou URL válida, usa dados padrão
        if (!validUrl) {
          validUrl = `https://s3-symbol-logo.tradingview.com/BMFBOVESPA/${symbol.toLowerCase()}.svg`;
          logger.warn(`No valid logo found for ${symbol}, using default URL`);
        }

        this.results.push({
          symbol,
          logoUrl: validUrl,
          description: symbolData?.description || symbol,
          exchange: symbolData?.exchange || 'BMFBOVESPA',
          validated: validUrl !== null,
          tradingViewData: symbolData
        });

        // Pequena pausa para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        logger.error(`Error processing ${symbol}:`, error.message);
        
        // Adiciona entrada com dados mínimos
        this.results.push({
          symbol,
          logoUrl: this.generateTradingViewLogoUrl(symbol),
          description: symbol,
          exchange: 'BMFBOVESPA',
          validated: false,
          error: error.message
        });
      }
    }

    return this.results;
  }

  // Gera arquivo TypeScript com os dados extraídos
  generateLogosFile() {
    const jsContent = `// Logos extraídas do TradingView
// Gerado automaticamente em ${new Date().toISOString()}

interface TradingViewAssetLogo {
  symbol: string
  logoUrl: string
  description: string
  exchange: string
  validated: boolean
  fallbackColor: string
}

export const tradingViewLogos: Record<string, TradingViewAssetLogo> = {
${this.results.map(item => `  '${item.symbol}': {
    symbol: '${item.symbol}',
    logoUrl: '${item.logoUrl}',
    description: '${item.description}',
    exchange: '${item.exchange}',
    validated: ${item.validated},
    fallbackColor: '${this.getFallbackColor(item.symbol)}'
  }`).join(',\n')}
}

// Função para obter logo do TradingView
export const getTradingViewLogo = (symbol: string) => {
  const logoData = tradingViewLogos[symbol]
  if (logoData) {
    return logoData
  }
  
  // Fallback para símbolos não mapeados
  return {
    symbol,
    logoUrl: \`https://s3-symbol-logo.tradingview.com/BMFBOVESPA/\${symbol.toLowerCase()}.svg\`,
    description: symbol,
    exchange: 'BMFBOVESPA',
    validated: false,
    fallbackColor: '#0066CC'
  }
}

// Estatísticas da extração
export const extractionStats = {
  totalSymbols: ${this.results.length},
  validatedLogos: ${this.results.filter(r => r.validated).length},
  extractionDate: '${new Date().toISOString()}'
}
`;

    const outputPath = path.join(__dirname, '../../frontend/lib/tradingViewLogos.ts');
    fs.writeFileSync(outputPath, jsContent);
    logger.info(`TradingView logos file generated: ${outputPath}`);
  }

  // Gera cor de fallback baseada no símbolo
  getFallbackColor(symbol) {
    const colors = [
      '#0066CC', '#00A859', '#FF4500', '#8B1538', '#FEDF00', 
      '#CC092F', '#003A70', '#EC7000', '#666666', '#FF6B9D'
    ];
    
    const hash = symbol.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  // Salva resultados em JSON para análise
  saveResults() {
    const outputPath = path.join(__dirname, 'tradingview-logos-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
    logger.info(`Results saved to: ${outputPath}`);
  }

  // Relatório de estatísticas
  generateReport() {
    const total = this.results.length;
    const validated = this.results.filter(r => r.validated).length;
    const withErrors = this.results.filter(r => r.error).length;

    logger.info('=== TradingView Logo Extraction Report ===');
    logger.info(`Total symbols processed: ${total}`);
    logger.info(`Validated logos: ${validated} (${((validated/total)*100).toFixed(1)}%)`);
    logger.info(`Errors encountered: ${withErrors}`);
    logger.info(`Success rate: ${((validated/total)*100).toFixed(1)}%`);
    
    // Lista símbolos com erro
    if (withErrors > 0) {
      logger.info('Symbols with errors:');
      this.results.filter(r => r.error).forEach(r => {
        logger.info(`  - ${r.symbol}: ${r.error}`);
      });
    }
  }
}

// Executa a extração se chamado diretamente
async function main() {
  const extractor = new TradingViewLogoExtractor();
  
  try {
    await extractor.extractAllLogos();
    extractor.generateLogosFile();
    extractor.saveResults();
    extractor.generateReport();
    
    logger.info('TradingView logo extraction completed successfully!');
  } catch (error) {
    logger.error('Error during extraction:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TradingViewLogoExtractor;