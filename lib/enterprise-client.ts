/**
 * Enterprise Prompt Optimization Client SDK
 * 
 * This SDK provides a simple interface for integrating prompt optimization
 * into GPT wrapper applications with usage tracking and cost savings.
 */

export interface OptimizationRequest {
  prompt: string
  strategy?: 'concise' | 'creative' | 'technical' | 'multilingual'
  targetLanguage?: string
  model?: string
  temperature?: number
  includeMetrics?: boolean
}

export interface OptimizationResponse {
  id: string
  originalPrompt: string
  optimizedPrompt: string
  strategy: string
  timestamp: string
  status: 'completed' | 'failed'
  company: {
    id: string
    name: string
    current_usage: number
    monthly_limit: number
  }
  metrics?: {
    originalTokens: number
    optimizedTokens: number
    tokensSaved: number
    reductionPercentage: number
    costSaved: number
    processingTimeMs: number
    model: string
  }
}

export interface CompanyAnalytics {
  company: {
    id: string
    name: string
    plan_type: string
  }
  summary: {
    totalOptimizations: number
    totalTokensSaved: number
    totalCostSaved: number
    averageReduction: number
    currentUsage: number
    monthlyLimit: number
    usagePercentage: number
  }
  breakdown: {
    strategies: Array<{
      strategy: string
      count: number
      percentage: number
      tokensSaved: number
      costSaved: number
    }>
    models: Array<{
      model: string
      count: number
      percentage: number
      tokensSaved: number
      costSaved: number
    }>
  }
  trends: {
    dailyUsage: Array<{
      date: string
      optimizations: number
      tokensSaved: number
      costSaved: number
    }>
  }
}

export interface ApiKeyInfo {
  id: string
  key_name: string
  api_key: string
  last_used?: string
  usage_count: number
  is_active: boolean
  expires_at?: string
  created_at: string
}

export class PromptOptimizerEnterprise {
  private apiKey: string
  private baseUrl: string
  private companyId?: string

  constructor(apiKey: string, baseUrl: string = 'https://api.promptoptimizer.com') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
    
    // Extract company ID from API key format: pk_live_[company_id]_[random]
    const keyParts = apiKey.split('_')
    if (keyParts.length >= 3) {
      this.companyId = keyParts[2]
    }
  }

  /**
   * Optimize a prompt with enterprise tracking
   */
  async optimize(request: OptimizationRequest): Promise<OptimizationResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/optimize-enterprise`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error ${response.status}: ${error.error}`)
    }

    return response.json()
  }

  /**
   * Optimize multiple prompts in batch
   */
  async optimizeBatch(requests: OptimizationRequest[]): Promise<OptimizationResponse[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/optimize/batch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests,
        webhook_url: undefined // Add webhook URL if needed
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error ${response.status}: ${error.error}`)
    }

    const result = await response.json()
    return result.results
  }

  /**
   * Get company analytics
   */
  async getAnalytics(period: '7d' | '30d' | '90d' = '30d'): Promise<CompanyAnalytics> {
    if (!this.companyId) {
      throw new Error('Company ID not found in API key')
    }

    const response = await fetch(
      `${this.baseUrl}/api/v1/companies/${this.companyId}/analytics?period=${period}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error ${response.status}: ${error.error}`)
    }

    return response.json()
  }

  /**
   * Get company information
   */
  async getCompanyInfo(): Promise<any> {
    if (!this.companyId) {
      throw new Error('Company ID not found in API key')
    }

    const response = await fetch(`${this.baseUrl}/api/v1/companies/${this.companyId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error ${response.status}: ${error.error}`)
    }

    return response.json()
  }

  /**
   * List API keys for the company
   */
  async listApiKeys(): Promise<ApiKeyInfo[]> {
    if (!this.companyId) {
      throw new Error('Company ID not found in API key')
    }

    const response = await fetch(`${this.baseUrl}/api/v1/companies/${this.companyId}/api-keys`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error ${response.status}: ${error.error}`)
    }

    const result = await response.json()
    return result.api_keys
  }

  /**
   * Create a new API key
   */
  async createApiKey(keyName: string, expiresAt?: string): Promise<ApiKeyInfo> {
    if (!this.companyId) {
      throw new Error('Company ID not found in API key')
    }

    const response = await fetch(`${this.baseUrl}/api/v1/companies/${this.companyId}/api-keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key_name: keyName,
        expires_at: expiresAt
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`API Error ${response.status}: ${error.error}`)
    }

    const result = await response.json()
    return result.api_key
  }

  /**
   * Quick optimization helper for common use cases
   */
  async quickOptimize(prompt: string, model: string = 'claude-3-haiku-20240307'): Promise<{
    optimized: string
    tokensSaved: number
    costSaved: number
    reductionPercentage: number
  }> {
    const result = await this.optimize({
      prompt,
      strategy: 'concise',
      model,
      includeMetrics: true
    })

    if (!result.metrics) {
      throw new Error('Metrics not included in response')
    }

    return {
      optimized: result.optimizedPrompt,
      tokensSaved: result.metrics.tokensSaved,
      costSaved: result.metrics.costSaved,
      reductionPercentage: result.metrics.reductionPercentage
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(): Promise<{
    currentUsage: number
    monthlyLimit: number
    usagePercentage: number
    remainingUsage: number
  }> {
    const companyInfo = await this.getCompanyInfo()
    const { current_usage, monthly_limit } = companyInfo.company

    return {
      currentUsage: current_usage,
      monthlyLimit: monthly_limit,
      usagePercentage: (current_usage / monthly_limit) * 100,
      remainingUsage: monthly_limit - current_usage
    }
  }
}

// Utility functions for common integrations

/**
 * Create a GPT wrapper integration example
 */
export function createGPTWrapperIntegration(apiKey: string) {
  const optimizer = new PromptOptimizerEnterprise(apiKey)

  return {
    /**
     * Optimize prompts before sending to GPT
     */
    async optimizeBeforeGPT(prompt: string, model: string = 'claude-3-haiku-20240307') {
      try {
        const result = await optimizer.quickOptimize(prompt, model)
        
        // Log the optimization for tracking
        console.log(`Prompt optimized: ${result.tokensSaved} tokens saved (${result.reductionPercentage.toFixed(1)}% reduction)`)
        
        return {
          optimizedPrompt: result.optimized,
          metrics: {
            tokensSaved: result.tokensSaved,
            costSaved: result.costSaved,
            reductionPercentage: result.reductionPercentage
          }
        }
      } catch (error) {
        console.error('Optimization failed, using original prompt:', error)
        return {
          optimizedPrompt: prompt,
          metrics: null
        }
      }
    },

    /**
     * Get current usage and limits
     */
    async getUsageInfo() {
      return optimizer.getUsageStats()
    },

    /**
     * Get cost savings analytics
     */
    async getCostSavings() {
      const analytics = await optimizer.getAnalytics('30d')
      return {
        totalCostSaved: analytics.summary.totalCostSaved,
        totalOptimizations: analytics.summary.totalOptimizations,
        averageReduction: analytics.summary.averageReduction
      }
    }
  }
}

// Export default instance creator
export function createEnterpriseClient(apiKey: string, baseUrl?: string) {
  return new PromptOptimizerEnterprise(apiKey, baseUrl)
}
