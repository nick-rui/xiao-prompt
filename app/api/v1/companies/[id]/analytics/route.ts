import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/v1/companies/[id]/analytics - Get company analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const { searchParams } = new URL(request.url)
    
    const period = searchParams.get('period') || '30d'
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Check if company exists
    const { data: company } = await supabase
      .from('companies')
      .select('id, name, plan_type')
      .eq('id', id)
      .single()

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Calculate date range
    const now = new Date()
    let dateFrom: Date
    let dateTo: Date = now

    if (startDate && endDate) {
      dateFrom = new Date(startDate)
      dateTo = new Date(endDate)
    } else {
      switch (period) {
        case '7d':
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case '90d':
          dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }
    }

    // Get optimization statistics
    const { data: optimizations, error: optError } = await supabase
      .from('optimizations')
      .select(`
        original_tokens,
        optimized_tokens,
        tokens_saved,
        cost_saved,
        strategy,
        model,
        created_at
      `)
      .eq('company_id', id)
      .gte('created_at', dateFrom.toISOString())
      .lte('created_at', dateTo.toISOString())
      .order('created_at', { ascending: false })

    if (optError) {
      console.error('Error fetching optimizations:', optError)
      return NextResponse.json(
        { error: 'Failed to fetch optimization data' },
        { status: 500 }
      )
    }

    // Calculate summary statistics
    const totalOptimizations = optimizations?.length || 0
    const totalOriginalTokens = optimizations?.reduce((sum, opt) => sum + opt.original_tokens, 0) || 0
    const totalOptimizedTokens = optimizations?.reduce((sum, opt) => sum + opt.optimized_tokens, 0) || 0
    const totalTokensSaved = optimizations?.reduce((sum, opt) => sum + opt.tokens_saved, 0) || 0
    const totalCostSaved = optimizations?.reduce((sum, opt) => sum + parseFloat(opt.cost_saved.toString()), 0) || 0
    const averageReduction = totalOriginalTokens > 0 ? (totalTokensSaved / totalOriginalTokens) * 100 : 0

    // Strategy breakdown
    const strategyBreakdown = optimizations?.reduce((acc, opt) => {
      const strategy = opt.strategy
      if (!acc[strategy]) {
        acc[strategy] = { count: 0, tokensSaved: 0, costSaved: 0 }
      }
      acc[strategy].count++
      acc[strategy].tokensSaved += opt.tokens_saved
      acc[strategy].costSaved += parseFloat(opt.cost_saved.toString())
      return acc
    }, {} as Record<string, { count: number; tokensSaved: number; costSaved: number }>) || {}

    // Model breakdown
    const modelBreakdown = optimizations?.reduce((acc, opt) => {
      const model = opt.model || 'unknown'
      if (!acc[model]) {
        acc[model] = { count: 0, tokensSaved: 0, costSaved: 0 }
      }
      acc[model].count++
      acc[model].tokensSaved += opt.tokens_saved
      acc[model].costSaved += parseFloat(opt.cost_saved.toString())
      return acc
    }, {} as Record<string, { count: number; tokensSaved: number; costSaved: 0 }>) || {}

    // Daily usage trends
    const dailyUsage = optimizations?.reduce((acc, opt) => {
      const date = new Date(opt.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { 
          date, 
          optimizations: 0, 
          tokensSaved: 0, 
          costSaved: 0 
        }
      }
      acc[date].optimizations++
      acc[date].tokensSaved += opt.tokens_saved
      acc[date].costSaved += parseFloat(opt.cost_saved.toString())
      return acc
    }, {} as Record<string, { date: string; optimizations: number; tokensSaved: number; costSaved: number }>) || {}

    const dailyTrends = Object.values(dailyUsage).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    // Top optimizations by token savings
    const topOptimizations = optimizations
      ?.sort((a, b) => b.tokens_saved - a.tokens_saved)
      ?.slice(0, 10)
      ?.map(opt => ({
        originalTokens: opt.original_tokens,
        optimizedTokens: opt.optimized_tokens,
        tokensSaved: opt.tokens_saved,
        costSaved: parseFloat(opt.cost_saved.toString()),
        strategy: opt.strategy,
        model: opt.model,
        created_at: opt.created_at
      })) || []

    // Get current usage vs limits
    const { data: currentUsage } = await supabase
      .from('companies')
      .select('current_usage, monthly_limit, billing_cycle_start')
      .eq('id', id)
      .single()

    // Calculate usage percentage
    const usagePercentage = currentUsage ? 
      (currentUsage.current_usage / currentUsage.monthly_limit) * 100 : 0

    // Get billing information
    const { data: billing } = await supabase
      .from('billing')
      .select('*')
      .eq('company_id', id)
      .order('billing_period_start', { ascending: false })
      .limit(12) // Last 12 months

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        plan_type: company.plan_type
      },
      period: {
        start: dateFrom.toISOString(),
        end: dateTo.toISOString(),
        days: Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24))
      },
      summary: {
        totalOptimizations,
        totalOriginalTokens,
        totalOptimizedTokens,
        totalTokensSaved,
        totalCostSaved: Math.round(totalCostSaved * 1000000) / 1000000,
        averageReduction: Math.round(averageReduction * 100) / 100,
        currentUsage: currentUsage?.current_usage || 0,
        monthlyLimit: currentUsage?.monthly_limit || 0,
        usagePercentage: Math.round(usagePercentage * 100) / 100
      },
      breakdown: {
        strategies: Object.entries(strategyBreakdown).map(([strategy, data]) => ({
          strategy,
          count: data.count,
          percentage: totalOptimizations > 0 ? Math.round((data.count / totalOptimizations) * 100 * 100) / 100 : 0,
          tokensSaved: data.tokensSaved,
          costSaved: Math.round(data.costSaved * 1000000) / 1000000
        })),
        models: Object.entries(modelBreakdown).map(([model, data]) => ({
          model,
          count: data.count,
          percentage: totalOptimizations > 0 ? Math.round((data.count / totalOptimizations) * 100 * 100) / 100 : 0,
          tokensSaved: data.tokensSaved,
          costSaved: Math.round(data.costSaved * 1000000) / 1000000
        }))
      },
      trends: {
        dailyUsage: dailyTrends
      },
      topOptimizations,
      billing: billing || [],
      timestamp: new Date().toISOString()
    })

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
