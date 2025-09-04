# 📈 InsightTrader

## 📌 Descrição
O **InsightTrader** é uma plataforma completa de análise técnica financeira construída com **Next.js 14**, **Node.js** e **MongoDB**. O sistema oferece análises automatizadas de ativos (ações B3, mini dólar etc.), gestão de carteiras personalizadas e sistema administrativo completo.

A interface utiliza o template visual [Enfix - ShadCN Tailwind NextJS Finance Admin Template](https://preview.themeforest.net/item/enfix-shadcn-tailwind-nextjs-finance-admin-template/full_screen_preview/57521515) com tema dark e componentes modernos.

---

## 🚀 Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- **Login/Registro**: Email/senha e Google OAuth
- **Perfis de Usuário**: Admin e usuário comum
- **Proteção de Rotas**: Verificação automática de autenticação
- **Gestão de Perfil**: Upload de avatar e atualização de dados

### 📊 **Dashboard Inteligente**
- **Métricas Gerais**: Total de insights, recomendações e confiança média
- **Sugestões Personalizadas**: Filtradas por carteira do usuário
- **Insights Recentes**: Últimas análises realizadas pelo sistema
- **Alertas Direcionados**: Notificações apenas para ativos da carteira

### 🛠️ **Gestão de Técnicas de Análise**
- **CRUD Completo**: Criar, editar, ativar/inativar e excluir técnicas
- **Campos Configuráveis**: Título, descrição, periodicidade
- **Associação Dinâmica**: Vincular técnicas a ativos específicos
- **Bulk Operations**: Vincular/desvincular todas as técnicas

### 💼 **Sistema de Carteira Personalizada**
- **Seleção de Ativos**: Interface intuitiva para escolher ativos
- **Filtros Avançados**: Por nome, código e tipo de ativo
- **Toggle de Alertas**: Ativar/desativar notificações
- **Estatísticas**: Contadores de ativos selecionados

### 📈 **Backtest Avançado**
- **Períodos Flexíveis**: 30d, 60d, 6m, 12m ou customizado
- **Gráficos Canvas**: Renderização de alta performance
- **Sinais Visuais**: Marcadores de compra/venda
- **Animações Suaves**: Transições e loading states

### 👥 **Gestão de Usuários (Admin)**
- **Lista Completa**: Visualização de todos os usuários
- **Controle de Status**: Ativar/bloquear usuários
- **Gestão de Planos**: Freemium, Premium, Enterprise
- **Estatísticas**: Métricas de usuários ativos e planos pagos

### 🏷️ **Sistema de Ativos (Admin)**
- **Principais Ativos B3**: Pré-cadastrados com logos
- **Logos Automaticos**: Integração com fontes externas
- **Filtros por Tipo**: Ações, FIIs, ETFs, etc.
- **Gestão Completa**: CRUD de ativos financeiros

---

## 🎨 **Interface e UX**

### **Design System**
- **ShadCN/UI**: Componentes modernos e acessíveis
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Tema Dark**: Interface escura profissional
- **Glass Effects**: Efeitos visuais modernos
- **Animações**: Transições suaves e loading states

### **Componentes Personalizados**
- **UserAvatar**: Sistema robusto de avatares com fallback
- **AssetLogo**: Logos de ativos com carregamento inteligente
- **LightweightChart**: Gráficos canvas de alta performance
- **Metric Cards**: Cards informativos com gradientes

---

## 🏗️ **Arquitetura Técnica**

### **Frontend (Next.js 14)**
```typescript
├── app/                          # App Router (Next.js 14)
│   ├── login/                   # Página de autenticação
│   ├── portfolio/               # Gestão de carteira
│   ├── users/                   # Administração de usuários
│   ├── assets/[id]/            # Páginas dinâmicas de ativos
│   ├── backtest/               # Sistema de backtest
│   └── techniques/             # Gestão de técnicas
├── components/
│   ├── ui/                     # Componentes base (ShadCN)
│   ├── layout/                 # Layout e navegação
│   ├── profile/                # Perfil do usuário
│   └── charts/                 # Componentes de gráficos
├── hooks/                      # React Hooks customizados
│   ├── use-auth.tsx           # Contexto de autenticação
│   ├── use-theme.tsx          # Gerenciamento de tema
│   └── use-avatar.tsx         # Sistema de avatares
└── styles/                     # Estilos globais e tema
```

### **Backend (Node.js + Express)**
```javascript
├── src/
│   ├── controllers/            # Controladores da API
│   ├── models/                 # Modelos do MongoDB
│   ├── routes/                 # Rotas da API REST
│   ├── services/               # Lógica de negócio
│   ├── utils/                  # Utilitários
│   └── app.js                 # Aplicação principal
├── data/                       # Dados mock e seeds
└── package.json               # Dependências do backend
```

### **Banco de Dados (MongoDB)**
```javascript
// Principais Collections
- users          // Usuários da plataforma
- assets         // Ativos financeiros (PETR4, VALE3, etc.)
- techniques     // Técnicas de análise técnica
- insights       // Resultados das análises
- associations   // Vínculos técnica-ativo
```

---

## 🔧 **Stack Tecnológica**

### **Frontend**
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework de CSS utilitário
- **ShadCN/UI**: Biblioteca de componentes
- **Lucide React**: Ícones SVG
- **Canvas API**: Gráficos de alta performance

### **Backend**
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **Winston**: Sistema de logs
- **Cron**: Tarefas agendadas

### **Desenvolvimento**
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Nodemon**: Hot reload do backend
- **CORS**: Políticas de origem cruzada

---

## 🎭 **Sistema de Papéis e Permissões**

### **Usuário Comum (Freemium)**
- ✅ Dashboard personalizado
- ✅ Gestão de carteira própria
- ✅ Visualização de insights
- ✅ Sistema de backtest
- ❌ Gestão de usuários
- ❌ Gestão de ativos
- ❌ Administração do sistema

### **Administrador (Enterprise)**
- ✅ Todas as funcionalidades do usuário
- ✅ Gestão completa de usuários
- ✅ Controle de status e planos
- ✅ Gestão de ativos da plataforma
- ✅ Acesso a métricas gerais
- ✅ Configurações do sistema

### **Planos Disponíveis**
- **Freemium**: Acesso básico gratuito
- **Premium**: Funcionalidades avançadas (futuro)
- **Enterprise**: Acesso administrativo completo

---

## 🔐 **Autenticação e Segurança**

### **Sistema de Login**
```typescript
// Credenciais Demo
Usuario: demo@insighttrader.com / demo123
Admin:   marcioamr@gmail.com / admin123
```

### **Recursos de Segurança**
- **Proteção de Rotas**: Verificação automática de autenticação
- **Contexto Global**: Estado de autenticação compartilhado
- **LocalStorage**: Persistência de sessão no cliente
- **Redirect Automático**: Redirecionamento baseado em status
- **Validação de Formulários**: Validação client-side e server-side

---

## 📱 **Navegação e UX**

### **Menu Principal (Usuário)**
- 🏠 **Dashboard**: Visão geral e insights
- ⚙️ **Técnicas**: Gestão de técnicas de análise
- 💼 **Carteira**: Seleção de ativos pessoais
- 📊 **Backtest**: Simulação de estratégias

### **Menu Administrativo (Admin)**
- 🏠 **Dashboard**: Visão geral e insights
- ⚙️ **Técnicas**: Gestão de técnicas de análise
- 📈 **Ativos**: Gestão de ativos da plataforma
- 👥 **Usuários**: Administração de usuários
- 💼 **Carteira**: Seleção de ativos pessoais
- 📊 **Backtest**: Simulação de estratégias

### **Funcionalidades UX**
- **Tema Dark**: Interface moderna e profissional
- **Responsivo**: Adaptável a diferentes dispositivos
- **Loading States**: Indicadores visuais de carregamento
- **Tooltips**: Informações contextuais
- **Animações**: Transições suaves entre estados

---

## 🚦 **Como Executar**

### **Pré-requisitos**
- Node.js 18+
- MongoDB
- NPM ou Yarn

### **Instalação Backend**
```bash
cd /path/to/insighttrader
PORT=3001 npm run dev
```

### **Instalação Frontend**
```bash
cd /path/to/insighttrader/frontend
npm install
npm run dev
```

### **Acesso**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Login**: Use as credenciais demo ou admin

---

## 🎯 **Roadmap e Melhorias Futuras**

### **Próximas Features**
- [ ] Integração real com API HG Brasil
- [ ] Sistema de notificações push
- [ ] Relatórios em PDF
- [ ] API de webhooks
- [ ] Dashboard analytics avançado
- [ ] Sistema de assinatura Stripe
- [ ] Múltiplos idiomas (i18n)
- [ ] App mobile (React Native)

### **Otimizações Técnicas**
- [ ] Cache Redis
- [ ] CDN para assets
- [ ] SSR/SSG otimizado
- [ ] Bundle splitting
- [ ] Service Workers
- [ ] Database indexing
- [ ] API rate limiting
- [ ] Monitoring e APM

---

## 📄 **Licença**
Projeto privado - Todos os direitos reservados.

---

**Desenvolvido com ❤️ usando Next.js, Node.js e MongoDB**

