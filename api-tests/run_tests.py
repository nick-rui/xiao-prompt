#!/usr/bin/env python3
"""
Simple runner script for API tests
This script runs the main test suite from the api-tests directory
"""

import sys
import os
import subprocess

def main():
    """Run the API tests"""
    print("🚀 Starting XiaoPrompt API Tests...")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('test_api_claude.py'):
        print("❌ Error: test_api_claude.py not found in current directory")
        print("   Please run this script from the api-tests directory")
        sys.exit(1)
    
    # Check if requirements are installed
    try:
        import requests
    except ImportError:
        print("📦 Installing required dependencies...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependencies installed!")
    
    # Run the main test script
    print("\n🧪 Running API tests...")
    print("-" * 50)
    
    try:
        # Import and run the test
        from test_api_claude import main as run_tests
        run_tests()
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
