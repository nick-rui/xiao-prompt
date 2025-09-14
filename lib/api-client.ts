/**
 * PromptOptimizer API Client SDK
 * 
 * A TypeScript SDK for interacting with the PromptOptimizer API
 */

export interface OptimizeRequest {
  prompt: string
  strategy?: 'concise' | 'creative' | 'technical' | 'multilingual'
  targetLanguage?: string
  model?: 'claude-3-haiku-20240307' | 'claude-3-sonnet-20240229' | 'claude-3-opus-20240229'
  temperature?: number
  includeMetrics?: boolean
  webhook?: string
}

export interface OptimizeResponse {
  id: string
  originalPrompt: string
  optimizedPrompt: string
  strategy: string
  timestamp: string
  status: 'completed' | 'failed' | 'processing'
  metrics?: {
    originalTokens: number
    optimizedTokens: number
    tokensSaved: number
    reductionPercentage: number
    estimatedCostSavings: number
    processingTimeMs: number
    model: string
  }
}

export interface BatchOptimizeRequest {
  prompts: Array<{
    id?: string
    content: string
    strategy?: 'concise' | 'creative' | 'technical' | 'multilingual'
    targetLanguage?: string
    model?: 'claude-3-haiku-20240307' | 'claude-3-sonnet-20240229' | 'claude-3-opus-20240229'
    temperature?: number
  }>
  options?: {
    parallel?: boolean
    maxConcurrency?: number
    webhook?: string
  }
}

export interface BatchOptimizeResponse {
  batchId: string
  totalPrompts: number
  successful: number
  failed: number
  processingTimeMs: number
  parallel: boolean
  maxConcurrency: number
  timestamp: string
  results: Array<{
    id: string
    originalPrompt: string
    optimizedPrompt?: string
    strategy: string
    status: 'completed' | 'failed'
    metrics?: {
      originalTokens: number
      optimizedTokens: number
      tokensSaved: number
      reductionPercentage: number
      model: string
    }
    error?: string
  }>
}

export interface UsageAnalytics {
  period: string
  dateRange: {
    start: string
    end: string
  }
  summary: {
    totalOptimizations: number
    totalTokensSaved: number
    totalMoneySaved: number
    totalEnergySaved: number
    totalEmissionsSaved: number
    averageReduction: number
  }
  breakdown: {
    strategies: Record<string, { count: number; percentage: number }>
    costBreakdown: Record<string, number>
    topUsers: Array<{
      user: string
      optimizations: number
      tokensSaved: number
    }>
  }
  trends: {
    dailyUsage: Array<{
      date: string
      count: number
    }>
  }
  timestamp: string
}

export interface ApiError {
  error: string
  details?: string | Array<{ field: string; message: string }>
  retryAfter?: number
}

export class PromptOptimizerClient {
  private apiKey: string
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(config: {
    apiKey: string
    baseUrl?: string
  }) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || '/api/v1'
    this.defaultHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(`API Error: ${error.error}`)
    }

    return response.json()
  }

  /**
   * Optimize a single prompt
   */
  async optimize(request: OptimizeRequest): Promise<OptimizeResponse> {
    return this.request<OptimizeResponse>('/optimize', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  /**
   * Optimize multiple prompts in a batch
   */
  async optimizeBatch(request: BatchOptimizeRequest): Promise<BatchOptimizeResponse> {
    return this.request<BatchOptimizeResponse>('/optimize/batch', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  /**
   * Get usage analytics
   */
  async getUsageAnalytics(options: {
    period?: '1d' | '7d' | '30d' | '90d'
    userId?: string
  } = {}): Promise<UsageAnalytics> {
    const params = new URLSearchParams()
    if (options.period) params.set('period', options.period)
    if (options.userId) params.set('userId', options.userId)
    
    const queryString = params.toString()
    const endpoint = `/analytics/usage${queryString ? `?${queryString}` : ''}`
    
    return this.request<UsageAnalytics>(endpoint, {
      method: 'GET'
    })
  }

  /**
   * Get API information
   */
  async getApiInfo(): Promise<{
    name: string
    version: string
    description: string
    endpoints: Record<string, string>
    authentication: Record<string, string>
    rateLimits: Record<string, string>
  }> {
    return this.request('/optimize', {
      method: 'GET'
    })
  }
}

/**
 * Create a new PromptOptimizer client instance
 */
export function createClient(config: {
  apiKey: string
  baseUrl?: string
}): PromptOptimizerClient {
  return new PromptOptimizerClient(config)
}

/**
 * Default client instance (for frontend usage)
 */
export const promptOptimizer = createClient({
  apiKey: 'demo', // In production, this would come from environment variables
  baseUrl: '/api/v1'
})

// Export types for external use
export type {
  OptimizeRequest,
  OptimizeResponse,
  BatchOptimizeRequest,
  BatchOptimizeResponse,
  UsageAnalytics,
  ApiError
}
