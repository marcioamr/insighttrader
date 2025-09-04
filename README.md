# 📈 InsightTrader

Sistema escalável em Node.js para análises técnicas de ativos financeiros (ações B3, mini dólar etc.).

## 🚀 Funcionalidades

- **Cadastro de Técnicas de Análise**: CRUD completo com título, descrição, periodicidade e status
- **Gestão de Ativos**: Cadastro de ações, moedas, commodities e índices
- **Associação de Técnicas a Ativos**: Vinculação flexível entre ativos e análises
- **Grid de Sugestões de Posição**: Interface para visualizar recomendações de investimento
- **Análises Automáticas**: Jobs programados (cron) para execução periódica
- **Integração HG Brasil**: API de dados financeiros em tempo real
- **Interface Administrativa**: Dashboard moderno com ShadCN/Tailwind

## 🛠️ Tecnologias

### Backend
- **Node.js** + Express
- **MongoDB** com Mongoose
- **Docker** + Docker Compose
- **Node-cron** para automação
- **Winston** para logs
- **Joi** para validação

### Frontend
- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN/UI**
- **Radix UI**

## 📦 Instalação

### Usando Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <repository-url>
cd insighttrader
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

3. Execute com Docker Compose:
```bash
docker-compose up -d
```

### Instalação Manual

1. Instale as dependências do backend:
```bash
npm install
```

2. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

3. Configure MongoDB local ou use uma instância em nuvem

4. Execute o backend:
```bash
npm run dev
```

5. Execute o frontend (em outro terminal):
```bash
cd frontend
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/insighttrader

# Server
PORT=3000
NODE_ENV=development

# HG Brasil API
HG_BRASIL_API_KEY=sua_chave_aqui
HG_BRASIL_BASE_URL=https://api.hgbrasil.com

# JWT
JWT_SECRET=seu-jwt-secret
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

### API HG Brasil

1. Registre-se em [HG Brasil Finance](https://console.hgbrasil.com/)
2. Obtenha sua chave da API
3. Configure no arquivo `.env`

## 📚 API Endpoints

### Técnicas de Análise
- `GET /api/analysis-techniques` - Listar técnicas
- `POST /api/analysis-techniques` - Criar técnica
- `PUT /api/analysis-techniques/:id` - Atualizar técnica
- `DELETE /api/analysis-techniques/:id` - Deletar técnica
- `PATCH /api/analysis-techniques/:id/activate` - Ativar técnica
- `PATCH /api/analysis-techniques/:id/deactivate` - Desativar técnica

### Ativos
- `GET /api/assets` - Listar ativos
- `POST /api/assets` - Criar ativo
- `PUT /api/assets/:id` - Atualizar ativo
- `DELETE /api/assets/:id` - Deletar ativo

### Associações Ativo-Técnica
- `GET /api/asset-techniques` - Listar associações
- `POST /api/asset-techniques` - Criar associação
- `DELETE /api/asset-techniques/:id` - Deletar associação

### Insights
- `GET /api/insights` - Listar insights
- `GET /api/insights/suggestions` - Sugestões de posição
- `GET /api/insights/dashboard` - Estatísticas do dashboard
- `PATCH /api/insights/:id/hide` - Ocultar insight
- `PATCH /api/insights/:id/show` - Mostrar insight

### Análises
- `POST /api/analysis/manual` - Executar análise manual
- `POST /api/analysis/run/:periodicity` - Executar análises por periodicidade
- `GET /api/analysis/jobs/status` - Status dos jobs
- `POST /api/analysis/jobs/start` - Iniciar jobs
- `POST /api/analysis/jobs/stop` - Parar jobs

## 🔄 Jobs Automáticos

O sistema executa análises automaticamente baseado na periodicidade configurada:

- **Hourly**: A cada hora
- **Daily**: Dias úteis às 9:00
- **Weekly**: Segundas-feiras às 9:00  
- **Monthly**: Dia 1º de cada mês às 9:00

## 🎯 Funcionalidades da Interface

### Dashboard
- Estatísticas gerais dos insights
- Sugestões de posição em tempo real
- Insights recentes
- Controles para ocultar/mostrar sugestões

### Sugestões de Posição
- **Investir**: Recomendações de compra
- **Sair da posição**: Recomendações de venda
- **Ocultar sugestão**: Remover da visualização

## 🧪 Análises Técnicas Implementadas

O sistema inclui implementações básicas de:

- **RSI (Relative Strength Index)**
- **Média Móvel**
- **MACD**
- **Análise Genérica** para outras técnicas

## 📊 Estrutura do Banco de Dados

### Collections
- `analysistechniques` - Técnicas de análise
- `assets` - Ativos financeiros
- `assettechniques` - Associações ativo-técnica
- `insights` - Resultados das análises

## 🐛 Logs e Monitoramento

- Logs estruturados com Winston
- Arquivos de log separados por nível
- Rastreamento de erros e operações
- Logs de acesso HTTP

## 🚀 Deploy

### Produção com Docker

1. Configure as variáveis de ambiente para produção
2. Execute:
```bash
docker-compose -f docker-compose.yml up -d
```

### Variáveis de Produção

```bash
NODE_ENV=production
MONGODB_URI=sua_string_de_conexao_mongodb
HG_BRASIL_API_KEY=sua_chave_de_producao
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

⚡ **InsightTrader** - Análise técnica automatizada para o mercado financeiro brasileiro.