import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`http://localhost:3000/api/asset-sync/save-asset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      let errorMessage = `Backend API returned ${response.status}`
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
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying save-asset API to backend:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save asset in backend',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}