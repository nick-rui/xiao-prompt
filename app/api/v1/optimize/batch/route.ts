import { NextRequest, NextResponse } from 'next/server'
import { promptOptimizer } from '@/lib/prompt-optimizer'
import { z } from 'zod'

// Batch request validation schema
const BatchOptimizeRequestSchema = z.object({
  prompts: z.array(z.object({
    id: z.string().optional(),
    content: z.string().min(1, 'Prompt content is required').max(10000, 'Prompt too long'),
    strategy: z.enum(['concise', 'creative', 'technical', 'multilingual']).optional().default('concise'),
    targetLanguage: z.string().length(2).optional(),
    model: z.enum(['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229']).optional().default('claude-3-haiku-20240307'),
    temperature: z.number().min(0).max(2).optional().default(0.3)
  })).min(1, 'At least one prompt is required').max(10, 'Maximum 10 prompts per batch'),
  options: z.object({
    parallel: z.boolean().optional().default(true),
    maxConcurrency: z.number().min(1).max(10).optional().default(5),
    webhook: z.string().url().optional()
  }).optional().default({})
})

// Rate limiting for batch requests
const batchRateLimit = new Map<string, { count: number; resetTime: number }>()

function checkBatchRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const userLimit = batchRateLimit.get(identifier)
  
  if (!userLimit || now > userLimit.resetTime) {
    batchRateLimit.set(identifier, { count: 1, resetTime: now + windowMs })
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
    
    // Rate limiting for batch requests
    const clientId = request.ip || apiKey
    if (!checkBatchRateLimit(clientId)) {
      return NextResponse.json(
        { 
          error: 'Batch rate limit exceeded',
          retryAfter: 60
        },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = BatchOptimizeRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { prompts, options } = validation.data
    const { parallel, maxConcurrency, webhook } = options

    // Generate batch ID
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    let results: any[] = []
    let errors: any[] = []

    if (parallel) {
      // Process prompts in parallel with concurrency limit
      const chunks = []
      for (let i = 0; i < prompts.length; i += maxConcurrency) {
        chunks.push(prompts.slice(i, i + maxConcurrency))
      }

      for (const chunk of chunks) {
        const chunkPromises = chunk.map(async (promptData, index) => {
          try {
            const optimizationId = `${batchId}_${index + 1}`
            
            const result = await promptOptimizer.optimizePrompt(promptData.content, {
              model: promptData.model,
              temperature: promptData.temperature,
              translateToChinese: promptData.targetLanguage === 'zh',
              strategy: promptData.strategy
            })

            if (result.success) {
              return {
                id: promptData.id || optimizationId,
                originalPrompt: promptData.content,
                optimizedPrompt: result.output.prompt,
                strategy: promptData.strategy,
                status: 'completed',
                metrics: {
                  originalTokens: result.input.tokens,
                  optimizedTokens: result.output.tokens,
                  tokensSaved: result.input.tokens - result.output.tokens,
                  reductionPercentage: Math.round(((result.input.tokens - result.output.tokens) / result.input.tokens) * 100 * 10) / 10,
                  model: promptData.model
                }
              }
            } else {
              return {
                id: promptData.id || optimizationId,
                originalPrompt: promptData.content,
                status: 'failed',
                error: result.error
              }
            }
          } catch (error) {
            return {
              id: promptData.id || `${batchId}_${index + 1}`,
              originalPrompt: promptData.content,
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error'
            }
          }
        })

        const chunkResults = await Promise.all(chunkPromises)
        results.push(...chunkResults)
      }
    } else {
      // Process prompts sequentially
      for (let i = 0; i < prompts.length; i++) {
        const promptData = prompts[i]
        try {
          const optimizationId = `${batchId}_${i + 1}`
          
          const result = await promptOptimizer.optimizePrompt(promptData.content, {
            model: promptData.model,
            temperature: promptData.temperature,
            translateToChinese: promptData.targetLanguage === 'zh',
            strategy: promptData.strategy
          })

          if (result.success) {
            results.push({
              id: promptData.id || optimizationId,
              originalPrompt: promptData.content,
              optimizedPrompt: result.output.prompt,
              strategy: promptData.strategy,
              status: 'completed',
              metrics: {
                originalTokens: result.input.tokens,
                optimizedTokens: result.output.tokens,
                tokensSaved: result.input.tokens - result.output.tokens,
                reductionPercentage: Math.round(((result.input.tokens - result.output.tokens) / result.input.tokens) * 100 * 10) / 10,
                model: promptData.model
              }
            })
          } else {
            results.push({
              id: promptData.id || optimizationId,
              originalPrompt: promptData.content,
              status: 'failed',
              error: result.error
            })
          }
        } catch (error) {
          results.push({
            id: promptData.id || `${batchId}_${i + 1}`,
            originalPrompt: promptData.content,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    }

    const processingTime = Date.now() - startTime
    const successful = results.filter(r => r.status === 'completed').length
    const failed = results.filter(r => r.status === 'failed').length

    const response = {
      batchId,
      totalPrompts: prompts.length,
      successful,
      failed,
      processingTimeMs: processingTime,
      parallel,
      maxConcurrency,
      timestamp: new Date().toISOString(),
      results
    }

    // If webhook is provided, trigger async webhook call
    if (webhook) {
      setTimeout(async () => {
        try {
          await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'batch.completed',
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
    console.error('Batch API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for batch API documentation
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/v1/optimize/batch',
    description: 'Optimize multiple prompts in a single request',
    maxPrompts: 10,
    concurrency: 'Up to 10 parallel requests',
    rateLimit: '10 batches per minute',
    example: {
      prompts: [
        {
          id: 'prompt_1',
          content: 'Create a beautiful sunset landscape...',
          strategy: 'concise'
        },
        {
          id: 'prompt_2',
          content: 'Write a creative story about...',
          strategy: 'creative'
        }
      ],
      options: {
        parallel: true,
        maxConcurrency: 5
      }
    }
  })
}
