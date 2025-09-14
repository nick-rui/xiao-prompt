# Enterprise Prompt Optimization API

## 🎯 **Business Model**

**Target Market**: Companies using GPT-wrapper applications who want to reduce AI costs
**Revenue Model**: 
- **Free Tier**: 1,000 optimizations/month
- **Pro Tier**: $99/month for 50,000 optimizations
- **Enterprise**: Custom pricing based on usage
- **Usage-based**: $0.01 per optimization over limits

## 🏗️ **API Architecture**

### **Core Endpoints**

#### **Company Management**
- `POST /api/v1/companies` - Create company account
- `GET /api/v1/companies/{id}` - Get company details
- `PUT /api/v1/companies/{id}` - Update company settings
- `GET /api/v1/companies/{id}/usage` - Get usage analytics

#### **API Key Management**
- `POST /api/v1/companies/{id}/api-keys` - Generate new API key
- `GET /api/v1/companies/{id}/api-keys` - List API keys
- `DELETE /api/v1/companies/{id}/api-keys/{keyId}` - Revoke API key

#### **Prompt Optimization (Enhanced)**
- `POST /api/v1/optimize` - Optimize prompt (requires API key)
- `POST /api/v1/optimize/batch` - Batch optimization
- `GET /api/v1/optimizations` - Get optimization history

#### **Analytics & Reporting**
- `GET /api/v1/analytics/usage` - Usage statistics
- `GET /api/v1/analytics/cost-savings` - Cost savings analysis
- `GET /api/v1/analytics/trends` - Usage trends over time
- `GET /api/v1/reports/monthly` - Monthly usage reports

#### **Billing & Usage**
- `GET /api/v1/billing/current` - Current billing status
- `GET /api/v1/billing/history` - Billing history
- `POST /api/v1/billing/upgrade` - Upgrade subscription

## 📊 **Database Schema**

### **Companies Table**
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
  monthly_limit INTEGER DEFAULT 1000,
  current_usage INTEGER DEFAULT 0,
  billing_cycle_start DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **API Keys Table**
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  key_name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  last_used TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Optimizations Table (Enhanced)**
```sql
CREATE TABLE optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  api_key_id UUID REFERENCES api_keys(id),
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  original_tokens INTEGER NOT NULL,
  optimized_tokens INTEGER NOT NULL,
  tokens_saved INTEGER NOT NULL,
  cost_saved DECIMAL(10,6) NOT NULL,
  strategy VARCHAR(50) NOT NULL,
  model VARCHAR(100),
  processing_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Usage Analytics Table**
```sql
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  date DATE NOT NULL,
  optimizations_count INTEGER DEFAULT 0,
  total_tokens_saved INTEGER DEFAULT 0,
  total_cost_saved DECIMAL(10,6) DEFAULT 0,
  avg_reduction_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, date)
);
```

## 💰 **Cost Calculation System**

### **Token Cost Rates**
```typescript
const TOKEN_COSTS = {
  'gpt-4': 0.00003, // $0.03 per 1K tokens
  'gpt-3.5-turbo': 0.000002, // $0.002 per 1K tokens
  'claude-3-opus': 0.000015, // $0.015 per 1K tokens
  'claude-3-sonnet': 0.000003, // $0.003 per 1K tokens
  'claude-3-haiku': 0.00000025, // $0.00025 per 1K tokens
  'default': 0.000002 // Default rate
}
```

### **Cost Savings Calculation**
```typescript
function calculateCostSavings(originalTokens: number, optimizedTokens: number, model: string) {
  const tokensSaved = originalTokens - optimizedTokens
  const costPerToken = TOKEN_COSTS[model] || TOKEN_COSTS.default
  return tokensSaved * costPerToken
}
```

## 🔐 **Authentication System**

### **API Key Format**
```
pk_live_[company_id]_[random_string]
pk_test_[company_id]_[random_string] (for testing)
```

### **Authentication Middleware**
```typescript
async function authenticateApiKey(request: Request) {
  const apiKey = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!apiKey) throw new Error('API key required')
  
  const keyData = await supabase
    .from('api_keys')
    .select('*, companies(*)')
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .single()
    
  if (!keyData) throw new Error('Invalid API key')
  
  // Update usage
  await updateApiKeyUsage(keyData.id)
  
  return keyData
}
```

## 📈 **Analytics & Reporting**

### **Key Metrics**
- **Token Savings**: Total tokens saved per month
- **Cost Savings**: Total money saved per month
- **Optimization Rate**: Percentage of prompts optimized
- **Usage Trends**: Daily/weekly/monthly usage patterns
- **ROI**: Return on investment for the service

### **Dashboard Features**
- **Real-time Usage**: Current month usage vs limits
- **Cost Savings Chart**: Visual representation of savings over time
- **Top Optimizations**: Most effective optimizations
- **Usage Alerts**: Notifications when approaching limits

## 🚀 **Integration Guide**

### **For GPT-Wrapper Applications**

```python
# Example integration
import requests

class PromptOptimizer:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.promptoptimizer.com/v1"
    
    def optimize_prompt(self, prompt, strategy="concise"):
        response = requests.post(
            f"{self.base_url}/optimize",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "prompt": prompt,
                "strategy": strategy,
                "includeMetrics": True
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                "optimized_prompt": data["optimizedPrompt"],
                "tokens_saved": data["metrics"]["tokensSaved"],
                "cost_saved": data["metrics"]["estimatedCostSavings"]
            }
        else:
            raise Exception(f"API Error: {response.status_code}")
```

### **Usage Tracking**
```python
def track_usage(company_id, optimization_result):
    # Send usage data to analytics
    analytics_data = {
        "company_id": company_id,
        "tokens_saved": optimization_result["tokens_saved"],
        "cost_saved": optimization_result["cost_saved"],
        "timestamp": datetime.utcnow()
    }
    
    # Store in database for billing and analytics
    store_usage_analytics(analytics_data)
```

## 💼 **Enterprise Features**

### **Multi-User Support**
- **Team Management**: Add/remove team members
- **Role-based Access**: Admin, Developer, Viewer roles
- **Usage Limits**: Per-user or per-team limits

### **Advanced Analytics**
- **Custom Reports**: Generate custom usage reports
- **Export Data**: CSV/JSON export of optimization data
- **API Usage**: Detailed API usage logs
- **Cost Analysis**: Deep dive into cost savings

### **White-label Options**
- **Custom Branding**: Company logo and colors
- **Custom Domain**: api.company.com instead of api.promptoptimizer.com
- **Custom Pricing**: Negotiated rates for high-volume usage

## 📊 **Pricing Tiers**

### **Free Tier**
- 1,000 optimizations/month
- Basic analytics
- Community support

### **Pro Tier ($99/month)**
- 50,000 optimizations/month
- Advanced analytics
- Priority support
- API access

### **Enterprise (Custom)**
- Unlimited optimizations
- Custom SLA
- Dedicated support
- White-label options
- Custom integrations

## 🎯 **Success Metrics**

### **For Companies**
- **ROI**: Measure actual cost savings vs subscription cost
- **Efficiency**: Reduction in AI token usage
- **Productivity**: Faster prompt optimization

### **For Platform**
- **Revenue Growth**: Monthly recurring revenue
- **Customer Retention**: Churn rate and lifetime value
- **Usage Growth**: Optimizations per customer over time
