# API Testing Scripts

This directory contains Python scripts to test the XiaoPrompt Optimizer API with mock calls to Anthropic Claude.

## 📁 Files

- `test_api_claude.py` - Main test script with database integration
- `requirements.txt` - Python dependencies
- `run_tests.py` - Python runner script with dependency checking
- `run_tests.sh` - Shell script runner for easy execution
- `TEST_API_README.md` - This documentation

## 🚀 Quick Start

### Option 1: Using the shell script (Recommended)
```bash
cd api-tests
./run_tests.sh
```

### Option 2: Using the Python runner
```bash
cd api-tests
python3 run_tests.py
```

### Option 3: Direct execution
```bash
cd api-tests
python3 test_api_claude.py
```

## 📋 Prerequisites

1. **Start the Next.js development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Make sure you have the Anthropic API key set:**
   ```bash
   export NEXT_PUBLIC_ANTHROPIC_API_KEY="your_anthropic_api_key_here"
   ```

3. **Install Python dependencies** (automatically handled by the runner scripts):
   ```bash
   pip install -r requirements.txt
   ```

## What the Test Does

The script will:

1. **Health Check**: Verify the API is running and accessible
2. **Single Prompt Test**: Test optimization of a verbose prompt
3. **Strategy Comparison**: Test different optimization strategies (concise, creative, technical, multilingual)
4. **Batch Test**: Check if batch optimization is available
5. **Metrics Analysis**: Display token savings, cost reduction, and processing time

## Expected Results

You should see output like:

```
🧪 XiaoPrompt Optimizer API Tester
==================================================
✅ API is running and accessible
📋 API Info: PromptOptimizer API v1.0.0

🚀 Testing prompt optimization...
📝 Original prompt: I would be extremely grateful if you could please kindly create for me, if it would not be too much trouble, a truly magnificent...
🎯 Strategy: concise
⏱️  Request took: 2.34 seconds
📊 Response status: 200
✅ Optimization successful!
🆔 Optimization ID: opt_1703123456_abc123def
📝 Optimized prompt: Create photorealistic mountain landscape, crystal clear blue lakes, snow-capped peaks, golden hour lighting, 8K, DSLR, desktop wallpaper
📊 Metrics:
   • Original tokens: 156
   • Optimized tokens: 23
   • Tokens saved: 133
   • Reduction: 85.3%
   • Cost saved: $0.000665
   • Processing time: 2340ms
```

## Troubleshooting

- **Connection Error**: Make sure the Next.js server is running on `http://localhost:3000`
- **API Key Error**: Ensure your Anthropic API key is properly set in the environment
- **Rate Limit**: The API has rate limiting (60 requests/minute for free tier)
- **Timeout**: Large prompts may take longer to process

## API Endpoints Tested

- `GET /api/v1/optimize` - API health check
- `POST /api/v1/optimize` - Single prompt optimization
- `GET /api/v1/optimize/batch` - Batch optimization check (if available)
