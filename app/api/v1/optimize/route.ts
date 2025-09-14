import { NextRequest, NextResponse } from 'next/server'
import { promptOptimizer } from '@/lib/prompt-optimizer'
import { z } from 'zod'

// Request validation schema
const OptimizeRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(10000, 'Prompt too long'),
  strategy: z.enum(['concise', 'creative', 'technical', 'multilingual']).optional().default('concise'),
  targetLanguage: z.string().length(2).optional(),
  model: z.enum(['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229']).optional().default('claude-3-haiku-20240307'),
  temperature: z.number().min(0).max(2).optional().default(0.3),
  includeMetrics: z.boolean().optional().default(true),
  webhook: z.string().url().optional()
})

// Rate limiting (basic implementation)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now()
  const userLimit = rateLimit.get(identifier)
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (userLimit.count >= limit) {
    return false
  }
  
  userLimit.count++
  return true
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '') || 'demo'
    
    // Basic rate limiting (in production, use Redis)
    const clientId = request.ip || apiKey
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: 60
        },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = OptimizeRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { prompt, strategy, targetLanguage, model, temperature, includeMetrics, webhook } = validation.data

    // Generate unique optimization ID
    const optimizationId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Use the enhanced prompt optimizer service
    const result = await promptOptimizer.optimizePrompt(prompt, {
      model,
      temperature,
      translateToChinese: targetLanguage === 'zh',
      strategy
    })

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Optimization failed',
          details: result.error,
          id: optimizationId
        },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime

    // Prepare response
    const response = {
      id: optimizationId,
      originalPrompt: prompt,
      optimizedPrompt: result.output.prompt,
      strategy,
      timestamp: new Date().toISOString(),
      status: 'completed',
      ...(includeMetrics && {
        metrics: {
          originalTokens: result.input.tokens,
          optimizedTokens: result.output.tokens,
          tokensSaved: result.input.tokens - result.output.tokens,
          reductionPercentage: Math.round(((result.input.tokens - result.output.tokens) / result.input.tokens) * 100 * 10) / 10,
          estimatedCostSavings: (result.input.tokens - result.output.tokens) * 0.000005, // Rough estimate
          processingTimeMs: processingTime,
          model: model
        }
      })
    }

    // If webhook is provided, trigger async webhook call
    if (webhook) {
      // In production, use a queue system like Bull or Agenda
      setTimeout(async () => {
        try {
          await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'optimization.completed',
              data: response
            })
          })
        } catch (error) {
          console.error('Webhook failed:', error)
        }
      }, 0)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for API documentation
export async function GET() {
  return NextResponse.json({
    name: 'PromptOptimizer API',
    version: '1.0.0',
    description: 'AI-powered prompt optimization service',
    endpoints: {
      'POST /api/v1/optimize': 'Optimize a single prompt',
      'POST /api/v1/optimize/batch': 'Optimize multiple prompts',
      'GET /api/v1/optimize/{id}': 'Get optimization result by ID',
      'GET /api/v1/analytics/usage': 'Get usage statistics',
      'GET /api/v1/docs': 'API documentation'
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <api_key>'
    },
    rateLimits: {
      free: '60 requests/minute',
      pro: '300 requests/minute',
      enterprise: '1000 requests/minute'
    }
  })
}
