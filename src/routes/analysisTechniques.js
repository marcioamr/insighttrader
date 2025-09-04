const express = require('express');
const router = express.Router();
const analysisTechniqueController = require('../controllers/analysisTechniqueController');

router.post('/', analysisTechniqueController.create);
router.get('/', analysisTechniqueController.getAll);
router.get('/:id', analysisTechniqueController.getById);
router.put('/:id', analysisTechniqueController.update);
router.delete('/:id', analysisTechniqueController.delete);
router.patch('/:id/activate', analysisTechniqueController.activate);
router.patch('/:id/deactivate', analysisTechniqueController.deactivate);

module.exports = router;