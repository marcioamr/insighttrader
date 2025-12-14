# 📡 Documentação da API

## Base URL

```
http://localhost:3000/api
```

## Autenticação

A maioria dos endpoints requer autenticação via JWT token:

```
Authorization: Bearer <token>
```

## Endpoints

### Técnicas de Análise

#### Listar Técnicas
```http
GET /api/analysis-techniques
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "RSI",
      "description": "Relative Strength Index",
      "periodicity": "daily",
      "isActive": true
    }
  ]
}
```

#### Criar Técnica
```http
POST /api/analysis-techniques
Content-Type: application/json

{
  "title": "MACD",
  "description": "Moving Average Convergence Divergence",
  "periodicity": "daily"
}
```

### Ativos

#### Listar Ativos
```http
GET /api/assets?page=1&limit=20&type=stock
```

**Query Parameters:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `type`: Filtrar por tipo (stock, currency, commodity, index)
- `search`: Buscar por nome ou código

#### Criar Ativo
```http
POST /api/assets
Content-Type: application/json

{
  "name": "Petrobras",
  "code": "PETR4",
  "type": "stock",
  "logoUrl": "https://..."
}
```

### Insights

#### Listar Insights
```http
GET /api/insights?asset=<assetId>&technique=<techniqueId>
```

#### Sugestões de Posição
```http
GET /api/insights/suggestions
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "invest": [
      {
        "asset": { "name": "PETR4", "code": "PETR4" },
        "technique": { "title": "RSI" },
        "confidence": 85,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "exit": []
  }
}
```

### Análises

#### Executar Análise Manual
```http
POST /api/analysis/manual
Content-Type: application/json

{
  "assetId": "...",
  "techniqueId": "..."
}
```

#### Status dos Jobs
```http
GET /api/analysis/jobs/status
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "hourly": { "running": true, "nextRun": "2024-01-01T10:00:00.000Z" },
    "daily": { "running": true, "nextRun": "2024-01-02T09:00:00.000Z" }
  }
}
```

## Códigos de Status

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Não autorizado
- `404` - Não encontrado
- `500` - Erro interno

## Rate Limiting

- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário autenticado

## Exemplos com cURL

### Criar Técnica
```bash
curl -X POST http://localhost:3000/api/analysis-techniques \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "RSI",
    "description": "Relative Strength Index",
    "periodicity": "daily"
  }'
```

### Listar Ativos
```bash
curl http://localhost:3000/api/assets?page=1&limit=10 \
  -H "Authorization: Bearer <token>"
```
