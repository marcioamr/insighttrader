import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.HG_BRASIL_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'HG Brasil API key not configured',
          details: 'Configure a variável de ambiente HG_BRASIL_API_KEY no frontend.'
        },
        { status: 500 }
      )
    }

    const url = new URL('https://api.hgbrasil.com/finance/ticker_list')
    url.searchParams.append('key', apiKey)
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorData = null
      
      // Tentar fazer parse do JSON uma única vez
      try {
        errorData = await response.json()
      } catch (e) {
        // Se não conseguir parse do JSON, usar resposta padrão
        return NextResponse.json(
          { 
            success: false, 
            error: `HG Brasil API returned ${response.status}`,
            details: 'Erro na comunicação com a API HG Brasil. Tente novamente mais tarde.'
          },
          { status: 500 }
        )
      }
      
      // Tratar especificamente o erro 403 (rate limiting) com JSON válido
      if (response.status === 403 && errorData && errorData.error === true) {
        return NextResponse.json(
          { 
            success: false, 
            error: errorData.message || 'HG Brasil API: Limite de requisições excedido',
            details: 'O limite diário da API HG Brasil foi excedido. Aguarde até 00:00 UTC para o reset do limite ou use o modo de sincronização simulada.',
            code: 'RATE_LIMIT_EXCEEDED',
            suggestions: [
              'Use o botão "Sincronização Simulada" para criar dados de teste',
              'Aguarde até meia-noite UTC (21:00 horário de Brasília) para o reset da API',
              'Considere fazer upgrade para um plano premium na HG Brasil'
            ]
          },
          { status: 429 } // Too Many Requests
        )
      }
      
      // Outros erros HTTP
      const errorMessage = errorData?.message || `HG Brasil API returned ${response.status}`
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
          details: 'Erro na API HG Brasil. Verifique sua conexão e tente novamente.'
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Verificar se a API retornou erro no JSON (mesmo com status 200)
    if (data.error === true) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || 'HG Brasil API: Limite de requisições excedido',
          details: 'O limite diário da API HG Brasil foi excedido. Aguarde até 00:00 UTC para o reset do limite ou use o modo de sincronização simulada.',
          code: 'RATE_LIMIT_EXCEEDED',
          suggestions: [
            'Use o botão "Sincronização Simulada" para criar dados de teste',
            'Aguarde até meia-noite UTC (21:00 horário de Brasília) para o reset da API',
            'Considere fazer upgrade para um plano premium na HG Brasil'
          ]
        },
        { status: 429 } // Too Many Requests
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying HG Brasil ticker_list API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch ticker list from HG Brasil',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}