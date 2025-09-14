import { NextRequest, NextResponse } from 'next/server'
import { promptOptimizer } from '@/lib/prompt-optimizer'

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemPrompt, useOptimizer } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (useOptimizer) {
      // Use the enhanced prompt optimizer service
      const result = await promptOptimizer.optimizePrompt(prompt, {
        model: 'claude-3-haiku-20240307',
        temperature: 0.3,
        translateToChinese: true // Enable translation by default
      })

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        optimizedPrompt: result.output.prompt,
        originalPrompt: prompt,
        originalTokens: result.input.tokens,
        optimizedTokens: result.output.tokens,
        success: true,
        pipelineId: result.id,
        processingTime: result.processingTimeMs
      })
    } else {
      // Fallback to simple optimization (original logic)
      return NextResponse.json(
        { error: 'Simple optimization not implemented - use useOptimizer: true' },
        { status: 501 }
      )
    }

  } catch (error) {
    console.error('Error calling Anthropic API:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to optimize prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
