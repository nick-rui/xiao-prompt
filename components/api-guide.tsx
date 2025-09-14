'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CodeIcon, KeyIcon, BarChart3Icon, ZapIcon, DollarSignIcon, GlobeIcon } from '@/components/icons'

export function APIGuide() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Prompt Optimizer API</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Free and open source prompt optimization for your GPT wrapper applications
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="px-4 py-2">
            <GlobeIcon className="h-4 w-4 mr-2" />
            REST API
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <GlobeIcon className="h-4 w-4 mr-2" />
            Open Source
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <BarChart3Icon className="h-4 w-4 mr-2" />
            Analytics
          </Badge>
        </div>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ZapIcon className="h-5 w-5" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get up and running in minutes with our free API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">1</div>
              <h3 className="font-semibold mb-2">Get Started</h3>
              <p className="text-sm text-muted-foreground">
                No registration needed - use the API directly
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">2</div>
              <h3 className="font-semibold mb-2">Install SDK</h3>
              <p className="text-sm text-muted-foreground">
                Copy our open source code to your application
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-2">3</div>
              <h3 className="font-semibold mb-2">Start Optimizing</h3>
              <p className="text-sm text-muted-foreground">
                Optimize prompts and track savings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CodeIcon className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>
            Core endpoints for prompt optimization and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-sm font-mono">/api/v1/optimize</code>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Optimize a prompt and get token savings analytics
              </p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -X POST http://localhost:3000/api/v1/optimize \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Please create a beautiful image...",
    "strategy": "concise",
    "includeMetrics": true
  }'`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="h-5 w-5" />
              Python Integration
            </CardTitle>
            <CardDescription>
              Integrate with Python applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`import requests

def optimize_prompt(prompt):
    response = requests.post(
        'http://localhost:3000/api/v1/optimize',
        json={
            'prompt': prompt,
            'strategy': 'concise',
            'includeMetrics': True
        }
    )
    return response.json()

result = optimize_prompt("Please create a beautiful image...")
print(f"Saved {result['metrics']['tokensSaved']} tokens")`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CodeIcon className="h-5 w-5" />
              JavaScript Integration
            </CardTitle>
            <CardDescription>
              Integrate with Node.js applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`async function optimizePrompt(prompt) {
  const response = await fetch('http://localhost:3000/api/v1/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      strategy: 'concise',
      includeMetrics: true
    })
  })
  
  const result = await response.json()
  console.log(\`Saved \${result.metrics.tokensSaved} tokens\`)
  return result.optimizedPrompt
}`}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Analytics & ROI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5" />
            Analytics & ROI Tracking
          </CardTitle>
          <CardDescription>
            Monitor your cost savings and optimization effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Key Metrics</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <ZapIcon className="h-4 w-4 text-primary" />
                  Total tokens saved
                </li>
                <li className="flex items-center gap-2">
                  <DollarSignIcon className="h-4 w-4 text-primary" />
                  Cost savings in dollars
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3Icon className="h-4 w-4 text-primary" />
                  Average reduction percentage
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Example Analytics</h4>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "summary": {
    "totalOptimizations": 1250,
    "totalTokensSaved": 125000,
    "totalCostSaved": 6.25,
    "averageReduction": 68.5
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Source */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5" />
            Open Source & Free
          </CardTitle>
          <CardDescription>
            Completely free to use with no limits or restrictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <div className="text-4xl font-bold text-primary mb-4">100% Free</div>
            <p className="text-lg text-muted-foreground mb-6">
              No API keys, no rate limits, no hidden costs. Use as much as you need!
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <GlobeIcon className="h-4 w-4 mr-2" />
                MIT License
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <CodeIcon className="h-4 w-4 mr-2" />
                Self-hosted
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
