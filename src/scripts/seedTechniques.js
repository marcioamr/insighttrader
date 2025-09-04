const mongoose = require('mongoose');
const AnalysisTechnique = require('../models/AnalysisTechnique');
const logger = require('../config/logger');
require('dotenv').config();

const techniques = [
  {
    title: 'RSI',
    description: 'Relative Strength Index - Oscilador de momentum que mede a velocidade e magnitude das mudanças de preço. Valores acima de 70 indicam sobrecompra, abaixo de 30 indicam sobrevenda.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'MACD',
    description: 'Moving Average Convergence Divergence - Indicador que mostra a relação entre duas médias móveis. Utilizado para identificar tendências e pontos de entrada/saída.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Média Móvel 20',
    description: 'Média Móvel Simples de 20 períodos. Quando o preço está acima, indica tendência de alta; quando abaixo, tendência de baixa.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Média Móvel 50',
    description: 'Média Móvel Simples de 50 períodos. Utilizada para identificar tendências de médio prazo e suporte/resistência dinâmicos.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Bollinger Bands',
    description: 'Bandas de Bollinger - Consiste em uma média móvel e duas bandas baseadas no desvio padrão. Útil para identificar volatilidade e possíveis reversões.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Estocástico',
    description: 'Oscilador estocástico que compara o preço de fechamento com sua faixa de preços ao longo de um período. Valores acima de 80 indicam sobrecompra.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Williams %R',
    description: 'Oscilador de momentum que mede níveis de sobrecompra e sobrevenda. Funciona de forma inversa ao estocástico.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'IFR Intraday',
    description: 'Índice de Força Relativa aplicado em timeframes menores para análises de curto prazo e operações day trade.',
    periodicity: 'hourly',
    isActive: true
  },
  {
    title: 'Volume Profile',
    description: 'Análise do volume negociado em diferentes levels de preço. Identifica áreas de maior interesse e possíveis suportes/resistências.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Fibonacci',
    description: 'Retrações e extensões de Fibonacci para identificar níveis de suporte, resistência e possíveis pontos de reversão.',
    periodicity: 'weekly',
    isActive: true
  },
  {
    title: 'Análise de Candlesticks',
    description: 'Padrões de candlesticks japoneses como Doji, Martelo, Shooting Star para identificar possíveis reversões de tendência.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'ADX',
    description: 'Average Directional Index - Mede a força da tendência independente da direção. Valores acima de 25 indicam tendência forte.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Momentum Semanal',
    description: 'Análise de momentum em timeframe semanal para identificar tendências de longo prazo e pontos de entrada estratégicos.',
    periodicity: 'weekly',
    isActive: true
  },
  {
    title: 'Price Action',
    description: 'Análise baseada na ação do preço, suportes, resistências, padrões gráficos e estrutura de mercado.',
    periodicity: 'daily',
    isActive: true
  },
  {
    title: 'Análise Mensal',
    description: 'Análise técnica de longo prazo em timeframe mensal para investimentos de posição e identificação de grandes tendências.',
    periodicity: 'monthly',
    isActive: true
  }
];

const seedTechniques = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for technique seeding');

    // Limpar técnicas existentes (opcional)
    const choice = process.argv[2];
    if (choice === '--clear') {
      await AnalysisTechnique.deleteMany({});
      logger.info('Cleared existing techniques');
    }

    // Inserir técnicas, ignorando duplicatas
    let inserted = 0;
    let skipped = 0;

    for (const techniqueData of techniques) {
      try {
        const existingTechnique = await AnalysisTechnique.findOne({ 
          title: techniqueData.title 
        });

        if (existingTechnique) {
          logger.info(`Technique ${techniqueData.title} already exists, skipping`);
          skipped++;
          continue;
        }

        const technique = new AnalysisTechnique(techniqueData);
        await technique.save();
        logger.info(`Created technique: ${technique.title}`);
        inserted++;
      } catch (error) {
        logger.error(`Error creating technique ${techniqueData.title}:`, error.message);
      }
    }

    logger.info(`Technique seeding completed: ${inserted} inserted, ${skipped} skipped`);
    logger.info('Total techniques in database:', await AnalysisTechnique.countDocuments());

  } catch (error) {
    logger.error('Error seeding techniques:', error.message);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Executar o script
if (require.main === module) {
  seedTechniques();
}

module.exports = seedTechniques;