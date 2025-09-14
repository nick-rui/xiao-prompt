'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/api-client'

export default function ApiTestPage() {
  const [apiKey, setApiKey] = useState('demo')
  const [prompt, setPrompt] = useState('Create a beautiful sunset landscape with dramatic clouds and warm golden colors')
  const [strategy, setStrategy] = useState<'concise' | 'creative' | 'technical' | 'multilingual'>('concise')
  const [targetLanguage, setTargetLanguage] = useState('')
  const [model, setModel] = useState('claude-3-haiku-20240307')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const client = createClient({ apiKey, baseUrl: '/api/v1' })

  const testOptimization = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await client.optimize({
        prompt,
        strategy,
        targetLanguage: targetLanguage || undefined,
        model: model as any,
        includeMetrics: true
      })

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const testBatchOptimization = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await client.optimizeBatch({
        prompts: [
          {
            id: 'test_1',
            content: 'Create a beautiful sunset landscape',
            strategy: 'concise'
          },
          {
            id: 'test_2',
            content: 'Write a creative story about a dragon',
            strategy: 'creative'
          }
        ],
        options: {
          parallel: true,
          maxConcurrency: 2
        }
      })

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const testAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await client.getUsageAnalytics({ period: '30d' })
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">PromptOptimizer API Tester</h1>
          <p className="text-muted-foreground text-lg">
            Test the PromptOptimizer API endpoints and explore the new v1 features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure your API settings and test parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Test Prompt</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt to optimize"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Select value={strategy} onValueChange={(value: any) => setStrategy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="multilingual">Multilingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                      <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetLanguage">Target Language (optional)</Label>
                <Input
                  id="targetLanguage"
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  placeholder="e.g., zh, es, fr, de"
                />
              </div>
            </CardContent>
          </Card>

          {/* API Test Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Test different API endpoints and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testOptimization}
                disabled={isLoading || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Optimizing...' : 'Test Single Optimization'}
              </Button>

              <Button
                onClick={testBatchOptimization}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Processing...' : 'Test Batch Optimization'}
              </Button>

              <Button
                onClick={testAnalytics}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Loading...' : 'Test Analytics API'}
              </Button>

              <Separator />

              <div className="space-y-2">
                <Label>API Documentation</Label>
                <Button
                  onClick={() => window.open('/api/v1/docs', '_blank')}
                  variant="ghost"
                  className="w-full"
                >
                  View OpenAPI Spec
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {(result || error) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                API Response
                {result?.id && <Badge variant="secondary">{result.id}</Badge>}
                {result?.batchId && <Badge variant="secondary">{result.batchId}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <h4 className="font-semibold text-destructive mb-2">Error</h4>
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {result?.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.metrics.originalTokens}</div>
                        <div className="text-xs text-muted-foreground">Original Tokens</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{result.metrics.optimizedTokens}</div>
                        <div className="text-xs text-muted-foreground">Optimized Tokens</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.metrics.tokensSaved}</div>
                        <div className="text-xs text-muted-foreground">Tokens Saved</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.metrics.reductionPercentage}%</div>
                        <div className="text-xs text-muted-foreground">Reduction</div>
                      </div>
                    </div>
                  )}

                  {result?.originalPrompt && (
                    <div className="space-y-2">
                      <Label>Original Prompt</Label>
                      <div className="p-3 bg-muted rounded-lg text-sm">
                        {result.originalPrompt}
                      </div>
                    </div>
                  )}

                  {result?.optimizedPrompt && (
                    <div className="space-y-2">
                      <Label>Optimized Prompt</Label>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                        {result.optimizedPrompt}
                      </div>
                    </div>
                  )}

                  {result?.results && (
                    <div className="space-y-2">
                      <Label>Batch Results ({result.successful}/{result.totalPrompts} successful)</Label>
                      <div className="space-y-2">
                        {result.results.map((item: any, index: number) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant={item.status === 'completed' ? 'default' : 'destructive'}>
                                {item.status}
                              </Badge>
                              {item.metrics && (
                                <span className="text-sm text-muted-foreground">
                                  {item.metrics.reductionPercentage}% reduction
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              <div className="font-medium">Original:</div>
                              <div className="text-muted-foreground mb-2">{item.originalPrompt}</div>
                              {item.optimizedPrompt && (
                                <>
                                  <div className="font-medium">Optimized:</div>
                                  <div className="text-green-600">{item.optimizedPrompt}</div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium">Raw Response</summary>
                    <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
