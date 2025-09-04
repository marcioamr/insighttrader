const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Servir imagens de ativos
router.get('/assets/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '../../public/images/assets', filename);
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      success: false,
      error: 'Image not found'
    });
  }

  // Verificar extensão do arquivo
  const ext = path.extname(filename).toLowerCase();
  const allowedExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  
  if (!allowedExts.includes(ext)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type'
    });
  }

  // Definir content-type baseado na extensão
  const contentTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };

  res.setHeader('Content-Type', contentTypes[ext] || 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache por 1 dia
  
  // Enviar o arquivo
  res.sendFile(imagePath);
});

module.exports = router;