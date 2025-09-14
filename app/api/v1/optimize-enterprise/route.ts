import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { promptOptimizer } from '@/lib/prompt-optimizer'
import { z } from 'zod'

// Token cost rates for different models
const TOKEN_COSTS = {
  'gpt-4': 0.00003,
  'gpt-4-turbo': 0.00001,
  'gpt-3.5-turbo': 0.000002,
  'claude-3-opus-20240229': 0.000015,
  'claude-3-sonnet-20240229': 0.000003,
  'claude-3-haiku-20240307': 0.00000025,
  'default': 0.000002
}

// Validation schema
const OptimizeRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(10000, 'Prompt too long'),
  strategy: z.enum(['concise', 'creative', 'technical', 'multilingual']).optional().default('concise'),
  targetLanguage: z.string().length(2).optional(),
  model: z.string().optional().default('claude-3-haiku-20240307'),
  temperature: z.number().min(0).max(2).optional().default(0.3),
  includeMetrics: z.boolean().optional().default(true)
})

// Authentication middleware
async function authenticateApiKey(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const apiKey = authHeader?.replace('Bearer ', '')
  
  if (!apiKey) {
    throw new Error('API key required')
  }

  const supabase = await createClient()
  
  const { data: keyData, error } = await supabase
    .from('api_keys')
    .select(`
      *,
      companies (
        id,
        name,
        plan_type,
        monthly_limit,
        current_usage
      )
    `)
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .single()

  if (error || !keyData) {
    throw new Error('Invalid API key')
  }

  // Check if API key is expired
  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    throw new Error('API key expired')
  }

  // Check usage limits
  if (keyData.companies.current_usage >= keyData.companies.monthly_limit) {
    throw new Error('Monthly usage limit exceeded')
  }

  return keyData
}

// Update API key usage
async function updateApiKeyUsage(apiKeyId: string, companyId: string) {
  const supabase = await createClient()
  
  // Update API key usage count and last used
  await supabase
    .from('api_keys')
    .update({
      usage_count: supabase.raw('usage_count + 1'),
      last_used: new Date().toISOString()
    })
    .eq('id', apiKeyId)

  // Update company usage count
  await supabase.rpc('increment_company_usage', { company_uuid: companyId })
}

// Calculate cost savings
function calculateCostSavings(originalTokens: number, optimizedTokens: number, model: string): number {
  const tokensSaved = originalTokens - optimizedTokens
  const costPerToken = TOKEN_COSTS[model as keyof typeof TOKEN_COSTS] || TOKEN_COSTS.default
  return tokensSaved * costPerToken
}

// Log API usage
async function logApiUsage(
  companyId: string, 
  apiKeyId: string, 
  request: NextRequest, 
  response: NextResponse,
  processingTime: number
) {
  const supabase = await createClient()
  
  await supabase
    .from('api_usage_logs')
    .insert({
      company_id: companyId,
      api_key_id: apiKeyId,
      endpoint: '/api/v1/optimize-enterprise',
      method: 'POST',
      status_code: response.status,
      response_time_ms: processingTime,
      user_agent: request.headers.get('user-agent'),
      ip_address: request.ip || 'unknown'
    })
}

// POST /api/v1/optimize-enterprise - Enterprise optimization with tracking
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let companyId: string | null = null
  let apiKeyId: string | null = null
  
  try {
    // Authenticate API key
    const keyData = await authenticateApiKey(request)
    companyId = keyData.company_id
    apiKeyId = keyData.id

    // Parse and validate request
    const body = await request.json()
    const validation = OptimizeRequestSchema.safeParse(body)
    
    if (!validation.success) {
      const response = NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
      await logApiUsage(companyId, apiKeyId, request, response, Date.now() - startTime)
      return response
    }

    const { prompt, strategy, targetLanguage, model, temperature, includeMetrics } = validation.data

    // Generate unique optimization ID
    const optimizationId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Optimize the prompt
    const result = await promptOptimizer.optimizePrompt(prompt, {
      model,
      temperature,
      translateToChinese: targetLanguage === 'zh',
      strategy
    })

    if (!result.success) {
      const response = NextResponse.json(
        { 
          error: 'Optimization failed',
          details: result.error,
          id: optimizationId
        },
        { status: 500 }
      )
      await logApiUsage(companyId, apiKeyId, request, response, Date.now() - startTime)
      return response
    }

    const processingTime = Date.now() - startTime
    const originalTokens = result.input.tokens
    const optimizedTokens = result.output.tokens
    const tokensSaved = originalTokens - optimizedTokens
    const costSaved = calculateCostSavings(originalTokens, optimizedTokens, model)
    const reductionPercentage = Math.round(((tokensSaved / originalTokens) * 100) * 10) / 10

    // Store optimization in database
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('optimizations')
      .insert({
        company_id: companyId,
        api_key_id: apiKeyId,
        original_prompt: prompt,
        optimized_prompt: result.output.prompt,
        original_tokens: originalTokens,
        optimized_tokens: optimizedTokens,
        tokens_saved: tokensSaved,
        cost_saved: costSaved,
        strategy,
        model,
        processing_time_ms: processingTime,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.ip || 'unknown'
      })

    if (dbError) {
      console.error('Error storing optimization:', dbError)
      // Don't fail the request, just log the error
    }

    // Update API key and company usage
    await updateApiKeyUsage(apiKeyId, companyId)

    // Prepare response
    const response = NextResponse.json({
      id: optimizationId,
      originalPrompt: prompt,
      optimizedPrompt: result.output.prompt,
      strategy,
      timestamp: new Date().toISOString(),
      status: 'completed',
      company: {
        id: keyData.companies.id,
        name: keyData.companies.name,
        current_usage: keyData.companies.current_usage + 1,
        monthly_limit: keyData.companies.monthly_limit
      },
      ...(includeMetrics && {
        metrics: {
          originalTokens,
          optimizedTokens,
          tokensSaved,
          reductionPercentage,
          costSaved: Math.round(costSaved * 1000000) / 1000000, // Round to 6 decimal places
          processingTimeMs: processingTime,
          model
        }
      })
    })

    await logApiUsage(companyId, apiKeyId, request, response, processingTime)
    return response

  } catch (error) {
    const processingTime = Date.now() - startTime
    
    let errorMessage = 'Internal server error'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = error.message
        statusCode = 401
      } else if (error.message.includes('limit exceeded')) {
        errorMessage = error.message
        statusCode = 429
      } else {
        errorMessage = error.message
      }
    }

    const response = NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    )

    // Log API usage even for errors (if we have company info)
    if (companyId && apiKeyId) {
      await logApiUsage(companyId, apiKeyId, request, response, processingTime)
    }

    return response
  }
}

// GET endpoint for API documentation
export async function GET() {
  return NextResponse.json({
    name: 'PromptOptimizer Enterprise API',
    version: '1.0.0',
    description: 'Enterprise prompt optimization with usage tracking and billing',
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <api_key>',
      note: 'API keys are provided when you create a company account'
    },
    endpoints: {
      'POST /api/v1/optimize-enterprise': 'Optimize prompt with enterprise tracking',
      'GET /api/v1/companies/{id}': 'Get company information',
      'GET /api/v1/companies/{id}/usage': 'Get usage analytics',
      'GET /api/v1/analytics/usage': 'Get detailed usage statistics'
    },
    rateLimits: {
      free: '1,000 optimizations per month',
      pro: '50,000 optimizations per month',
      enterprise: 'Custom limits'
    },
    costCalculation: {
      note: 'Cost savings are calculated based on actual token usage and current model pricing',
      models: TOKEN_COSTS
    }
  })
}
