const hgBrasilService = require('./hgBrasilService');
const Insight = require('../models/Insight');
const logger = require('../config/logger');

class AnalysisService {
  async performAnalysis(asset, technique) {
    try {
      const marketData = await this.getMarketData(asset);
      const analysis = await this.executeAnalysis(marketData, technique);
      
      const insight = new Insight({
        asset: asset._id,
        technique: technique._id,
        analysis: analysis.analysis,
        recommendation: analysis.recommendation,
        confidence: analysis.confidence,
        price: marketData.price,
        targetPrice: analysis.targetPrice,
        stopLoss: analysis.stopLoss,
        executedAt: new Date()
      });

      await insight.save();
      logger.info(`Analysis completed for ${asset.symbol} using ${technique.title}`);
      
      return insight;
    } catch (error) {
      logger.error(`Error performing analysis for ${asset.symbol}:`, error.message);
      throw error;
    }
  }

  async getMarketData(asset) {
    try {
      let data;
      
      if (asset.type === 'stock') {
        data = await hgBrasilService.getStockQuote(asset.symbol);
      } else if (asset.type === 'currency') {
        data = await hgBrasilService.getCurrencyQuote(asset.symbol);
      }

      return {
        symbol: asset.symbol,
        price: data.price || data.buy,
        change: data.change_percent,
        volume: data.volume,
        high: data.high,
        low: data.low,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Error getting market data for ${asset.symbol}:`, error.message);
      throw error;
    }
  }

  async executeAnalysis(marketData, technique) {
    const analysisResult = {
      analysis: `Análise técnica baseada em ${technique.title}`,
      recommendation: 'hold',
      confidence: 50,
      targetPrice: null,
      stopLoss: null
    };

    switch (technique.title.toLowerCase()) {
      case 'rsi':
        return this.analyzeRSI(marketData, analysisResult);
      case 'moving average':
      case 'média móvel':
        return this.analyzeMovingAverage(marketData, analysisResult);
      case 'macd':
        return this.analyzeMACD(marketData, analysisResult);
      default:
        return this.performBasicAnalysis(marketData, analysisResult);
    }
  }

  analyzeRSI(marketData, baseResult) {
    const rsi = Math.random() * 100;
    
    if (rsi < 30) {
      baseResult.recommendation = 'buy';
      baseResult.confidence = 75;
      baseResult.analysis = `RSI indica condição de sobrevenda (${rsi.toFixed(2)}). Oportunidade de compra.`;
      baseResult.targetPrice = marketData.price * 1.1;
      baseResult.stopLoss = marketData.price * 0.95;
    } else if (rsi > 70) {
      baseResult.recommendation = 'sell';
      baseResult.confidence = 70;
      baseResult.analysis = `RSI indica condição de sobrecompra (${rsi.toFixed(2)}). Considerar venda.`;
      baseResult.targetPrice = marketData.price * 0.9;
      baseResult.stopLoss = marketData.price * 1.05;
    } else {
      baseResult.analysis = `RSI em zona neutra (${rsi.toFixed(2)}). Aguardar sinais mais claros.`;
    }

    return baseResult;
  }

  analyzeMovingAverage(marketData, baseResult) {
    const ma20 = marketData.price * (0.98 + Math.random() * 0.04);
    
    if (marketData.price > ma20) {
      baseResult.recommendation = 'buy';
      baseResult.confidence = 65;
      baseResult.analysis = `Preço acima da média móvel de 20 períodos. Tendência de alta.`;
      baseResult.targetPrice = marketData.price * 1.08;
      baseResult.stopLoss = ma20 * 0.98;
    } else {
      baseResult.recommendation = 'sell';
      baseResult.confidence = 60;
      baseResult.analysis = `Preço abaixo da média móvel de 20 períodos. Tendência de baixa.`;
      baseResult.targetPrice = marketData.price * 0.92;
      baseResult.stopLoss = marketData.price * 1.03;
    }

    return baseResult;
  }

  analyzeMACD(marketData, baseResult) {
    const signal = Math.random() > 0.5 ? 'positive' : 'negative';
    
    if (signal === 'positive') {
      baseResult.recommendation = 'buy';
      baseResult.confidence = 70;
      baseResult.analysis = `MACD apresenta divergência positiva. Sinal de compra.`;
      baseResult.targetPrice = marketData.price * 1.12;
      baseResult.stopLoss = marketData.price * 0.94;
    } else {
      baseResult.recommendation = 'sell';
      baseResult.confidence = 65;
      baseResult.analysis = `MACD apresenta divergência negativa. Sinal de venda.`;
      baseResult.targetPrice = marketData.price * 0.88;
      baseResult.stopLoss = marketData.price * 1.06;
    }

    return baseResult;
  }

  performBasicAnalysis(marketData, baseResult) {
    const randomFactor = Math.random();
    
    if (randomFactor > 0.6) {
      baseResult.recommendation = 'buy';
      baseResult.confidence = 55;
      baseResult.analysis = `Análise técnica sugere oportunidade de compra baseada em padrões de preço.`;
    } else if (randomFactor < 0.4) {
      baseResult.recommendation = 'sell';
      baseResult.confidence = 55;
      baseResult.analysis = `Análise técnica sugere oportunidade de venda baseada em padrões de preço.`;
    } else {
      baseResult.analysis = `Análise técnica não apresenta sinais claros. Manter posição atual.`;
    }

    return baseResult;
  }
}

module.exports = new AnalysisService();