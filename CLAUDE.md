# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Node.js/Express)
- `npm run dev` - Start backend in development mode with nodemon
- `npm start` - Start backend in production mode
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint on src/ directory
- `npm run build` - Build Docker image
- `npm run seed:all` - Seed database with techniques and assets
- `npm run seed:clear` - Clear seeded data

### Frontend (Next.js)
- `cd frontend && npm run dev` - Start frontend development server
- `cd frontend && npm run build` - Build frontend for production
- `cd frontend && npm run start` - Start frontend production server
- `cd frontend && npm run lint` - Run Next.js linting

### Docker
- `docker-compose up -d` - Start full stack with MongoDB
- `docker-compose down` - Stop all services

## Architecture Overview

### Backend Structure
- **Express.js API** with MongoDB/Mongoose
- **MVC Pattern**: Controllers handle HTTP requests, Services contain business logic
- **Key Models**: AnalysisTechnique, Asset, AssetTechnique (associations), Insight (analysis results)
- **Automated Analysis**: Cron jobs run technical analysis based on configured periodicities
- **External Integration**: HG Brasil API for real-time financial data

### Frontend Structure
- **Next.js 14** with TypeScript and Tailwind CSS
- **ShadCN/UI Components** with Radix UI primitives
- **App Router**: Route-based pages in `/frontend/app/`
- **Component Structure**: Reusable UI components in `/frontend/components/`

### Key Directories
```
src/
├── controllers/     # HTTP request handlers
├── models/         # Mongoose schemas
├── services/       # Business logic (analysis, cron, HG Brasil)
├── routes/         # API route definitions
├── scripts/        # Database seeding and utilities
└── config/         # Database and logger configuration

frontend/
├── app/            # Next.js app router pages
├── components/     # Reusable UI components
├── lib/            # Utility functions and configurations
└── types/          # TypeScript type definitions
```

## Technical Analysis System

The core functionality revolves around:
1. **Analysis Techniques** - Configurable technical indicators (RSI, MACD, Moving Averages)
2. **Assets** - Financial instruments (stocks, currencies, commodities)
3. **Asset-Technique Associations** - Many-to-many relationships defining which techniques apply to which assets
4. **Insights** - Generated analysis results with position suggestions (buy/sell/hold)

## Database Models

- **AnalysisTechnique**: Stores analysis configurations with periodicities (hourly, daily, weekly, monthly)
- **Asset**: Financial instruments with symbols and metadata
- **AssetTechnique**: Junction table for asset-technique relationships
- **Insight**: Analysis results with recommendations and visibility controls

## Environment Configuration

Required environment variables:
- `MONGODB_URI` - Database connection string
- `HG_BRASIL_API_KEY` - Financial data API key
- `PORT` - Backend server port (default: 3000)
- `NODE_ENV` - Environment mode

## Testing and Quality

- Backend uses Jest for testing
- ESLint for code quality
- Winston for structured logging
- Helmet and CORS for security