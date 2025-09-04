import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`https://api.hgbrasil.com/finance/stock_price?key=&symbol=${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      let errorMessage = `HG Brasil API returned ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData.error) {
          errorMessage = errorData.error
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`
          }
        }
      } catch (e) {
        // Se não conseguir fazer parse do JSON, usar mensagem padrão
      }
      const error = new Error(errorMessage)
      ;(error as any).status = response.status
      throw error
    }

    const data = await response.json()
    
    // Verificar se a API retornou erro no JSON (mesmo com status 200)
    if (data.error === true) {
      return NextResponse.json(
        { 
          success: false, 
          error: data.message || 'Erro na API HG Brasil',
          details: 'Limite de requisições excedido ou problema na API'
        },
        { status: 429 } // Too Many Requests
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying HG Brasil stock_price API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stock price from HG Brasil',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}