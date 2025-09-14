-- Create the prompts table for storing optimization results
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  original_tokens INTEGER NOT NULL,
  optimized_tokens INTEGER NOT NULL,
  tokens_saved INTEGER NOT NULL,
  money_saved DECIMAL(10, 4) NOT NULL,
  energy_saved DECIMAL(10, 4) NOT NULL,
  emissions_saved DECIMAL(10, 4) NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO public.prompts (
  original_prompt,
  optimized_prompt,
  original_tokens,
  optimized_tokens,
  tokens_saved,
  money_saved,
  energy_saved,
  emissions_saved,
  user_name
) VALUES
(
  'Please analyze the following data and provide a comprehensive report with detailed insights, recommendations, and actionable steps for improvement across all metrics and KPIs.',
  'Analyze this data and provide insights, recommendations, and improvement steps.',
  45,
  15,
  30,
  0.0045,
  0.0012,
  0.0008,
  'Sarah Chen'
),
(
  'I need you to help me understand the complex relationships between various factors in this dataset and how they might impact our business outcomes in the short and long term.',
  'Explain dataset relationships and business impact (short/long term).',
  38,
  12,
  26,
  0.0039,
  0.0010,
  0.0007,
  'Mike Rodriguez'
),
(
  'Can you please take a look at this code and tell me what might be wrong with it, including any potential bugs, performance issues, or best practice violations?',
  'Review this code for bugs, performance issues, and best practices.',
  32,
  14,
  18,
  0.0027,
  0.0007,
  0.0005,
  'Alex Kim'
),
(
  'I would like you to generate a detailed marketing strategy that includes target audience analysis, competitive research, channel recommendations, and budget allocation suggestions.',
  'Create marketing strategy: audience analysis, competitive research, channels, budget.',
  35,
  16,
  19,
  0.0029,
  0.0008,
  0.0005,
  'Emma Thompson'
),
(
  'Please help me write a professional email to our clients explaining the new features we have launched and how they can benefit from using them in their daily workflows.',
  'Write client email about new features and their workflow benefits.',
  31,
  13,
  18,
  0.0027,
  0.0007,
  0.0005,
  'David Park'
),
(
  'I need assistance with creating a comprehensive project plan that includes timeline, resource allocation, risk assessment, and milestone tracking for our upcoming product launch.',
  'Create project plan: timeline, resources, risks, milestones for product launch.',
  33,
  15,
  18,
  0.0027,
  0.0007,
  0.0005,
  'Lisa Wang'
),
(
  'Could you analyze this financial data and provide insights into trends, anomalies, and recommendations for improving our revenue and reducing costs?',
  'Analyze financial data for trends, anomalies, and revenue/cost recommendations.',
  28,
  16,
  12,
  0.0018,
  0.0005,
  0.0003,
  'James Wilson'
),
(
  'Please review this document and provide feedback on clarity, structure, grammar, and overall effectiveness in communicating the intended message to our stakeholders.',
  'Review document for clarity, structure, grammar, and stakeholder communication effectiveness.',
  29,
  17,
  12,
  0.0018,
  0.0005,
  0.0003,
  'Rachel Green'
);
