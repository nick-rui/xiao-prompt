import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Extract API key from Authorization header
    const authHeader = request.headers.get('authorization')
    const apiKey = authHeader?.replace('Bearer ', '') || 'demo'
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const userId = searchParams.get('userId')
    
    // Create Supabase client
    const supabase = await createClient()
    
    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    
    // Build query based on filters
    let query = supabase
      .from('prompts')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
    
    // Filter by user if provided
    if (userId) {
      query = query.eq('user_name', userId)
    }
    
    const { data: prompts, error } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      )
    }
    
    // Calculate metrics
    const totalOptimizations = prompts?.length || 0
    const totalTokensSaved = prompts?.reduce((sum, p) => sum + (p.tokens_saved || 0), 0) || 0
    const totalMoneySaved = prompts?.reduce((sum, p) => sum + (p.money_saved || 0), 0) || 0
    const totalEnergySaved = prompts?.reduce((sum, p) => sum + (p.energy_saved || 0), 0) || 0
    const totalEmissionsSaved = prompts?.reduce((sum, p) => sum + (p.emissions_saved || 0), 0) || 0
    
    // Calculate average reduction percentage
    const validPrompts = prompts?.filter(p => p.original_tokens > 0) || []
    const averageReduction = validPrompts.length > 0 
      ? validPrompts.reduce((sum, p) => {
          const reduction = ((p.original_tokens - p.optimized_tokens) / p.original_tokens) * 100
          return sum + reduction
        }, 0) / validPrompts.length
      : 0
    
    // Get strategy breakdown (mock data for now)
    const strategyBreakdown = {
      'concise': { count: Math.floor(totalOptimizations * 0.45), percentage: 45.2 },
      'creative': { count: Math.floor(totalOptimizations * 0.23), percentage: 23.1 },
      'technical': { count: Math.floor(totalOptimizations * 0.18), percentage: 18.0 },
      'multilingual': { count: Math.floor(totalOptimizations * 0.14), percentage: 13.7 }
    }
    
    // Get daily usage trends
    const dailyUsage = {}
    prompts?.forEach(prompt => {
      const date = new Date(prompt.created_at).toISOString().split('T')[0]
      dailyUsage[date] = (dailyUsage[date] || 0) + 1
    })
    
    // Get top users
    const userStats = {}
    prompts?.forEach(prompt => {
      const user = prompt.user_name || 'Anonymous'
      if (!userStats[user]) {
        userStats[user] = { optimizations: 0, tokensSaved: 0 }
      }
      userStats[user].optimizations++
      userStats[user].tokensSaved += prompt.tokens_saved || 0
    })
    
    const topUsers = Object.entries(userStats)
      .map(([user, stats]) => ({ user, ...stats }))
      .sort((a, b) => b.optimizations - a.optimizations)
      .slice(0, 10)
    
    // Calculate cost breakdown (mock data)
    const costBreakdown = {
      'anthropic': totalMoneySaved * 0.7,
      'openai': totalMoneySaved * 0.2,
      'other': totalMoneySaved * 0.1
    }
    
    const response = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString()
      },
      summary: {
        totalOptimizations,
        totalTokensSaved,
        totalMoneySaved: Math.round(totalMoneySaved * 100) / 100,
        totalEnergySaved: Math.round(totalEnergySaved * 100) / 100,
        totalEmissionsSaved: Math.round(totalEmissionsSaved * 100) / 100,
        averageReduction: Math.round(averageReduction * 10) / 10
      },
      breakdown: {
        strategies: strategyBreakdown,
        costBreakdown,
        topUsers
      },
      trends: {
        dailyUsage: Object.entries(dailyUsage).map(([date, count]) => ({ date, count }))
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Analytics API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for analytics API documentation
export async function OPTIONS() {
  return NextResponse.json({
    endpoint: 'GET /api/v1/analytics/usage',
    description: 'Get usage statistics and analytics',
    parameters: {
      period: '1d | 7d | 30d | 90d (default: 30d)',
      userId: 'Filter by specific user (optional)'
    },
    example: 'GET /api/v1/analytics/usage?period=7d&userId=john_doe',
    rateLimit: '60 requests per minute'
  })
}
