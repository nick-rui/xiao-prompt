# Prompt Optimizer Enterprise Integration Guide

## 🚀 Quick Start

### 1. Create Company Account

```bash
curl -X POST https://api.promptoptimizer.com/api/v1/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Company Name",
    "email": "admin@yourcompany.com",
    "plan_type": "pro"
  }'
```

### 2. Get Your API Key

The API key will be returned in the response:
```json
{
  "success": true,
  "company": {
    "id": "company-uuid",
    "name": "Your Company Name",
    "plan_type": "pro"
  },
  "api_key": "pk_live_company-uuid_randomstring"
}
```

### 3. Start Optimizing

```javascript
import { createEnterpriseClient } from '@promptoptimizer/enterprise-sdk'

const optimizer = createEnterpriseClient('pk_live_company-uuid_randomstring')

const result = await optimizer.optimize({
  prompt: "Please create a beautiful image of a mountain landscape...",
  strategy: "concise",
  includeMetrics: true
})

console.log(`Saved ${result.metrics.tokensSaved} tokens (${result.metrics.reductionPercentage}% reduction)`)
```

## 🐍 Python Integration

### Install SDK

```bash
pip install promptoptimizer-enterprise
```

### Basic Usage

```python
from promptoptimizer import PromptOptimizerEnterprise

# Initialize client
optimizer = PromptOptimizerEnterprise(
    api_key="pk_live_company-uuid_randomstring"
)

# Optimize a prompt
result = optimizer.optimize(
    prompt="Please create a beautiful image of a mountain landscape...",
    strategy="concise",
    include_metrics=True
)

print(f"Saved {result.metrics.tokens_saved} tokens")
print(f"Cost saved: ${result.metrics.cost_saved:.4f}")
print(f"Optimized prompt: {result.optimized_prompt}")
```

### GPT Wrapper Integration

```python
import openai
from promptoptimizer import create_gpt_wrapper_integration

# Initialize optimizer
optimizer_integration = create_gpt_wrapper_integration(
    api_key="pk_live_company-uuid_randomstring"
)

def chat_with_optimization(user_prompt: str):
    # Optimize the prompt first
    optimization_result = optimizer_integration.optimize_before_gpt(user_prompt)
    
    # Use optimized prompt with GPT
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": optimization_result.optimized_prompt}
        ]
    )
    
    # Track the optimization
    if optimization_result.metrics:
        print(f"Optimization saved {optimization_result.metrics.tokens_saved} tokens")
    
    return response.choices[0].message.content

# Example usage
user_input = "I would be extremely grateful if you could please kindly create for me a truly magnificent and absolutely stunning image..."
optimized_response = chat_with_optimization(user_input)
```

## 🔧 Node.js Integration

### Install SDK

```bash
npm install @promptoptimizer/enterprise-sdk
```

### Basic Usage

```javascript
const { createEnterpriseClient } = require('@promptoptimizer/enterprise-sdk')

const optimizer = createEnterpriseClient('pk_live_company-uuid_randomstring')

async function optimizePrompt(prompt) {
  try {
    const result = await optimizer.optimize({
      prompt,
      strategy: 'concise',
      includeMetrics: true
    })
    
    return {
      optimized: result.optimizedPrompt,
      tokensSaved: result.metrics.tokensSaved,
      costSaved: result.metrics.costSaved
    }
  } catch (error) {
    console.error('Optimization failed:', error)
    return { optimized: prompt, tokensSaved: 0, costSaved: 0 }
  }
}
```

### Express.js Middleware

```javascript
const express = require('express')
const { createEnterpriseClient } = require('@promptoptimizer/enterprise-sdk')

const app = express()
const optimizer = createEnterpriseClient(process.env.PROMPT_OPTIMIZER_API_KEY)

// Middleware to optimize prompts
app.use('/api/chat', async (req, res, next) => {
  if (req.body.prompt) {
    try {
      const result = await optimizer.quickOptimize(req.body.prompt)
      req.body.optimizedPrompt = result.optimized
      req.body.optimizationMetrics = {
        tokensSaved: result.tokensSaved,
        costSaved: result.costSaved,
        reductionPercentage: result.reductionPercentage
      }
    } catch (error) {
      console.error('Optimization failed:', error)
      req.body.optimizedPrompt = req.body.prompt
    }
  }
  next()
})

// Your existing chat endpoint
app.post('/api/chat', async (req, res) => {
  const { optimizedPrompt, optimizationMetrics } = req.body
  
  // Send to your GPT API
  const gptResponse = await sendToGPT(optimizedPrompt)
  
  res.json({
    response: gptResponse,
    optimization: optimizationMetrics
  })
})
```

## 📊 Analytics Integration

### Track Usage and Savings

```javascript
// Get monthly analytics
const analytics = await optimizer.getAnalytics('30d')

console.log('Monthly Statistics:')
console.log(`- Total optimizations: ${analytics.summary.totalOptimizations}`)
console.log(`- Total tokens saved: ${analytics.summary.totalTokensSaved.toLocaleString()}`)
console.log(`- Total cost saved: $${analytics.summary.totalCostSaved.toFixed(2)}`)
console.log(`- Average reduction: ${analytics.summary.averageReduction.toFixed(1)}%`)

// Check usage limits
const usageStats = await optimizer.getUsageStats()
console.log(`Usage: ${usageStats.currentUsage}/${usageStats.monthlyLimit} (${usageStats.usagePercentage.toFixed(1)}%)`)
```

### Dashboard Integration

```javascript
// Create a simple dashboard endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [analytics, usageStats] = await Promise.all([
      optimizer.getAnalytics('30d'),
      optimizer.getUsageStats()
    ])
    
    res.json({
      summary: analytics.summary,
      usage: usageStats,
      trends: analytics.trends.dailyUsage.slice(-7) // Last 7 days
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

## 🔐 Security Best Practices

### 1. Environment Variables

```bash
# .env file
PROMPT_OPTIMIZER_API_KEY=pk_live_company-uuid_randomstring
PROMPT_OPTIMIZER_BASE_URL=https://api.promptoptimizer.com
```

### 2. API Key Rotation

```javascript
// Rotate API keys monthly
async function rotateApiKey() {
  const newKey = await optimizer.createApiKey('Monthly Rotation Key')
  
  // Update your environment/configuration
  process.env.PROMPT_OPTIMIZER_API_KEY = newKey.api_key
  
  // Deactivate old key
  await deactivateOldKey()
}
```

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit')

const optimizationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many optimization requests'
})

app.use('/api/optimize', optimizationLimiter)
```

## 📈 Cost Calculation Examples

### Token Cost Rates

| Model | Cost per 1K Tokens |
|-------|-------------------|
| GPT-4 | $0.03 |
| GPT-3.5 Turbo | $0.002 |
| Claude 3 Opus | $0.015 |
| Claude 3 Sonnet | $0.003 |
| Claude 3 Haiku | $0.00025 |

### ROI Calculation

```javascript
// Calculate ROI for your company
function calculateROI(analytics, subscriptionCost) {
  const monthlySavings = analytics.summary.totalCostSaved
  const roi = ((monthlySavings - subscriptionCost) / subscriptionCost) * 100
  
  return {
    monthlySavings,
    subscriptionCost,
    roi,
    breakEven: subscriptionCost / monthlySavings,
    recommendation: roi > 100 ? 'Continue subscription' : 'Consider upgrading'
  }
}

// Example
const analytics = await optimizer.getAnalytics('30d')
const roi = calculateROI(analytics, 99) // $99/month Pro plan

console.log(`ROI: ${roi.roi.toFixed(1)}%`)
console.log(`Monthly savings: $${roi.monthlySavings.toFixed(2)}`)
```

## 🚨 Error Handling

### Comprehensive Error Handling

```javascript
async function safeOptimize(prompt, fallbackToOriginal = true) {
  try {
    const result = await optimizer.optimize({
      prompt,
      strategy: 'concise',
      includeMetrics: true
    })
    
    return {
      success: true,
      optimized: result.optimizedPrompt,
      metrics: result.metrics
    }
  } catch (error) {
    console.error('Optimization failed:', error)
    
    if (fallbackToOriginal) {
      return {
        success: false,
        optimized: prompt,
        metrics: null,
        error: error.message
      }
    }
    
    throw error
  }
}
```

### Usage Limit Handling

```javascript
async function optimizeWithLimitCheck(prompt) {
  try {
    const usageStats = await optimizer.getUsageStats()
    
    if (usageStats.usagePercentage > 90) {
      console.warn('Approaching usage limit:', usageStats.usagePercentage)
      // Send alert to admin
      await sendUsageAlert(usageStats)
    }
    
    if (usageStats.usagePercentage >= 100) {
      throw new Error('Monthly usage limit exceeded')
    }
    
    return await optimizer.optimize({ prompt, includeMetrics: true })
  } catch (error) {
    if (error.message.includes('limit exceeded')) {
      // Handle limit exceeded
      return handleUsageLimitExceeded(prompt)
    }
    throw error
  }
}
```

## 📱 Webhook Integration

### Setup Webhooks for Batch Processing

```javascript
// Configure webhook endpoint
app.post('/webhooks/promptoptimizer', (req, res) => {
  const { batch_id, results, status } = req.body
  
  if (status === 'completed') {
    // Process batch results
    results.forEach(result => {
      console.log(`Optimization ${result.id}: ${result.metrics.tokensSaved} tokens saved`)
    })
  }
  
  res.json({ received: true })
})

// Submit batch optimization
const batchRequest = await optimizer.optimizeBatch([
  { prompt: "First prompt...", strategy: "concise" },
  { prompt: "Second prompt...", strategy: "technical" }
], {
  webhook_url: 'https://yourdomain.com/webhooks/promptoptimizer'
})
```

## 🎯 Best Practices

### 1. Prompt Strategy Selection

```javascript
function selectStrategy(prompt, context) {
  if (context.type === 'image_generation') {
    return 'concise' // Remove verbose descriptions
  } else if (context.type === 'code_generation') {
    return 'technical' // Focus on technical clarity
  } else if (context.language !== 'en') {
    return 'multilingual' // Handle non-English prompts
  }
  return 'concise' // Default to concise
}
```

### 2. Caching Optimizations

```javascript
const optimizationCache = new Map()

async function getOptimizedPrompt(prompt, strategy) {
  const cacheKey = `${prompt}_${strategy}`
  
  if (optimizationCache.has(cacheKey)) {
    return optimizationCache.get(cacheKey)
  }
  
  const result = await optimizer.optimize({ prompt, strategy })
  optimizationCache.set(cacheKey, result)
  
  return result
}
```

### 3. Batch Processing

```javascript
// Process prompts in batches for efficiency
async function processBatch(prompts, batchSize = 10) {
  const results = []
  
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize)
    const batchResults = await optimizer.optimizeBatch(batch)
    results.push(...batchResults)
  }
  
  return results
}
```

## 📞 Support

- **Documentation**: https://docs.promptoptimizer.com
- **API Reference**: https://api.promptoptimizer.com/docs
- **Support Email**: support@promptoptimizer.com
- **Status Page**: https://status.promptoptimizer.com

## 🚀 Getting Started Checklist

- [ ] Create company account
- [ ] Get API key
- [ ] Install SDK
- [ ] Test basic optimization
- [ ] Integrate into your GPT wrapper
- [ ] Set up analytics tracking
- [ ] Configure error handling
- [ ] Set up usage monitoring
- [ ] Create admin dashboard
- [ ] Test with production data
