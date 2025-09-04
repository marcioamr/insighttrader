const express = require('express');
const router = express.Router();
const assetTechniqueController = require('../controllers/assetTechniqueController');

router.post('/', assetTechniqueController.create);
router.get('/', assetTechniqueController.getAll);
router.get('/:id', assetTechniqueController.getById);
router.put('/:id', assetTechniqueController.update);
router.delete('/:id', assetTechniqueController.delete);
router.get('/asset/:assetId', assetTechniqueController.getByAsset);
router.get('/technique/:techniqueId', assetTechniqueController.getByTechnique);

module.exports = router;