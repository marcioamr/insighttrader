const mongoose = require('mongoose');
const AnalysisTechnique = require('../models/AnalysisTechnique');
const logger = require('../config/logger');
require('dotenv').config();

// Técnicas exemplo com contexto completo
const sampleTechniques = [
  {
    title: 'RSI - Relative Strength Index',
    description: 'Indicador de momentum que mede a velocidade e magnitude das mudanças de preços. Identifica condições de sobrecompra e sobrevenda.',
    category: 'momentum',
    periodicity: 'daily',
    timeframe: '1d',
    parameters: {
      period: 14,
      signal_threshold: 70,
      stop_loss: 3,
      take_profit: 6
    },
    signal_conditions: {
      buy_condition: 'RSI abaixo de 30 indicando condição de sobrevenda',
      sell_condition: 'RSI acima de 70 indicando condição de sobrecompra',
      neutral_condition: 'RSI entre 30 e 70 em zona neutra'
    },
    risk_level: 'medium',
    min_volume: 1000000,
    market_cap_filter: 'any'
  },
  {
    title: 'MACD - Moving Average Convergence Divergence',
    description: 'Oscilador de momentum que mostra a relação entre duas médias móveis. Identifica mudanças de tendência.',
    category: 'trend',
    periodicity: 'daily',
    timeframe: '1d',
    parameters: {
      period: 26,
      signal_threshold: 0,
      stop_loss: 2.5,
      take_profit: 5
    },
    signal_conditions: {
      buy_condition: 'Linha MACD cruza acima da linha de sinal',
      sell_condition: 'Linha MACD cruza abaixo da linha de sinal',
      neutral_condition: 'MACD próximo da linha zero sem divergência clara'
    },
    risk_level: 'medium',
    min_volume: 2000000,
    market_cap_filter: 'medium'
  },
  {
    title: 'Bollinger Bands',
    description: 'Bandas de volatilidade que se expandem e contraem baseadas na volatilidade do mercado. Útil para identificar breakouts.',
    category: 'volatility',
    periodicity: 'daily',
    timeframe: '1d',
    parameters: {
      period: 20,
      signal_threshold: 2,
      stop_loss: 2,
      take_profit: 4
    },
    signal_conditions: {
      buy_condition: 'Preço toca a banda inferior e reverte para cima',
      sell_condition: 'Preço toca a banda superior e reverte para baixo',
      neutral_condition: 'Preço oscila dentro das bandas sem tocar extremos'
    },
    risk_level: 'low',
    min_volume: 1500000,
    market_cap_filter: 'any'
  },
  {
    title: 'Volume Weighted Average Price (VWAP)',
    description: 'Preço médio ponderado pelo volume. Mostra o preço médio real baseado no volume negociado.',
    category: 'volume',
    periodicity: 'hourly',
    timeframe: '1h',
    parameters: {
      period: 1,
      signal_threshold: 0,
      stop_loss: 1.5,
      take_profit: 3
    },
    signal_conditions: {
      buy_condition: 'Preço acima do VWAP com volume crescente',
      sell_condition: 'Preço abaixo do VWAP com volume crescente',
      neutral_condition: 'Preço oscilando próximo ao VWAP'
    },
    risk_level: 'low',
    min_volume: 5000000,
    market_cap_filter: 'large'
  },
  {
    title: 'Support and Resistance Levels',
    description: 'Níveis horizontais de preço onde há maior probabilidade de reversão ou continuação de tendência.',
    category: 'support_resistance',
    periodicity: 'daily',
    timeframe: '1d',
    parameters: {
      period: 50,
      signal_threshold: 1,
      stop_loss: 2,
      take_profit: 6
    },
    signal_conditions: {
      buy_condition: 'Preço rompe resistência com volume alto',
      sell_condition: 'Preço rompe suporte com volume alto',
      neutral_condition: 'Preço oscila entre suporte e resistência'
    },
    risk_level: 'medium',
    min_volume: 3000000,
    market_cap_filter: 'any'
  },
  {
    title: 'Double Top/Bottom Pattern',
    description: 'Padrão de reversão que forma dois picos (topo duplo) ou dois vales (fundo duplo) em níveis similares.',
    category: 'patterns',
    periodicity: 'weekly',
    timeframe: '1w',
    parameters: {
      period: 12,
      signal_threshold: 5,
      stop_loss: 4,
      take_profit: 8
    },
    signal_conditions: {
      buy_condition: 'Confirmação de fundo duplo com rompimento da linha de pescoço',
      sell_condition: 'Confirmação de topo duplo com rompimento da linha de pescoço',
      neutral_condition: 'Padrão em formação aguardando confirmação'
    },
    risk_level: 'high',
    min_volume: 2000000,
    market_cap_filter: 'medium'
  }
];

// Função para mapear técnicas existentes para categorias apropriadas
const mapTechniqueToCategory = (title, description) => {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  if (titleLower.includes('rsi') || titleLower.includes('stochastic') || descLower.includes('momentum')) {
    return 'momentum';
  }
  if (titleLower.includes('macd') || titleLower.includes('moving average') || descLower.includes('trend')) {
    return 'trend';
  }
  if (titleLower.includes('bollinger') || titleLower.includes('volatility') || descLower.includes('volatilidade')) {
    return 'volatility';
  }
  if (titleLower.includes('volume') || titleLower.includes('vwap')) {
    return 'volume';
  }
  if (titleLower.includes('support') || titleLower.includes('resistance') || titleLower.includes('suporte')) {
    return 'support_resistance';
  }
  if (titleLower.includes('pattern') || titleLower.includes('double') || titleLower.includes('triangle')) {
    return 'patterns';
  }
  
  return 'trend'; // default
};

// Função para determinar nível de risco baseado na técnica
const getRiskLevel = (category, title) => {
  const titleLower = title.toLowerCase();
  
  if (category === 'patterns' || titleLower.includes('breakout') || titleLower.includes('gap')) {
    return 'high';
  }
  if (category === 'volume' || category === 'volatility') {
    return 'low';
  }
  
  return 'medium'; // default
};

// Função para gerar parâmetros baseados na categoria
const generateParameters = (category) => {
  const parameterMap = {
    momentum: { period: 14, signal_threshold: 70, stop_loss: 3, take_profit: 6 },
    trend: { period: 26, signal_threshold: 0, stop_loss: 2.5, take_profit: 5 },
    volatility: { period: 20, signal_threshold: 2, stop_loss: 2, take_profit: 4 },
    volume: { period: 1, signal_threshold: 0, stop_loss: 1.5, take_profit: 3 },
    support_resistance: { period: 50, signal_threshold: 1, stop_loss: 2, take_profit: 6 },
    patterns: { period: 12, signal_threshold: 5, stop_loss: 4, take_profit: 8 }
  };
  
  return parameterMap[category] || parameterMap.trend;
};

// Função para gerar condições de sinal baseadas na categoria
const generateSignalConditions = (category, title) => {
  const conditionMap = {
    momentum: {
      buy_condition: 'Indicador de momentum indica condição de sobrevenda',
      sell_condition: 'Indicador de momentum indica condição de sobrecompra',
      neutral_condition: 'Momentum em zona neutra sem sinais claros'
    },
    trend: {
      buy_condition: 'Indicador de tendência confirma movimento de alta',
      sell_condition: 'Indicador de tendência confirma movimento de baixa',
      neutral_condition: 'Tendência lateral sem direção definida'
    },
    volatility: {
      buy_condition: 'Baixa volatilidade seguida de expansão para cima',
      sell_condition: 'Baixa volatilidade seguida de expansão para baixo',
      neutral_condition: 'Volatilidade normal sem sinais extremos'
    },
    volume: {
      buy_condition: 'Volume crescente confirmando movimento de alta',
      sell_condition: 'Volume crescente confirmando movimento de baixa',
      neutral_condition: 'Volume normal sem confirmação direcional'
    },
    support_resistance: {
      buy_condition: 'Rompimento de resistência com volume',
      sell_condition: 'Rompimento de suporte com volume',
      neutral_condition: 'Preço oscilando entre níveis de suporte e resistência'
    },
    patterns: {
      buy_condition: 'Padrão de alta confirmado com rompimento',
      sell_condition: 'Padrão de baixa confirmado com rompimento',
      neutral_condition: 'Padrão em formação aguardando confirmação'
    }
  };
  
  return conditionMap[category] || conditionMap.trend;
};

async function migrateTechniques() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/insighttrader');
    logger.info('Connected to MongoDB for migration');

    // Buscar técnicas existentes
    const existingTechniques = await AnalysisTechnique.find({});
    logger.info(`Found ${existingTechniques.length} existing techniques`);

    // Se não há técnicas, criar as técnicas exemplo
    if (existingTechniques.length === 0) {
      logger.info('No existing techniques found. Creating sample techniques...');
      
      for (const technique of sampleTechniques) {
        const newTechnique = new AnalysisTechnique(technique);
        await newTechnique.save();
        logger.info(`Created sample technique: ${technique.title}`);
      }
      
      logger.info(`Created ${sampleTechniques.length} sample techniques`);
    } else {
      // Atualizar técnicas existentes com novos campos
      logger.info('Updating existing techniques with new fields...');
      
      for (const technique of existingTechniques) {
        const category = mapTechniqueToCategory(technique.title, technique.description);
        const risk_level = getRiskLevel(category, technique.title);
        const parameters = generateParameters(category);
        const signal_conditions = generateSignalConditions(category, technique.title);
        
        const updateData = {
          category,
          timeframe: technique.timeframe || '1d',
          parameters,
          signal_conditions,
          risk_level,
          min_volume: 1000000,
          market_cap_filter: 'any'
        };

        await AnalysisTechnique.findByIdAndUpdate(technique._id, updateData);
        logger.info(`Updated technique: ${technique.title} (category: ${category}, risk: ${risk_level})`);
      }
      
      logger.info(`Updated ${existingTechniques.length} existing techniques`);
    }

    // Verificar o resultado final
    const finalCount = await AnalysisTechnique.countDocuments({});
    logger.info(`Migration completed. Total techniques: ${finalCount}`);

  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateTechniques()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateTechniques };