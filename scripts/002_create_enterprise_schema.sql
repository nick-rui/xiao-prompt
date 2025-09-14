-- Enterprise Prompt Optimization Database Schema
-- This script creates the complete database schema for the enterprise API

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  monthly_limit INTEGER DEFAULT 1000,
  current_usage INTEGER DEFAULT 0,
  billing_cycle_start DATE DEFAULT CURRENT_DATE,
  billing_email VARCHAR(255),
  company_size VARCHAR(50),
  industry VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  key_name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  last_used TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced optimizations table
CREATE TABLE IF NOT EXISTS optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
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
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage analytics table (daily aggregations)
CREATE TABLE IF NOT EXISTS usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  optimizations_count INTEGER DEFAULT 0,
  total_tokens_saved INTEGER DEFAULT 0,
  total_cost_saved DECIMAL(10,6) DEFAULT 0,
  avg_reduction_percentage DECIMAL(5,2) DEFAULT 0,
  peak_usage_hour INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, date)
);

-- Billing table
CREATE TABLE IF NOT EXISTS billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  base_cost DECIMAL(10,2) DEFAULT 0,
  usage_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) NOT NULL,
  optimizations_used INTEGER DEFAULT 0,
  optimizations_limit INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  stripe_invoice_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Company users table (for team management)
CREATE TABLE IF NOT EXISTS company_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'developer' CHECK (role IN ('admin', 'developer', 'viewer')),
  permissions JSONB DEFAULT '{}',
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage logs table (for detailed tracking)
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email);
CREATE INDEX IF NOT EXISTS idx_companies_plan_type ON companies(plan_type);
CREATE INDEX IF NOT EXISTS idx_api_keys_company_id ON api_keys(company_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_optimizations_company_id ON optimizations(company_id);
CREATE INDEX IF NOT EXISTS idx_optimizations_created_at ON optimizations(created_at);
CREATE INDEX IF NOT EXISTS idx_optimizations_tokens_saved ON optimizations(tokens_saved);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_company_date ON usage_analytics(company_id, date);
CREATE INDEX IF NOT EXISTS idx_billing_company_id ON billing(company_id);
CREATE INDEX IF NOT EXISTS idx_billing_period ON billing(billing_period_start, billing_period_end);
CREATE INDEX IF NOT EXISTS idx_company_users_company_id ON company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_user_id ON company_users(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_company_id ON api_usage_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_analytics_updated_at BEFORE UPDATE ON usage_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment company usage
CREATE OR REPLACE FUNCTION increment_company_usage(company_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE companies 
    SET current_usage = current_usage + 1,
        updated_at = NOW()
    WHERE id = company_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly usage (run monthly)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS VOID AS $$
BEGIN
    UPDATE companies 
    SET current_usage = 0,
        billing_cycle_start = CURRENT_DATE,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to aggregate daily usage analytics
CREATE OR REPLACE FUNCTION aggregate_daily_usage(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO usage_analytics (
        company_id,
        date,
        optimizations_count,
        total_tokens_saved,
        total_cost_saved,
        avg_reduction_percentage
    )
    SELECT 
        company_id,
        target_date,
        COUNT(*),
        SUM(tokens_saved),
        SUM(cost_saved),
        AVG((tokens_saved::DECIMAL / original_tokens) * 100)
    FROM optimizations 
    WHERE DATE(created_at) = target_date
    GROUP BY company_id
    ON CONFLICT (company_id, date) 
    DO UPDATE SET
        optimizations_count = EXCLUDED.optimizations_count,
        total_tokens_saved = EXCLUDED.total_tokens_saved,
        total_cost_saved = EXCLUDED.total_cost_saved,
        avg_reduction_percentage = EXCLUDED.avg_reduction_percentage,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO companies (name, email, plan_type, monthly_limit) VALUES
('Acme Corp', 'admin@acme.com', 'pro', 50000),
('StartupXYZ', 'founder@startupxyz.com', 'free', 1000),
('Enterprise Inc', 'cto@enterprise.com', 'enterprise', 1000000);

-- Sample API keys
INSERT INTO api_keys (company_id, key_name, api_key) VALUES
((SELECT id FROM companies WHERE email = 'admin@acme.com'), 'Production Key', 'pk_live_acme_prod_123456789'),
((SELECT id FROM companies WHERE email = 'founder@startupxyz.com'), 'Development Key', 'pk_test_startup_dev_987654321');

-- Comments for documentation
COMMENT ON TABLE companies IS 'Company accounts and subscription information';
COMMENT ON TABLE api_keys IS 'API keys for company authentication';
COMMENT ON TABLE optimizations IS 'Individual prompt optimization records';
COMMENT ON TABLE usage_analytics IS 'Daily aggregated usage statistics';
COMMENT ON TABLE billing IS 'Billing records and invoice information';
COMMENT ON TABLE company_users IS 'Team members and their roles within companies';
COMMENT ON TABLE api_usage_logs IS 'Detailed API usage logs for monitoring and debugging';
