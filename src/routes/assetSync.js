const express = require('express');
const AssetSyncController = require('../controllers/assetSyncController');
const router = express.Router();

// TODO: Add authentication middleware when available

// Iniciar sincronização completa de ativos
router.post('/sync', AssetSyncController.startSync);

// Buscar informações sobre um símbolo específico
router.get('/asset/:symbol', AssetSyncController.getAssetInfo);

// Listar símbolos disponíveis para sincronização
router.get('/symbols', AssetSyncController.getAvailableSymbols);

// Sincronização simulada (para quando não há API premium)
router.post('/simulate', AssetSyncController.simulateSync);

// Salvar ativo individual
router.post('/save-asset', AssetSyncController.saveIndividualAsset);

module.exports = router;