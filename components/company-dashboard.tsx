'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUpIcon, 
  DollarSignIcon, 
  ZapIcon, 
  BarChart3Icon,
  CopyIcon,
  CheckIcon,
  RefreshCwIcon
} from '@/components/icons'

interface CompanyAnalytics {
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

export function CompanyDashboard({ companyId }: { companyId: string }) {
  const [analytics, setAnalytics] = useState<CompanyAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/v1/companies/${companyId}/analytics?period=30d`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [companyId])

  const copyApiKey = async (apiKey: string) => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy API key:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCwIcon className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading analytics: {error}</p>
              <Button onClick={fetchAnalytics} className="mt-4">
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { company, summary, breakdown, trends } = analytics

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={company.plan_type === 'enterprise' ? 'default' : 'secondary'}>
              {company.plan_type.toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Company ID: {company.id}
            </span>
          </div>
        </div>
        <Button onClick={fetchAnalytics} variant="outline">
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Optimizations</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalOptimizations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Saved</CardTitle>
            <ZapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalTokensSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.averageReduction.toFixed(1)}% avg reduction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Saved</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary.totalCostSaved.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.currentUsage.toLocaleString()} / {summary.monthlyLimit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.usagePercentage.toFixed(1)}% of monthly limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>
            Current usage vs monthly limit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                summary.usagePercentage > 90 ? 'bg-red-500' : 
                summary.usagePercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(summary.usagePercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{summary.currentUsage.toLocaleString()} used</span>
            <span>{summary.monthlyLimit.toLocaleString()} limit</span>
          </div>
        </CardContent>
      </Card>

      {/* Strategy and Model Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Breakdown</CardTitle>
            <CardDescription>Optimizations by strategy type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakdown.strategies.map((strategy) => (
                <div key={strategy.strategy} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{strategy.strategy}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {strategy.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{strategy.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {strategy.tokensSaved.toLocaleString()} tokens
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Usage</CardTitle>
            <CardDescription>Optimizations by AI model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakdown.models.map((model) => (
                <div key={model.model} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{model.model}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {model.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{model.count}</div>
                    <div className="text-xs text-muted-foreground">
                      ${model.costSaved.toFixed(2)} saved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Usage Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage Trends</CardTitle>
          <CardDescription>Optimizations and savings over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trends.dailyUsage.slice(-7).map((day) => (
              <div key={day.date} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <div className="font-medium">
                    {new Date(day.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {day.optimizations} optimizations
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {day.tokensSaved.toLocaleString()} tokens saved
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${day.costSaved.toFixed(2)} saved
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Integration */}
      <Card>
        <CardHeader>
          <CardTitle>API Integration</CardTitle>
          <CardDescription>Integrate prompt optimization into your GPT wrapper</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Endpoint:</h4>
              <code className="block p-3 bg-muted rounded text-sm">
                POST https://api.promptoptimizer.com/v1/optimize-enterprise
              </code>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Authentication:</h4>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded text-sm">
                  Authorization: Bearer pk_live_{company.id}_[your-api-key]
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyApiKey(`pk_live_${company.id}_[your-api-key]`)}
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Example Request:</h4>
              <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
{`{
  "prompt": "Your AI prompt here...",
  "strategy": "concise",
  "includeMetrics": true
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
