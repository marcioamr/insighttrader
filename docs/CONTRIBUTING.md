# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o InsightTrader! Este documento fornece diretrizes para contribuir com o projeto.

## Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/insighttrader.git
cd insighttrader

# Adicione o repositório original como upstream
git remote add upstream https://github.com/marcioamr/insighttrader.git
```

### 2. Crie uma Branch

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch
git checkout -b feature/minha-funcionalidade
```

### 3. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga os padrões de código do projeto
- Adicione testes quando apropriado
- Atualize a documentação se necessário

### 4. Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos de commit
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Documentação
style:    Formatação (não afeta o código)
refactor: Refatoração
test:     Testes
chore:    Manutenção

# Exemplos
git commit -m "feat: adiciona análise de Fibonacci"
git commit -m "fix: corrige cálculo do RSI"
git commit -m "docs: atualiza README com novos endpoints"
```

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/minha-funcionalidade

# Abra um Pull Request no GitHub
```

## Padrões de Código

### JavaScript/TypeScript

- Use ES6+ features
- Prefira `const` e `let` ao invés de `var`
- Use arrow functions quando apropriado
- Mantenha funções pequenas e focadas
- Comente código complexo

### Nomenclatura

```javascript
// Classes: PascalCase
class AnalysisService {}

// Funções e variáveis: camelCase
const calculateRSI = () => {}
const assetPrice = 100

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES = 3

// Arquivos: kebab-case
analysis-service.js
asset-controller.js
```

### Estrutura de Arquivos

```javascript
// Imports
const express = require('express');
const logger = require('./config/logger');

// Constantes
const PORT = 3000;

// Funções
const startServer = () => {
  // ...
};

// Exports
module.exports = { startServer };
```

## Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- analysis.test.js

# Com coverage
npm test -- --coverage
```

### Escrever Testes

```javascript
describe('AnalysisService', () => {
  describe('calculateRSI', () => {
    it('should return RSI between 0 and 100', async () => {
      const result = await analysisService.calculateRSI(prices);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });
});
```

## Documentação

- Documente funções públicas
- Atualize o README se adicionar funcionalidades
- Adicione exemplos quando apropriado
- Mantenha a documentação da API atualizada

## Code Review

Seu Pull Request será revisado considerando:

- ✅ Código limpo e legível
- ✅ Testes passando
- ✅ Documentação atualizada
- ✅ Sem conflitos com main
- ✅ Segue os padrões do projeto

## Reportar Bugs

Use o [GitHub Issues](https://github.com/marcioamr/insighttrader/issues) para reportar bugs:

1. Descreva o bug claramente
2. Passos para reproduzir
3. Comportamento esperado vs atual
4. Screenshots se aplicável
5. Ambiente (OS, Node version, etc)

## Sugerir Funcionalidades

Para sugerir novas funcionalidades:

1. Verifique se já não existe uma issue similar
2. Descreva a funcionalidade detalhadamente
3. Explique o caso de uso
4. Adicione mockups se possível

## Dúvidas?

- 📧 Email: suporte@insighttrader.com
- 💬 Discussions: GitHub Discussions
- 🐛 Issues: GitHub Issues

Obrigado por contribuir! 🚀
