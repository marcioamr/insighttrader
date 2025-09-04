const axios = require('axios');
const logger = require('../config/logger');

class HGBrasilService {
  constructor() {
    this.baseURL = process.env.HG_BRASIL_BASE_URL;
    this.apiKey = process.env.HG_BRASIL_API_KEY;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  async getStockQuote(symbol) {
    try {
      const response = await this.client.get('/finance/stock_price', {
        params: {
          key: this.apiKey,
          symbol: symbol
        }
      });

      if (response.data.valid_key === false) {
        throw new Error('Invalid API key');
      }

      return response.data.results[symbol];
    } catch (error) {
      logger.error(`Error fetching stock quote for ${symbol}:`, error.message);
      throw error;
    }
  }

  async getCurrencyQuote(currency = 'USD') {
    try {
      const response = await this.client.get('/finance/quotations', {
        params: {
          key: this.apiKey,
          format: 'json'
        }
      });

      if (response.data.valid_key === false) {
        throw new Error('Invalid API key');
      }

      return response.data.results.currencies[currency];
    } catch (error) {
      logger.error(`Error fetching currency quote for ${currency}:`, error.message);
      throw error;
    }
  }

  async getMultipleStocks(symbols) {
    try {
      const symbolsString = symbols.join(',');
      const response = await this.client.get('/finance/stock_price', {
        params: {
          key: this.apiKey,
          symbol: symbolsString
        }
      });

      if (response.data.valid_key === false) {
        throw new Error('Invalid API key');
      }

      return response.data.results;
    } catch (error) {
      logger.error(`Error fetching multiple stocks:`, error.message);
      throw error;
    }
  }

  async validateConnection() {
    try {
      await this.getStockQuote('PETR4');
      return true;
    } catch (error) {
      logger.error('HG Brasil API connection validation failed:', error.message);
      return false;
    }
  }
}

module.exports = new HGBrasilService();