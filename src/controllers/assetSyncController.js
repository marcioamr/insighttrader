const Asset = require('../models/Asset');
const axios = require('axios');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');

class AssetSyncController {
  // Símbolos de ações B3 mais comuns para sincronização
  static popularB3Symbols = [
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
  ];

  // Buscar lista de tickers disponíveis na API HG Brasil
  static async fetchTickerList(apiKey, baseUrl) {
    try {
      const response = await axios.get(`${baseUrl}/finance/ticker_list`, {
        timeout: 10000
      });

      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        logger.info(`Fetched ${response.data.results.length} available tickers from HG Brasil`);
        return response.data.results;
      }

      return [];
    } catch (error) {
      logger.error('Error fetching ticker list:', error);
      
      // Tratamento específico para erro 403 (rate limiting)
      if (error.response?.status === 403) {
        const rateLimitError = new Error('HG Brasil API: Limite de requisições excedido para ticker_list');
        rateLimitError.cause = 'Rate limit exceeded - aguarde o reset diário do limite da API (00:00 UTC)';
        rateLimitError.code = 'RATE_LIMIT_EXCEEDED';
        throw rateLimitError;
      }
      
      throw new Error(`Failed to fetch ticker list: ${error.message}`);
    }
  }

  // Iniciar sincronização completa
  static async startSync(req, res) {
    try {
      const apiKey = process.env.HG_BRASIL_API_KEY;
      const baseUrl = process.env.HG_BRASIL_BASE_URL || 'https://api.hgbrasil.com';
      
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error: 'HG Brasil API key not configured',
          details: 'Configure a variável de ambiente HG_BRASIL_API_KEY com sua chave da API HG Brasil',
          stackTrace: null,
          httpStatus: 500
        });
      }

      // Buscar ativos existentes no banco de dados
      let existingAssets = [];
      try {
        existingAssets = await Asset.find({ isActive: true }).select('symbol type market').lean();
        logger.info(`Found ${existingAssets.length} active assets in database`);
      } catch (error) {
        logger.error('Error fetching existing assets from database:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch existing assets from database',
          details: 'Erro ao consultar ativos existentes no banco de dados. Verifique a conectividade com o MongoDB.',
          stackTrace: error.stack,
          httpStatus: 500
        });
      }

      // Se não há ativos cadastrados, buscar da lista de tickers da API
      if (existingAssets.length === 0) {
        logger.info('No assets found in database, fetching ticker list from API');
        try {
          const tickerList = await AssetSyncController.fetchTickerList(apiKey, baseUrl);
          if (tickerList.length > 0) {
            // Criar objetos de asset básicos a partir da lista de tickers
            existingAssets = tickerList.slice(0, 100).map(symbol => ({
              symbol: symbol.toUpperCase(),
              type: 'stock',
              market: 'B3'
            }));
            logger.info(`Using ${existingAssets.length} symbols from ticker list`);
          } else {
            // Último fallback para símbolos pré-definidos
            existingAssets = AssetSyncController.popularB3Symbols.map(symbol => ({
              symbol: symbol,
              type: 'stock', 
              market: 'B3'
            }));
            logger.warn('Using predefined symbols as fallback');
          }
        } catch (error) {
          // Verificar se é erro de rate limiting
          if (error.code === 'RATE_LIMIT_EXCEEDED') {
            return res.status(429).json({
              success: false,
              error: 'HG Brasil API: Limite de requisições excedido',
              details: 'O limite diário da API HG Brasil foi excedido. Aguarde até 00:00 UTC para o reset do limite ou use o modo de sincronização simulada.',
              stackTrace: null,
              httpStatus: 429,
              code: 'RATE_LIMIT_EXCEEDED',
              suggestions: [
                'Use o botão "Sincronização Simulada" para criar dados de teste',
                'Aguarde até meia-noite UTC (21:00 horário de Brasília) para o reset da API',
                'Considere fazer upgrade para um plano premium na HG Brasil'
              ]
            });
          }
          
          // Fallback para símbolos pré-definidos
          existingAssets = AssetSyncController.popularB3Symbols.map(symbol => ({
            symbol: symbol,
            type: 'stock',
            market: 'B3'
          }));
          logger.warn('Failed to fetch ticker list, using predefined symbols:', error.message);
        }
      }

      // Agrupar ativos por tipo para melhor organização
      const assetsByType = existingAssets.reduce((acc, asset) => {
        if (!acc[asset.type]) acc[asset.type] = [];
        acc[asset.type].push(asset);
        return acc;
      }, {});

      logger.info(`Assets grouped by type:`, Object.keys(assetsByType).map(type => 
        `${type}: ${assetsByType[type].length}`
      ).join(', '));

      const totalAssets = existingAssets.length;
      let processedAssets = 0;
      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      logger.info(`Starting asset sync for ${totalAssets} existing assets`);

      // Processar cada ativo existente
      for (const asset of existingAssets) {
        const symbol = asset.symbol;
        try {
          // Buscar dados da API HG Brasil
          const assetData = await AssetSyncController.fetchAssetData(symbol, apiKey, baseUrl);
          
          if (assetData) {
            // Salvar ou atualizar no banco
            const saveResult = await AssetSyncController.saveAsset(assetData);
            if (saveResult.success) {
              successCount++;
              logger.info(`Asset ${symbol} synced successfully`);
            } else {
              errorCount++;
              errors.push({
                symbol,
                error: 'Failed to save to database',
                details: `Erro ao salvar ${symbol}: ${saveResult.error || 'Erro desconhecido no banco de dados'}`,
                stackTrace: null,
                httpStatus: null,
                timestamp: new Date()
              });
            }
          } else {
            errorCount++;
            errors.push({
              symbol,
              error: 'No data received from API',
              details: `A API HG Brasil não retornou dados para o ativo ${symbol}. O ativo pode não estar disponível ou pode haver problema temporário na API.`,
              stackTrace: null,
              httpStatus: null,
              timestamp: new Date()
            });
          }
        } catch (error) {
          errorCount++;
          
          // Verificar se é erro de rate limiting - parar o processo
          if (error.code === 'RATE_LIMIT_EXCEEDED') {
            logger.error(`Rate limit exceeded during sync at symbol ${symbol}, stopping process`);
            return res.status(429).json({
              success: false,
              error: 'HG Brasil API: Limite de requisições excedido durante sincronização',
              details: `A sincronização foi interrompida no símbolo ${symbol} devido ao limite da API HG Brasil. ${processedAssets} ativos foram processados antes do erro.`,
              stackTrace: null,
              httpStatus: 429,
              code: 'RATE_LIMIT_EXCEEDED',
              processedBeforeError: processedAssets,
              suggestions: [
                'Use o botão "Sincronização Simulada" para criar dados de teste',
                'Aguarde até meia-noite UTC (21:00 horário de Brasília) para o reset da API',
                'Considere fazer upgrade para um plano premium na HG Brasil'
              ]
            });
          }

          errors.push({
            symbol,
            error: error.message,
            details: `Erro na sincronização do ativo ${symbol}. ${error.cause ? 'Causa: ' + error.cause : ''}`,
            stackTrace: error.stack,
            httpStatus: error.response?.status || null,
            errorCode: error.code || null,
            timestamp: new Date()
          });
          logger.error(`Error syncing ${symbol}:`, error);
        }

        processedAssets++;
        
        // Delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      logger.info(`Asset sync completed: ${successCount} success, ${errorCount} errors`);

      // Marcar como inativos os ativos que não foram sincronizados
      const syncedSymbols = new Set();
      for (const asset of existingAssets) {
        try {
          // Se conseguiu buscar dados da API (mesmo com erro de salvamento), considera como encontrado
          const assetData = await AssetSyncController.fetchAssetData(asset.symbol, apiKey, baseUrl);
          if (assetData) {
            syncedSymbols.add(asset.symbol);
          }
        } catch (error) {
          // Asset não encontrado na API, será marcado como inativo
          logger.warn(`Asset ${asset.symbol} not found in API, will be marked as inactive`);
        }
      }

      // Marcar ativos não encontrados como inativos
      const allDatabaseAssets = await Asset.find({ isActive: true }).select('symbol').lean();
      let deactivatedCount = 0;
      
      for (const dbAsset of allDatabaseAssets) {
        if (!syncedSymbols.has(dbAsset.symbol)) {
          try {
            await Asset.findOneAndUpdate(
              { symbol: dbAsset.symbol },
              { isActive: false, updatedAt: new Date() }
            );
            deactivatedCount++;
            logger.info(`Asset ${dbAsset.symbol} marked as inactive (not found in API)`);
          } catch (error) {
            logger.error(`Error deactivating asset ${dbAsset.symbol}:`, error);
          }
        }
      }

      logger.info(`Asset sync completed: ${successCount} success, ${errorCount} errors, ${deactivatedCount} deactivated`);

      res.json({
        success: true,
        data: {
          totalAssets,
          processedAssets,
          successCount,
          errorCount,
          deactivatedCount,
          errors
        }
      });

    } catch (error) {
      logger.error('Asset sync failed:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: 'Falha geral na sincronização de ativos. Verifique a configuração da API e conectividade.',
        stackTrace: error.stack,
        httpStatus: 500
      });
    }
  }

  // Buscar dados de um ativo específico da API HG Brasil
  static async fetchAssetData(symbol, apiKey, baseUrl) {
    try {
      const response = await axios.get(`${baseUrl}/finance/stock_price`, {
        params: {
          key: apiKey,
          symbol: symbol.toLowerCase()
        },
        timeout: 10000
      });

      if (response.data && response.data.results) {
        // Verificar se há erro de plano
        if (response.data.results.error) {
          throw new Error(`API Error: ${response.data.results.message}`);
        }

        // Verificar se os dados do símbolo existem
        const symbolKey = symbol.toUpperCase();
        if (response.data.results[symbolKey]) {
          const symbolData = response.data.results[symbolKey];
          
          // Verificar se há erro no symbol específico
          if (symbolData.error) {
            throw new Error(`Symbol ${symbol}: ${symbolData.message}`);
          }
          
          return symbolData;
        }
      }

      return null;
    } catch (error) {
      if (error.message.includes('Member Premium')) {
        const premiumError = new Error('HG Brasil API requires Premium plan for stock data');
        premiumError.cause = 'Premium subscription required';
        premiumError.response = error.response;
        throw premiumError;
      }
      
      if (error.response) {
        // Tratamento específico para erro 403 (rate limiting)
        if (error.response.status === 403) {
          const rateLimitError = new Error('HG Brasil API: Limite de requisições excedido');
          rateLimitError.cause = 'Rate limit exceeded - aguarde o reset diário do limite da API (00:00 UTC)';
          rateLimitError.response = error.response;
          rateLimitError.code = 'RATE_LIMIT_EXCEEDED';
          throw rateLimitError;
        }
        
        // HTTP error response
        const httpError = new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        httpError.cause = error.response.data?.message || 'API returned error response';
        httpError.response = error.response;
        throw httpError;
      }
      
      if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
        const connError = new Error('Connection timeout or refused');
        connError.cause = 'Network connectivity issue';
        throw connError;
      }
      
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  // Baixar e salvar logo do ativo
  static async downloadAssetLogo(symbol, logoUrl) {
    if (!logoUrl) return null;

    try {
      const response = await axios.get(logoUrl, {
        responseType: 'stream',
        timeout: 10000
      });

      const imageExtension = logoUrl.split('.').pop() || 'png';
      const fileName = `${symbol.toLowerCase()}.${imageExtension}`;
      const imagePath = path.join(__dirname, '../../public/images/assets', fileName);

      // Criar diretório se não existir
      const imageDir = path.dirname(imagePath);
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          logger.info(`Logo downloaded for ${symbol}: ${fileName}`);
          resolve(`/images/assets/${fileName}`);
        });
        writer.on('error', (error) => {
          logger.error(`Error downloading logo for ${symbol}:`, error);
          resolve(null);
        });
      });

    } catch (error) {
      logger.error(`Error downloading logo for ${symbol}:`, error);
      return null;
    }
  }

  // Salvar ativo no banco de dados
  static async saveAsset(assetData) {
    try {
      // Verificar se assetData e symbol existem
      if (!assetData || !assetData.symbol) {
        logger.error('Asset data or symbol is missing:', assetData);
        return false;
      }

      // Baixar logo se disponível
      let localLogoPath = null;
      let logoUrl = null;
      
      // HG Brasil agora retorna logo como objeto com small e big
      if (assetData.logo) {
        if (typeof assetData.logo === 'object' && assetData.logo.big) {
          logoUrl = assetData.logo.big;
        } else if (typeof assetData.logo === 'string') {
          logoUrl = assetData.logo;
        }
        
        if (logoUrl) {
          localLogoPath = await AssetSyncController.downloadAssetLogo(assetData.symbol, logoUrl);
        }
      }

      // Determinar tipo baseado no símbolo e dados da API
      const determineAssetType = (symbol, apiType) => {
        const symbolUpper = symbol.toUpperCase();
        
        // FIIs (Fundos Imobiliários) terminam com 11
        if (symbolUpper.endsWith('11')) {
          return 'index'; // Fundos são considerados index
        }
        
        // Outros tipos baseados na API ou símbolo
        if (apiType === 'stock' || symbolUpper.match(/[34]$/)) {
          return 'stock';
        }
        
        return 'currency'; // Default para outros casos
      };

      const assetDoc = {
        symbol: assetData.symbol.toUpperCase(),
        name: assetData.company_name || assetData.name || assetData.symbol,
        type: determineAssetType(assetData.symbol, assetData.type),
        market: 'B3',
        isActive: true,
        logoPath: localLogoPath,
        category: assetData.sector || 'Outros', // Adicionar categoria baseada no setor
        metadata: {
          hg_data: {
            description: assetData.description,
            website: assetData.website,
            sector: assetData.sector,
            market_cap: assetData.market_cap,
            logo: assetData.logo,
            currency: assetData.currency || 'BRL',
            document: assetData.document,
            // Adicionar informações de preço se disponíveis
            price: assetData.price,
            change_percent: assetData.change_percent,
            market_time: assetData.market_time,
            region: assetData.region || 'BR',
            updated_at: assetData.updated_at
          }
        },
        updatedAt: new Date()
      };

      // Tentar atualizar se já existe, senão criar novo
      const result = await Asset.findOneAndUpdate(
        { symbol: assetDoc.symbol },
        assetDoc,
        { 
          upsert: true, 
          new: true,
          runValidators: true
        }
      );

      return { success: true, result };
    } catch (error) {
      logger.error(`Error saving asset ${assetData.symbol}:`, error);
      
      // Retornar informações detalhadas do erro para debug
      return { 
        success: false, 
        error: error.message,
        code: error.code,
        validation: error.errors ? Object.keys(error.errors) : null
      };
    }
  }

  // Buscar informações sobre um símbolo específico
  static async getAssetInfo(req, res) {
    try {
      const { symbol } = req.params;
      const apiKey = process.env.HG_BRASIL_API_KEY;
      const baseUrl = process.env.HG_BRASIL_BASE_URL || 'https://api.hgbrasil.com';

      if (!apiKey) {
        return res.status(500).json({
          success: false,
          error: 'HG Brasil API key not configured'
        });
      }

      const assetData = await AssetSyncController.fetchAssetData(symbol, apiKey, baseUrl);
      
      if (!assetData) {
        return res.status(404).json({
          success: false,
          error: 'Asset not found'
        });
      }

      res.json({
        success: true,
        data: assetData
      });

    } catch (error) {
      logger.error('Error fetching asset info:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: `Erro ao buscar informações do ativo ${req.params.symbol || 'desconhecido'}`,
        stackTrace: error.stack,
        httpStatus: error.response?.status || 500
      });
    }
  }

  // Listar símbolos disponíveis para sincronização
  static async getAvailableSymbols(req, res) {
    try {
      // Buscar ativos ativos do banco de dados
      const existingAssets = await Asset.find({ isActive: true })
        .select('symbol type market')
        .sort({ symbol: 1 })
        .lean();

      // Agrupar por tipo
      const assetsByType = existingAssets.reduce((acc, asset) => {
        if (!acc[asset.type]) acc[asset.type] = [];
        acc[asset.type].push(asset.symbol);
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          symbols: existingAssets.map(asset => asset.symbol),
          total: existingAssets.length,
          byType: assetsByType,
          summary: Object.keys(assetsByType).map(type => ({
            type,
            count: assetsByType[type].length,
            symbols: assetsByType[type]
          }))
        }
      });
    } catch (error) {
      logger.error('Error getting available symbols:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: 'Erro ao buscar símbolos disponíveis no banco de dados',
        stackTrace: error.stack,
        httpStatus: 500
      });
    }
  }

  // Sincronização simulada (para quando não há API premium)
  static async simulateSync(req, res) {
    try {
      logger.info('Starting simulated asset sync');

      const totalAssets = AssetSyncController.popularB3Symbols.length;
      let successCount = 0;
      const errors = [];

      // Simular o processamento de alguns ativos
      for (const symbol of AssetSyncController.popularB3Symbols.slice(0, 10)) {
        try {
          // Criar dados simulados
          const mockAssetData = {
            symbol: symbol,
            company_name: `${symbol} Empresa Simulada`,
            name: `${symbol} Company`,
            type: 'stock',
            description: `Empresa brasileira listada na B3 com símbolo ${symbol}`,
            sector: ['Tecnologia', 'Financeiro', 'Energia', 'Varejo'][Math.floor(Math.random() * 4)],
            market_cap: Math.floor(Math.random() * 10000000000),
            currency: 'BRL',
            logo: null, // Remover placeholder externo que não está acessível
            website: `https://www.${symbol.toLowerCase()}.com.br`,
            document: '00.000.000/0001-00'
          };

          const saveResult = await AssetSyncController.saveAsset(mockAssetData);
          if (saveResult.success) {
            successCount++;
            logger.info(`Simulated asset ${symbol} created successfully`);
          } else {
            errors.push({
              symbol,
              error: 'Failed to save to database',
              details: `Falha ao salvar o ativo ${symbol} no banco de dados. Erro: ${saveResult.error || 'Erro desconhecido'}. Verifique a conectividade e estrutura do banco.`,
              stackTrace: null,
              httpStatus: null,
              timestamp: new Date()
            });
          }
        } catch (error) {
          errors.push({
            symbol,
            error: error.message,
            details: `Erro na sincronização do ativo ${symbol}. ${error.cause ? 'Causa: ' + error.cause : ''}`,
            stackTrace: error.stack,
            httpStatus: error.response?.status || null,
            timestamp: new Date()
          });
        }

        // Delay reduzido para evitar timeout
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      logger.info(`Simulated asset sync completed: ${successCount} success, ${errors.length} errors`);

      res.json({
        success: true,
        data: {
          totalAssets: 10, // Só processamos 10 para simulação
          processedAssets: 10,
          successCount,
          errorCount: errors.length,
          errors,
          simulated: true
        }
      });

    } catch (error) {
      logger.error('Simulated asset sync failed:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Salvar ativo individual recebido do frontend
  static async saveIndividualAsset(req, res) {
    try {
      const { symbol, data } = req.body;

      if (!symbol || !data) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters',
          details: `Parâmetros obrigatórios ausentes: ${!symbol ? 'symbol' : ''} ${!data ? 'data' : ''}. Certifique-se de enviar tanto o símbolo do ativo quanto os dados da HG Brasil API.`,
          stackTrace: null,
          httpStatus: 400
        });
      }

      // Validar estrutura básica dos dados
      if (!data.symbol) {
        return res.status(400).json({
          success: false,
          error: 'Invalid asset data structure',
          details: 'Os dados do ativo devem conter pelo menos o campo "symbol". Verifique se os dados da HG Brasil API estão corretos.',
          stackTrace: null,
          httpStatus: 400
        });
      }

      logger.info(`Saving individual asset: ${symbol}`);

      // Usar o método existente saveAsset para salvar
      const saveResult = await AssetSyncController.saveAsset(data);

      if (saveResult.success) {
        logger.info(`Individual asset ${symbol} saved successfully`);
        res.json({
          success: true,
          data: {
            symbol: symbol,
            message: 'Asset saved successfully'
          }
        });
      } else {
        logger.error(`Failed to save individual asset: ${symbol}`, saveResult);
        
        // Construir mensagem de erro detalhada baseada no tipo de erro
        let errorDetails = `Falha ao salvar o ativo ${symbol} no banco de dados.`;
        
        if (saveResult.validation && saveResult.validation.length > 0) {
          errorDetails += ` Erros de validação nos campos: ${saveResult.validation.join(', ')}.`;
        }
        
        if (saveResult.code === 11000) {
          errorDetails += ' Ativo já existe no banco de dados.';
        } else if (saveResult.code === 'ECONNREFUSED') {
          errorDetails += ' Não foi possível conectar ao banco de dados MongoDB.';
        } else if (saveResult.error) {
          errorDetails += ` Erro: ${saveResult.error}`;
        }
        
        res.status(500).json({
          success: false,
          error: 'Failed to save asset to database',
          details: errorDetails,
          stackTrace: null,
          httpStatus: 500,
          mongoError: saveResult.code,
          validationErrors: saveResult.validation
        });
      }

    } catch (error) {
      logger.error('Error saving individual asset:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: 'Erro interno ao salvar ativo individual',
        stackTrace: error.stack,
        httpStatus: 500
      });
    }
  }
}

module.exports = AssetSyncController;