#!/usr/bin/env python3
"""
Test script for XiaoPrompt Optimizer API
This script makes a mock call to test the API integration with Anthropic Claude
"""

import requests
import json
import time
from typing import Dict, Any
from test_constants import calculate_energy_saved, calculate_emissions_saved, calculate_energy_cost_savings, calculate_money_saved

class PromptOptimizerAPITester:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.api_endpoint = f"{base_url}/api/v1/optimize"
        
    def test_api_health(self) -> bool:
        """Test if the API is running and accessible"""
        try:
            response = requests.get(f"{self.base_url}/api/v1/optimize", timeout=10)
            if response.status_code == 200:
                print("✅ API is running and accessible")
                api_info = response.json()
                print(f"📋 API Info: {api_info.get('name', 'Unknown')} v{api_info.get('version', 'Unknown')}")
                return True
            else:
                print(f"❌ API returned status code: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to connect to API: {e}")
            return False
    
    def test_optimize_prompt(self, prompt: str, strategy: str = "concise") -> Dict[str, Any]:
        """Test the prompt optimization endpoint"""
        print(f"\n🚀 Testing prompt optimization...")
        print(f"📝 Original prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")
        print(f"🎯 Strategy: {strategy}")
        
        payload = {
            "prompt": prompt,
            "strategy": strategy,
            "targetLanguage": "zh",  # Enable Chinese translation
            "includeMetrics": True,
            "model": "claude-3-haiku-20240307",
            "temperature": 0.3
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer demo"  # Using demo key as shown in the code
        }
        
        try:
            start_time = time.time()
            response = requests.post(
                self.api_endpoint,
                json=payload,
                headers=headers,
                timeout=30
            )
            end_time = time.time()
            
            print(f"⏱️  Request took: {end_time - start_time:.2f} seconds")
            print(f"📊 Response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Optimization successful!")
                print(f"🆔 Optimization ID: {result.get('id', 'N/A')}")
                
                # Display original and optimized prompts nicely
                print(f"\n📝 ORIGINAL PROMPT:")
                print("=" * 60)
                original_prompt = result.get('originalPrompt', 'N/A')
                print(f"{original_prompt}")
                print(f"📏 Length: {len(original_prompt)} characters")
                
                print(f"\n✨ OPTIMIZED PROMPT:")
                print("=" * 60)
                optimized_prompt = result.get('optimizedPrompt', 'N/A')
                print(f"{optimized_prompt}")
                print(f"📏 Length: {len(optimized_prompt)} characters")
                
                # Calculate character reduction
                char_reduction = len(original_prompt) - len(optimized_prompt)
                char_reduction_pct = (char_reduction / len(original_prompt)) * 100 if len(original_prompt) > 0 else 0
                print(f"📉 Character reduction: {char_reduction} ({char_reduction_pct:.1f}%)")
                
                if 'metrics' in result:
                    metrics = result['metrics']
                    print(f"\n📊 TOKEN METRICS:")
                    print("=" * 60)
                    print(f"   • Original tokens: {metrics.get('originalTokens', 'N/A')}")
                    print(f"   • Optimized tokens: {metrics.get('optimizedTokens', 'N/A')}")
                    print(f"   • Tokens saved: {metrics.get('tokensSaved', 'N/A')}")
                    print(f"   • Reduction: {metrics.get('reductionPercentage', 'N/A')}%")
                    print(f"   • Cost saved: ${metrics.get('estimatedCostSavings', 'N/A'):.6f}")
                    print(f"   • Processing time: {metrics.get('processingTimeMs', 'N/A')}ms")
                
                # Save to database
                self.save_to_database(result, strategy)
                
                return result
            else:
                print(f"❌ Optimization failed with status {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"Error details: {error_data}")
                except:
                    print(f"Error response: {response.text}")
                return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
            return {}
    
    def save_to_database(self, result: Dict[str, Any], strategy: str) -> None:
        """Save optimization result to the database via the save-prompt API"""
        try:
            print(f"\n💾 Saving to database...")
            
            # Extract metrics from the result
            metrics = result.get('metrics', {})
            original_tokens = metrics.get('originalTokens', 0)
            optimized_tokens = metrics.get('optimizedTokens', 0)
            tokens_saved = metrics.get('tokensSaved', 0)
            cost_saved = metrics.get('estimatedCostSavings', 0)
            
            # Calculate energy and emissions savings using centralized constants
            # Money saved: $0.002 per token (as requested)
            # Energy saved: 0.04 kWh per 1000 tokens (from sample data)
            # Emissions: Using original rate (0.0000267 kg CO2 per token)
            energy_saved = calculate_energy_saved(tokens_saved)
            emissions_saved = calculate_emissions_saved(tokens_saved)
            # Energy costs calculated using Massachusetts average rate of $0.305/kWh
            
            save_payload = {
                "original_prompt": result.get('originalPrompt', ''),
                "optimized_prompt": result.get('optimizedPrompt', ''),
                "original_tokens": original_tokens,
                "optimized_tokens": optimized_tokens,
                "tokens_saved": tokens_saved,
                "money_saved": cost_saved,
                "energy_saved": energy_saved,
                "emissions_saved": emissions_saved,
                "user_name": f"API Test - {strategy.title()}"
            }
            
            save_response = requests.post(
                f"{self.base_url}/api/save-prompt",
                json=save_payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if save_response.status_code == 200:
                save_data = save_response.json()
                print(f"✅ Successfully saved to database!")
                print(f"   • Database ID: {save_data.get('data', {}).get('id', 'N/A')}")
                print(f"   • User: {save_payload['user_name']}")
                print(f"   • Energy saved: {energy_saved:.6f} kWh")
                print(f"   • Emissions saved: {emissions_saved:.6f} kg CO2")
            else:
                print(f"❌ Failed to save to database: {save_response.status_code}")
                try:
                    error_data = save_response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {save_response.text}")
                    
        except requests.exceptions.RequestException as e:
            print(f"❌ Database save failed: {e}")
        except Exception as e:
            print(f"❌ Unexpected error saving to database: {e}")
    
    def test_multiple_strategies(self, prompt: str) -> None:
        """Test different optimization strategies"""
        strategies = ["concise", "creative", "technical", "multilingual"]
        
        print(f"\n🔄 Testing multiple strategies for the same prompt...")
        print(f"📝 Prompt: {prompt[:100]}{'...' if len(prompt) > 100 else ''}")
        
        results = {}
        for strategy in strategies:
            print(f"\n--- Testing {strategy} strategy ---")
            result = self.test_optimize_prompt(prompt, strategy)
            if result:
                results[strategy] = result
        
        # Compare results
        if results:
            print(f"\n📊 STRATEGY COMPARISON:")
            print("=" * 80)
            print(f"{'Strategy':<12} {'Tokens Saved':<12} {'Reduction %':<12} {'Cost Saved':<12}")
            print("-" * 80)
            
            for strategy, result in results.items():
                if 'metrics' in result:
                    metrics = result['metrics']
                    tokens_saved = metrics.get('tokensSaved', 0)
                    reduction = metrics.get('reductionPercentage', 0)
                    cost_saved = metrics.get('estimatedCostSavings', 0)
                    print(f"{strategy:<12} {tokens_saved:<12} {reduction:<12} ${cost_saved:.6f}")
            
            print(f"\n🔍 DETAILED PROMPT COMPARISON:")
            print("=" * 80)
            for strategy, result in results.items():
                print(f"\n--- {strategy.upper()} STRATEGY ---")
                print(f"Original: {result.get('originalPrompt', 'N/A')[:100]}{'...' if len(result.get('originalPrompt', '')) > 100 else ''}")
                print(f"Optimized: {result.get('optimizedPrompt', 'N/A')}")
                if 'metrics' in result:
                    metrics = result['metrics']
                    print(f"Savings: {metrics.get('tokensSaved', 0)} tokens ({metrics.get('reductionPercentage', 0)}%)")
    
    def test_batch_optimization(self, prompts: list) -> None:
        """Test batch optimization (if available)"""
        print(f"\n🔄 Testing batch optimization...")
        
        # Check if batch endpoint exists
        batch_endpoint = f"{self.base_url}/api/v1/optimize/batch"
        
        try:
            response = requests.get(batch_endpoint, timeout=10)
            if response.status_code == 200:
                print("✅ Batch endpoint is available")
                # TODO: Implement batch optimization test
            else:
                print("❌ Batch endpoint not available or not implemented")
        except requests.exceptions.RequestException:
            print("❌ Batch endpoint not accessible")

def main():
    """Main test function"""
    print("🧪 XiaoPrompt Optimizer API Tester")
    print("🌐 Translation: ENABLED (English → Chinese)")
    print("💾 Database: ENABLED (Results will be saved to dashboard)")
    print("=" * 50)
    
    # Initialize tester
    tester = PromptOptimizerAPITester()
    
    # Test API health
    if not tester.test_api_health():
        print("\n❌ API is not accessible. Please make sure the server is running.")
        print("   Run: npm run dev or pnpm dev")
        return
    
    # Test prompts
    test_prompts = [
        "I would be extremely grateful if you could please kindly create for me, if it would not be too much trouble, a truly magnificent, absolutely stunning, incredibly beautiful, exceptionally high-quality, professional-grade, and completely photorealistic digital image of a breathtaking mountain landscape with crystal clear, absolutely pristine, and beautifully reflective blue lakes, majestic, awe-inspiring snow-capped mountain peaks, and absolutely spectacular dramatic golden hour lighting that would make this image absolutely perfect for use as a desktop wallpaper. The resolution should be 8K and the style should be professional photography with perfect cinematic composition principles with impeccable rule of thirds. This image should be shot with a high-end DSLR camera and I sincerely appreciate your time and effort in creating this masterpiece for me.",
        
        "Please write a comprehensive and detailed analysis of the current market trends in the artificial intelligence industry, including but not limited to machine learning, deep learning, natural language processing, computer vision, and robotics. I would really appreciate it if you could provide specific examples, statistical data, and expert insights that would be extremely valuable for my research project. Thank you so much for your assistance.",
        
        "Create a beautiful sunset landscape"
    ]
    
    # Test single prompt optimization
    print(f"\n🎯 Testing single prompt optimization...")
    result = tester.test_optimize_prompt(test_prompts[0])
    
    if result:
        print(f"\n✅ Single prompt test completed successfully!")
    
    # Test multiple strategies
    tester.test_multiple_strategies(test_prompts[1])
    
    # Test batch optimization
    tester.test_batch_optimization(test_prompts)
    
    print(f"\n🎉 All tests completed!")
    print(f"💡 Tip: Check the server logs for detailed processing information")

if __name__ == "__main__":
    main()
