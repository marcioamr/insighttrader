# 🏗️ Arquitetura do InsightTrader

## Visão Geral

O InsightTrader é construído com uma arquitetura moderna de três camadas separando Frontend (Next.js), Backend (Node.js/Express) e Banco de Dados (MongoDB).

## Camadas da Aplicação

### 1. Frontend (Next.js 14)

- **App Router**: Roteamento baseado em arquivos
- **Server Components**: Renderização no servidor
- **API Routes**: Endpoints internos
- **TypeScript**: Tipagem estática

### 2. Backend (Node.js/Express)

- **Arquitetura MVC**: Model-View-Controller
- **REST API**: Endpoints RESTful
- **Middlewares**: Autenticação, validação, logs
- **Services**: Lógica de negócio

### 3. Banco de Dados (MongoDB)

- **Collections**: Assets, Techniques, Insights, Users
- **Mongoose ODM**: Modelagem de dados
- **Índices**: Otimização de queries

## Serviços Principais

### Analysis Service
Executa análises técnicas (RSI, MACD, Médias Móveis)

### Cron Service
Gerencia jobs automáticos baseados em periodicidade

### HG Brasil Service
Integração com API de dados financeiros

## Segurança

- **JWT**: Autenticação via tokens
- **Bcrypt**: Hash de senhas
- **Helmet**: Proteção HTTP
- **Joi**: Validação de dados

## Performance

- Índices no MongoDB
- Cache de dados
- Paginação
- Lazy loading

## Deploy

- Docker e Docker Compose
- Railway (backend)
- Vercel (frontend)
