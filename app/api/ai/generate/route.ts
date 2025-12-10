import { NextRequest, NextResponse } from 'next/server'
import { modifyText, answerGeneralQuestion } from '@/lib/groq/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...params } = body

    let result: any

    switch (type) {
      case 'text-modification':
        result = await modifyText(params)
        break
      case 'general-question':
        result = await answerGeneralQuestion(params)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid generation type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}
