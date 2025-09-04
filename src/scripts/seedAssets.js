const mongoose = require('mongoose');
const Asset = require('../models/Asset');
const logger = require('../config/logger');
require('dotenv').config();

const b3Assets = [
  // Ações Blue Chips
  { symbol: 'PETR4', name: 'Petrobras PN', type: 'stock', market: 'B3' },
  { symbol: 'VALE3', name: 'Vale ON', type: 'stock', market: 'B3' },
  { symbol: 'ITUB4', name: 'Itaú Unibanco PN', type: 'stock', market: 'B3' },
  { symbol: 'BBDC4', name: 'Bradesco PN', type: 'stock', market: 'B3' },
  { symbol: 'ABEV3', name: 'Ambev ON', type: 'stock', market: 'B3' },
  { symbol: 'WEGE3', name: 'WEG ON', type: 'stock', market: 'B3' },
  { symbol: 'MGLU3', name: 'Magazine Luiza ON', type: 'stock', market: 'B3' },
  { symbol: 'ITSA4', name: 'Itaúsa PN', type: 'stock', market: 'B3' },
  { symbol: 'BBAS3', name: 'Banco do Brasil ON', type: 'stock', market: 'B3' },
  { symbol: 'JBSS3', name: 'JBS ON', type: 'stock', market: 'B3' },
  
  // Setor de Varejo
  { symbol: 'LREN3', name: 'Lojas Renner ON', type: 'stock', market: 'B3' },
  { symbol: 'VVAR3', name: 'Via ON', type: 'stock', market: 'B3' },
  { symbol: 'AMER3', name: 'Americanas ON', type: 'stock', market: 'B3' },
  { symbol: 'PCAR3', name: 'P.Açúcar-CBD ON', type: 'stock', market: 'B3' },
  { symbol: 'CRFB3', name: 'Carrefour Brasil ON', type: 'stock', market: 'B3' },
  
  // Setor de Tecnologia
  { symbol: 'TOTS3', name: 'Totvs ON', type: 'stock', market: 'B3' },
  { symbol: 'LWSA3', name: 'Locaweb ON', type: 'stock', market: 'B3' },
  { symbol: 'POSI3', name: 'Positivo ON', type: 'stock', market: 'B3' },
  
  // Setor de Energia
  { symbol: 'EGIE3', name: 'Engie Brasil ON', type: 'stock', market: 'B3' },
  { symbol: 'CPFE3', name: 'CPFL Energia ON', type: 'stock', market: 'B3' },
  { symbol: 'EQTL3', name: 'Equatorial ON', type: 'stock', market: 'B3' },
  { symbol: 'ENBR3', name: 'EDP Brasil ON', type: 'stock', market: 'B3' },
  
  // Setor de Construção
  { symbol: 'MRVE3', name: 'MRV ON', type: 'stock', market: 'B3' },
  { symbol: 'CYRE3', name: 'Cyrela ON', type: 'stock', market: 'B3' },
  { symbol: 'EZTC3', name: 'Eztec ON', type: 'stock', market: 'B3' },
  
  // Setor de Siderurgia
  { symbol: 'USIM5', name: 'Usiminas PNA', type: 'stock', market: 'B3' },
  { symbol: 'CSNA3', name: 'CSN ON', type: 'stock', market: 'B3' },
  { symbol: 'GGBR4', name: 'Gerdau PN', type: 'stock', market: 'B3' },
  
  // Setor de Papel e Celulose
  { symbol: 'SUZB3', name: 'Suzano ON', type: 'stock', market: 'B3' },
  { symbol: 'KLBN11', name: 'Klabin Unit', type: 'stock', market: 'B3' },
  
  // Setor de Telecomunicações
  { symbol: 'VIVT3', name: 'Vivo ON', type: 'stock', market: 'B3' },
  { symbol: 'TIMS3', name: 'Tim ON', type: 'stock', market: 'B3' },
  
  // Setor de Alimentação
  { symbol: 'BEEF3', name: 'Minerva ON', type: 'stock', market: 'B3' },
  { symbol: 'BRFS3', name: 'BRF ON', type: 'stock', market: 'B3' },
  { symbol: 'SMTO3', name: 'São Martinho ON', type: 'stock', market: 'B3' },
  
  // Setor de Saúde
  { symbol: 'RDOR3', name: 'Rede D\'Or ON', type: 'stock', market: 'B3' },
  { symbol: 'HAPV3', name: 'Hapvida ON', type: 'stock', market: 'B3' },
  { symbol: 'QUAL3', name: 'Qualicorp ON', type: 'stock', market: 'B3' },
  
  // ETFs e Índices
  { symbol: 'BOVA11', name: 'iShares Ibovespa', type: 'index', market: 'B3' },
  { symbol: 'SMAL11', name: 'iShares Small Cap', type: 'index', market: 'B3' },
  { symbol: 'IVVB11', name: 'iShares S&P 500', type: 'index', market: 'B3' },
  
  // Mini Contratos Futuros
  { symbol: 'WDOM25', name: 'Mini Dólar Mar/25', type: 'currency', market: 'B3' },
  { symbol: 'WINM25', name: 'Mini Ibovespa Mar/25', type: 'index', market: 'B3' },
  
  // FIIs Populares
  { symbol: 'HGLG11', name: 'CSHG Logística', type: 'index', market: 'B3' },
  { symbol: 'VISC11', name: 'Vinci Shopping Centers', type: 'index', market: 'B3' },
  { symbol: 'XPLG11', name: 'XP Log', type: 'index', market: 'B3' },
  { symbol: 'KNRI11', name: 'Kinea Renda Imobiliária', type: 'index', market: 'B3' },
  { symbol: 'BCFF11', name: 'BC Ffii', type: 'index', market: 'B3' },
];

const seedAssets = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for asset seeding');

    // Limpar ativos existentes da B3 (opcional)
    const choice = process.argv[2];
    if (choice === '--clear') {
      await Asset.deleteMany({ market: 'B3' });
      logger.info('Cleared existing B3 assets');
    }

    // Inserir ativos, ignorando duplicatas
    let inserted = 0;
    let skipped = 0;

    for (const assetData of b3Assets) {
      try {
        const existingAsset = await Asset.findOne({ 
          symbol: assetData.symbol 
        });

        if (existingAsset) {
          logger.info(`Asset ${assetData.symbol} already exists, skipping`);
          skipped++;
          continue;
        }

        const asset = new Asset(assetData);
        await asset.save();
        logger.info(`Created asset: ${asset.symbol} - ${asset.name}`);
        inserted++;
      } catch (error) {
        if (error.code === 11000) {
          logger.info(`Asset ${assetData.symbol} already exists (duplicate key), skipping`);
          skipped++;
        } else {
          logger.error(`Error creating asset ${assetData.symbol}:`, error.message);
        }
      }
    }

    logger.info(`Asset seeding completed: ${inserted} inserted, ${skipped} skipped`);
    logger.info('Total assets in database:', await Asset.countDocuments());

  } catch (error) {
    logger.error('Error seeding assets:', error.message);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Executar o script
if (require.main === module) {
  seedAssets();
}

module.exports = seedAssets;