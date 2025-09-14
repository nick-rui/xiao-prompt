# PromptOptimizer API Architecture

## 🎯 **API Overview**

**Base URL**: `https://api.promptoptimizer.com/v1`

**Authentication**: JWT Bearer Token or API Key

## 📋 **Core Endpoints**

### **Optimization Endpoints**

#### `POST /optimize`
Optimize a single prompt with various strategies.

**Request:**
```json
{
  "prompt": "Create a beautiful sunset landscape...",
  "strategy": "concise" | "creative" | "technical" | "multilingual",
  "targetLanguage": "zh" | "es" | "fr" | "de",
  "model": "claude-3-haiku" | "claude-3-sonnet" | "claude-3-opus",
  "temperature": 0.3,
  "maxTokens": 1000,
  "includeMetrics": true,
  "webhook": "https://your-app.com/webhook"
}
```

**Response:**
```json
{
  "id": "opt_123456789",
  "originalPrompt": "Create a beautiful sunset landscape...",
  "optimizedPrompt": "Sunset landscape: golden hour, dramatic clouds, warm tones",
  "metrics": {
    "originalTokens": 45,
    "optimizedTokens": 12,
    "tokensSaved": 33,
    "reductionPercentage": 73.3,
    "estimatedCostSavings": 0.000165,
    "processingTimeMs": 1250
  },
  "strategy": "concise",
  "timestamp": "2024-01-15T10:30:00Z",
  "status": "completed"
}
```

#### `POST /optimize/batch`
Optimize multiple prompts in a single request.

**Request:**
```json
{
  "prompts": [
    {
      "id": "prompt_1",
      "content": "Create a beautiful sunset...",
      "strategy": "concise"
    },
    {
      "id": "prompt_2", 
      "content": "Write a creative story about...",
      "strategy": "creative"
    }
  ],
  "options": {
    "parallel": true,
    "maxConcurrency": 5
  }
}
```

#### `GET /optimize/{id}`
Get optimization result by ID.

#### `POST /optimize/compare`
Compare multiple optimization strategies for the same prompt.

### **Analytics Endpoints**

#### `GET /analytics/usage`
Get usage statistics and metrics.

**Response:**
```json
{
  "period": "30d",
  "totalOptimizations": 15420,
  "totalTokensSaved": 234567,
  "totalCostSavings": 12.34,
  "averageReduction": 68.5,
  "topStrategies": [
    { "strategy": "concise", "usage": 45.2 },
    { "strategy": "creative", "usage": 23.1 }
  ],
  "costBreakdown": {
    "anthropic": 8.45,
    "openai": 3.89
  }
}
```

#### `GET /analytics/performance`
Get performance benchmarks and insights.

### **Template Endpoints**

#### `GET /templates`
Get pre-built optimization templates.

#### `POST /templates`
Create custom optimization templates.

#### `GET /templates/{id}`
Get specific template details.

### **User Management**

#### `POST /auth/register`
Register new API user.

#### `POST /auth/login`
Authenticate and get JWT token.

#### `GET /users/profile`
Get user profile and usage limits.

#### `PUT /users/profile`
Update user profile.

### **Webhook Management**

#### `POST /webhooks`
Register webhook for async notifications.

#### `GET /webhooks`
List registered webhooks.

#### `DELETE /webhooks/{id}`
Remove webhook.

## 🔐 **Authentication**

### **API Key Authentication**
```bash
curl -H "Authorization: Bearer pk_live_123456789" \
     -H "Content-Type: application/json" \
     https://api.promptoptimizer.com/v1/optimize
```

### **JWT Authentication**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     -H "Content-Type: application/json" \
     https://api.promptoptimizer.com/v1/optimize
```

## 📊 **Rate Limiting**

| Plan | Requests/min | Requests/day | Concurrent |
|------|--------------|--------------|------------|
| Free | 60 | 1,000 | 2 |
| Pro | 300 | 50,000 | 10 |
| Enterprise | 1,000 | 500,000 | 50 |

## 🌐 **Webhooks**

### **Optimization Complete Webhook**
```json
{
  "event": "optimization.completed",
  "data": {
    "id": "opt_123456789",
    "status": "completed",
    "metrics": { ... },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### **Error Webhook**
```json
{
  "event": "optimization.failed",
  "data": {
    "id": "opt_123456789",
    "error": "Rate limit exceeded",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 📱 **SDK Examples**

### **JavaScript/TypeScript**
```typescript
import { PromptOptimizer } from '@promptoptimizer/sdk'

const client = new PromptOptimizer({
  apiKey: 'pk_live_123456789',
  baseUrl: 'https://api.promptoptimizer.com/v1'
})

const result = await client.optimize({
  prompt: 'Create a beautiful sunset landscape...',
  strategy: 'concise'
})
```

### **Python**
```python
from promptoptimizer import PromptOptimizer

client = PromptOptimizer(api_key='pk_live_123456789')

result = client.optimize(
    prompt='Create a beautiful sunset landscape...',
    strategy='concise'
)
```

### **cURL**
```bash
curl -X POST https://api.promptoptimizer.com/v1/optimize \
  -H "Authorization: Bearer pk_live_123456789" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a beautiful sunset landscape...",
    "strategy": "concise"
  }'
```

## 🚀 **Implementation Plan**

### **Phase 1: Core API (Week 1-2)**
- [ ] API versioning system
- [ ] Authentication & authorization
- [ ] Core optimization endpoints
- [ ] Error handling & validation
- [ ] Basic rate limiting

### **Phase 2: Advanced Features (Week 3-4)**
- [ ] Batch processing
- [ ] Webhook system
- [ ] Analytics endpoints
- [ ] Template management
- [ ] Advanced rate limiting

### **Phase 3: Developer Experience (Week 5-6)**
- [ ] OpenAPI documentation
- [ ] SDK development
- [ ] Interactive API explorer
- [ ] Developer portal
- [ ] Usage analytics

### **Phase 4: Enterprise Features (Week 7-8)**
- [ ] Multi-tenant support
- [ ] Advanced analytics
- [ ] Custom optimization strategies
- [ ] White-label options
- [ ] SLA guarantees
