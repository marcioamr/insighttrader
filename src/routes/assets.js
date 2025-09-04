const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.post('/', assetController.create);
router.get('/', assetController.getAll);
router.get('/:id', assetController.getById);
router.put('/:id', assetController.update);
router.delete('/:id', assetController.delete);

module.exports = router;