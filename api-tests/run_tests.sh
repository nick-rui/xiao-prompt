#!/bin/bash
# Simple shell script to run API tests

echo "🚀 Starting XiaoPrompt API Tests..."
echo "=================================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "test_api_claude.py" ]; then
    echo "❌ Error: test_api_claude.py not found in current directory"
    echo "   Please run this script from the api-tests directory"
    exit 1
fi

# Install requirements if needed
echo "📦 Checking dependencies..."
python3 -c "import requests" 2>/dev/null || {
    echo "📦 Installing required dependencies..."
    python3 -m pip install -r requirements.txt
    echo "✅ Dependencies installed!"
}

# Run the tests
echo ""
echo "🧪 Running API tests..."
echo "--------------------------------------------------"
python3 test_api_claude.py

echo ""
echo "🎉 Tests completed!"
