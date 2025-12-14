# 📈 InsightTrader

<div align="center">

![InsightTrader](https://img.shields.io/badge/InsightTrader-v1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**Sistema escalável para análises técnicas de ativos financeiros**

[Funcionalidades](#-funcionalidades) • [Tecnologias](#-tecnologias) • [Instalação](#-instalação) • [Uso](#-uso) • [Arquitetura](#-arquitetura) • [Contribuir](#-contribuir)

</div>

---

## 📋 Sobre o Projeto

O **InsightTrader** é uma plataforma completa de análise técnica financeira que oferece análises automatizadas de ativos (ações B3, mini dólar, etc.), gestão de carteiras personalizadas e sistema administrativo completo. Construído com tecnologias modernas como **Next.js 14**, **Node.js** e **MongoDB**, o sistema proporciona uma experiência profissional com interface dark moderna e componentes de alta performance.

### 🎯 Principais Diferenciais

- ✅ **Análises Automatizadas**: Sistema de cron jobs para análises técnicas periódicas
- ✅ **Interface Moderna**: Design system baseado em ShadCN/UI com tema dark
- ✅ **Gestão Inteligente**: Carteiras personalizadas com alertas direcionados
- ✅ **Backtest Avançado**: Simulação de estratégias com gráficos de alta performance
- ✅ **Multi-tenant**: Sistema de permissões com planos Freemium, Premium e Enterprise
- ✅ **Escalável**: Arquitetura preparada para crescimento e alta disponibilidade

---

## 🚀 Funcionalidades

### 🔐 Sistema de Autenticação
- Login/Registro com email/senha e Google OAuth
- Perfis de usuário (Admin e usuário comum)
- Proteção de rotas com verificação automática
- Gestão de perfil com upload de avatar

### 📊 Dashboard Inteligente
- Métricas gerais: total de insights, recomendações e confiança média
- Sugestões personalizadas filtradas por carteira do usuário
- Insights recentes com análises em tempo real
- Alertas direcionados apenas para ativos da carteira

### 🛠️ Gestão de Técnicas de Análise
- CRUD completo de técnicas (RSI, MACD, Médias Móveis, etc.)
- Campos configuráveis: título, descrição, periodicidade
- Associação dinâmica com ativos específicos
- Operações em lote (bulk operations)

### 💼 Sistema de Carteira Personalizada
- Interface intuitiva para seleção de ativos
- Filtros avançados por nome, código e tipo
- Toggle de alertas para notificações
- Estatísticas em tempo real

### 📈 Backtest Avançado
- Períodos flexíveis: 30d, 60d, 6m, 12m ou customizado
- Gráficos canvas de alta performance
- Sinais visuais de compra/venda
- Animações suaves e loading states

### 👥 Gestão de Usuários (Admin)
- Lista completa de usuários da plataforma
- Controle de status (ativar/bloquear)
- Gestão de planos (Freemium, Premium, Enterprise)
- Métricas de usuários ativos e planos pagos

### 🏷️ Sistema de Ativos (Admin)
- Principais ativos B3 pré-cadastrados
- Logos automáticos com integração externa
- Filtros por tipo (Ações, FIIs, ETFs, etc.)
- CRUD completo de ativos financeiros

---

## 🛠️ Tecnologias

### Frontend
- **[Next.js 14](https://nextjs.org/)** - Framework React com App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[ShadCN/UI](https://ui.shadcn.com/)** - Biblioteca de componentes
- **[Lucide React](https://lucide.dev/)** - Ícones SVG modernos
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI acessíveis

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express.js](https://expressjs.com/)** - Framework web minimalista
- **[MongoDB](https://www.mongodb.com/)** - Banco de dados NoSQL
- **[Mongoose](https://mongoosejs.com/)** - ODM para MongoDB
- **[Winston](https://github.com/winstonjs/winston)** - Sistema de logs
- **[Node-Cron](https://github.com/node-cron/node-cron)** - Tarefas agendadas

### DevOps & Tools
- **[Docker](https://www.docker.com/)** - Containerização
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[Nodemon](https://nodemon.io/)** - Hot reload em desenvolvimento

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18 ou superior
- **MongoDB** 7.0 ou superior
- **NPM** ou **Yarn**

### Opção 1: Instalação Local

#### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/insighttrader.git
cd insighttrader
```

#### 2. Configure as variáveis de ambiente
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env

# Edite o arquivo .env com suas configurações
MONGODB_URI=mongodb://localhost:27017/insighttrader
HG_BRASIL_API_KEY=sua_chave_api
PORT=3001
NODE_ENV=development
```

#### 3. Instale as dependências do backend
```bash
npm install
```

#### 4. Instale as dependências do frontend
```bash
cd frontend
npm install
cd ..
```

#### 5. Popule o banco de dados (opcional)
```bash
npm run seed:all
```

### Opção 2: Instalação com Docker

```bash
# Inicie todos os serviços
docker-compose up -d

# Verifique os logs
docker-compose logs -f

# Para parar os serviços
docker-compose down
```

---

## 🚀 Uso

### Desenvolvimento

#### Iniciar o Backend
```bash
# Na raiz do projeto
npm run dev

# O backend estará disponível em http://localhost:3001
```

#### Iniciar o Frontend
```bash
# No diretório frontend
cd frontend
npm run dev

# O frontend estará disponível em http://localhost:3000
```

### Produção

#### Backend
```bash
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm start
```

### Credenciais de Acesso

```
Usuário Demo:
Email: demo@insighttrader.com
Senha: demo123

Administrador:
Email: marcioamr@gmail.com
Senha: admin123
```

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
insighttrader/
├── src/                          # Backend (Node.js + Express)
│   ├── controllers/              # Controladores HTTP
│   ├── models/                   # Modelos Mongoose
│   ├── routes/                   # Rotas da API REST
│   ├── services/                 # Lógica de negócio
│   │   ├── analysisService.js   # Serviço de análise técnica
│   │   ├── cronService.js       # Tarefas agendadas
│   │   └── hgBrasilService.js   # Integração API externa
│   ├── middleware/               # Middlewares Express
│   ├── config/                   # Configurações
│   ├── scripts/                  # Scripts de seed e utilitários
│   └── app.js                   # Aplicação principal
│
├── frontend/                     # Frontend (Next.js 14)
│   ├── app/                     # App Router (Next.js 14)
│   │   ├── login/              # Autenticação
│   │   ├── portfolio/          # Gestão de carteira
│   │   ├── users/              # Admin de usuários
│   │   ├── assets/             # Gestão de ativos
│   │   ├── backtest/           # Sistema de backtest
│   │   └── techniques/         # Gestão de técnicas
│   ├── components/
│   │   ├── ui/                 # Componentes base (ShadCN)
│   │   ├── layout/             # Layout e navegação
│   │   ├── profile/            # Perfil do usuário
│   │   └── charts/             # Componentes de gráficos
│   ├── hooks/                  # React Hooks customizados
│   ├── lib/                    # Utilitários e configurações
│   ├── types/                  # Definições TypeScript
│   └── styles/                 # Estilos globais
│
├── docs/                        # Documentação
│   ├── API.md                  # Documentação da API
│   ├── ARCHITECTURE.md         # Arquitetura do sistema
│   └── CONTRIBUTING.md         # Guia de contribuição
│
├── docker-compose.yml          # Configuração Docker
├── Dockerfile                  # Imagem Docker
└── package.json               # Dependências do projeto
```

### Fluxo de Dados

```
┌─────────────┐      HTTP/REST      ┌─────────────┐
│   Next.js   │ ◄─────────────────► │  Express.js │
│  Frontend   │                      │   Backend   │
└─────────────┘                      └─────────────┘
                                            │
                                            │ Mongoose ODM
                                            ▼
                                     ┌─────────────┐
                                     │   MongoDB   │
                                     │  Database   │
                                     └─────────────┘
                                            ▲
                                            │
                                     ┌─────────────┐
                                     │  Cron Jobs  │
                                     │  (Analysis) │
                                     └─────────────┘
```

### Modelos de Dados

#### Users (Usuários)
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,           // 'user' | 'admin'
  plan: String,           // 'freemium' | 'premium' | 'enterprise'
  status: String,         // 'active' | 'blocked'
  avatar: String,
  portfolio: [ObjectId],  // Referência para Assets
  createdAt: Date
}
```

#### Assets (Ativos)
```javascript
{
  name: String,           // "Petrobras PN"
  symbol: String,         // "PETR4"
  type: String,           // "stock" | "currency" | "commodity"
  logo: String,
  active: Boolean,
  createdAt: Date
}
```

#### AnalysisTechniques (Técnicas)
```javascript
{
  title: String,          // "RSI - Índice de Força Relativa"
  description: String,
  periodicity: String,    // "hourly" | "daily" | "weekly" | "monthly"
  active: Boolean,
  createdAt: Date
}
```

#### Insights (Análises)
```javascript
{
  asset: ObjectId,        // Referência para Asset
  technique: ObjectId,    // Referência para AnalysisTechnique
  position: String,       // "buy" | "sell" | "hold"
  confidence: Number,     // 0-100
  analysis: String,
  visible: Boolean,
  createdAt: Date
}
```

---

## 📚 Scripts Disponíveis

### Backend

```bash
npm start              # Inicia o servidor em produção
npm run dev            # Inicia o servidor em desenvolvimento (nodemon)
npm test               # Executa os testes com Jest
npm run lint           # Executa o ESLint
npm run build          # Constrói a imagem Docker
npm run seed:all       # Popula o banco com dados iniciais
npm run seed:clear     # Limpa os dados do banco
npm run extract:logos  # Extrai logos de ativos do TradingView
```

### Frontend

```bash
npm run dev            # Inicia o servidor de desenvolvimento
npm run build          # Constrói a aplicação para produção
npm start              # Inicia o servidor de produção
npm run lint           # Executa o linter do Next.js
```

### Docker

```bash
docker-compose up -d           # Inicia todos os serviços
docker-compose down            # Para todos os serviços
docker-compose logs -f         # Visualiza os logs
docker-compose restart         # Reinicia os serviços
```

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com cobertura
npm test -- --coverage
```

---

## 🔐 Segurança

### Boas Práticas Implementadas

- ✅ Helmet.js para headers de segurança HTTP
- ✅ CORS configurado adequadamente
- ✅ Validação de entrada com Joi
- ✅ Senhas hasheadas com bcryptjs
- ✅ JWT para autenticação stateless
- ✅ Rate limiting (planejado)
- ✅ Sanitização de dados

### Variáveis de Ambiente Sensíveis

Nunca commite o arquivo `.env` no repositório. Use `.env.example` como template:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/insighttrader

# API Keys
HG_BRASIL_API_KEY=sua_chave_aqui

# Server
PORT=3001
NODE_ENV=development

# JWT (se implementado)
JWT_SECRET=seu_secret_aqui
```

---

## 🎨 Design System

### Tema e Cores

O InsightTrader utiliza um tema dark profissional com as seguintes cores principais:

```css
/* Cores Primárias */
--primary: #3b82f6      /* Blue 500 */
--secondary: #8b5cf6    /* Purple 500 */
--accent: #10b981       /* Green 500 */

/* Backgrounds */
--background: #0a0a0a   /* Quase preto */
--card: #1a1a1a         /* Cinza escuro */

/* Texto */
--foreground: #ffffff   /* Branco */
--muted: #6b7280        /* Cinza médio */
```

### Componentes UI

Todos os componentes seguem o padrão ShadCN/UI com customizações:

- **Buttons**: Variantes primary, secondary, outline, ghost
- **Cards**: Glass effect com backdrop blur
- **Inputs**: Validação visual e estados de erro
- **Modals**: Animações suaves com Radix Dialog
- **Tables**: Responsivas com sorting e paginação

---

## 🌐 API Endpoints

### Autenticação
```
POST   /api/auth/login          # Login de usuário
POST   /api/auth/register       # Registro de novo usuário
GET    /api/auth/me             # Dados do usuário logado
```

### Ativos
```
GET    /api/assets              # Lista todos os ativos
GET    /api/assets/:id          # Detalhes de um ativo
POST   /api/assets              # Cria novo ativo (admin)
PUT    /api/assets/:id          # Atualiza ativo (admin)
DELETE /api/assets/:id          # Remove ativo (admin)
```

### Técnicas
```
GET    /api/techniques          # Lista todas as técnicas
GET    /api/techniques/:id      # Detalhes de uma técnica
POST   /api/techniques          # Cria nova técnica (admin)
PUT    /api/techniques/:id      # Atualiza técnica (admin)
DELETE /api/techniques/:id      # Remove técnica (admin)
```

### Insights
```
GET    /api/insights            # Lista insights (filtrado por carteira)
GET    /api/insights/:id        # Detalhes de um insight
POST   /api/insights/analyze    # Força análise manual (admin)
```

### Usuários (Admin)
```
GET    /api/users               # Lista todos os usuários
GET    /api/users/:id           # Detalhes de um usuário
PUT    /api/users/:id           # Atualiza usuário
DELETE /api/users/:id           # Remove usuário
```

Para documentação completa da API, consulte [docs/API.md](docs/API.md).

---

## 🗺️ Roadmap

### Versão 1.1 (Q1 2025)
- [ ] Integração real com API HG Brasil
- [ ] Sistema de notificações push
- [ ] Relatórios em PDF
- [ ] Dashboard analytics avançado

### Versão 1.2 (Q2 2025)
- [ ] API de webhooks
- [ ] Sistema de assinatura Stripe
- [ ] Múltiplos idiomas (i18n)
- [ ] Cache Redis

### Versão 2.0 (Q3 2025)
- [ ] App mobile (React Native)
- [ ] CDN para assets
- [ ] Service Workers
- [ ] Monitoring e APM

---

## 🤝 Contribuir

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](docs/CONTRIBUTING.md) para detalhes sobre nosso código de conduta e processo de submissão de pull requests.

### Como Contribuir

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use ESLint para manter a consistência
- Escreva testes para novas funcionalidades
- Documente mudanças significativas
- Siga os padrões de commit semântico

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Autores

- **InsightTrader Team** - *Desenvolvimento inicial* - [GitHub](https://github.com/insighttrader)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) pela excelente framework
- [ShadCN/UI](https://ui.shadcn.com/) pelos componentes incríveis
- [Vercel](https://vercel.com/) pela plataforma de deploy
- [MongoDB](https://www.mongodb.com/) pelo banco de dados robusto
- Comunidade open source por todas as bibliotecas utilizadas

---

## 📞 Suporte

Para suporte, envie um email para support@insighttrader.com ou abra uma issue no GitHub.

---

## 🔗 Links Úteis

- [Documentação Completa](docs/)
- [API Reference](docs/API.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Guia de Contribuição](docs/CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

---

<div align="center">

**Desenvolvido com ❤️ usando Next.js, Node.js e MongoDB**

[⬆ Voltar ao topo](#-insighttrader)

</div>
