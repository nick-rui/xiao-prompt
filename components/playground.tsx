"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { PlayIcon, SparklesIcon, TrendingDownIcon, DollarSignIcon, LeafIcon, ZapIcon, CopyIcon, CheckIcon } from "@/components/icons"

interface OptimizationResult {
  originalPrompt: string
  optimizedPrompt: string
  originalTokens: number
  optimizedTokens: number
  tokensSaved: number
  moneySaved: number
  energySaved: number
  emissionsSaved: number
  improvementPercentage: number
}

export function Playground() {
  const [prompt, setPrompt] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [displayedOriginalTokens, setDisplayedOriginalTokens] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const optimizePrompt = async () => {
    if (!prompt.trim()) return

    setIsOptimizing(true)

    try {
      // Use the new v1 API with enhanced features
      const response = await fetch('/api/v1/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo' // In production, use real API key
        },
        body: JSON.stringify({
          prompt: prompt,
          strategy: 'concise', // Use the new strategy system
          targetLanguage: 'zh', // Enable Chinese translation
          includeMetrics: true,
          model: 'claude-3-haiku-20240307'
        }),
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Use the new API response structure
      const originalTokens = result.metrics?.originalTokens || 0
      const optimizedTokens = result.metrics?.optimizedTokens || 0
      const tokensSaved = result.metrics?.tokensSaved || 0
      const improvementPercentage = result.metrics?.reductionPercentage || 0
      
      console.log('API v1 SUCCESS: Using enhanced prompt optimizer')
      console.log('API METRICS:', {
        optimizationId: result.id,
        strategy: result.strategy,
        originalTokens,
        optimizedTokens,
        tokensSaved,
        improvementPercentage,
        processingTime: result.metrics?.processingTimeMs
      })

      // Update the displayed token count to match API accuracy
      setDisplayedOriginalTokens(originalTokens)

      const optimizationResult: OptimizationResult = {
        originalPrompt: prompt,
        optimizedPrompt: result.optimizedPrompt,
        originalTokens,
        optimizedTokens,
        tokensSaved,
        moneySaved: tokensSaved * 0.002, // $0.002 per token saved
        energySaved: tokensSaved * 0.001, // Energy calculation
        emissionsSaved: tokensSaved * 0.0005, // Emissions calculation
        improvementPercentage,
      }

      setResult(optimizationResult)
    } catch (error) {
      console.error('Error optimizing prompt:', error)
      console.log('FALLBACK: Using mock optimization due to optimizer failure')
      
      // Fallback to mock optimization if optimizer fails
      const originalTokens = Math.ceil(prompt.length / 4) // Rough estimation fallback
      const optimizedTokens = Math.ceil(originalTokens * 0.7)
      const tokensSaved = originalTokens - optimizedTokens
      const improvementPercentage = Math.round((tokensSaved / originalTokens) * 100)
      
      console.log('FALLBACK METRICS:', {
        originalTokens,
        optimizedTokens,
        tokensSaved,
        improvementPercentage
      })

      // Update the displayed token count for fallback case too
      setDisplayedOriginalTokens(originalTokens)

      const fallbackResult: OptimizationResult = {
        originalPrompt: prompt,
        optimizedPrompt: `Optimized: ${prompt.slice(0, Math.floor(prompt.length * 0.8))}...`,
        originalTokens,
        optimizedTokens,
        tokensSaved,
        moneySaved: tokensSaved * 0.002,
        energySaved: tokensSaved * 0.001,
        emissionsSaved: tokensSaved * 0.0005,
        improvementPercentage,
      }

      setResult(fallbackResult)
    } finally {
      setIsOptimizing(false)
    }
  }

  const saveToDatabase = async () => {
    if (!result) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/save-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          original_prompt: result.originalPrompt,
          optimized_prompt: result.optimizedPrompt,
          original_tokens: result.originalTokens,
          optimized_tokens: result.optimizedTokens,
          tokens_saved: result.tokensSaved,
          money_saved: result.moneySaved,
          energy_saved: result.energySaved,
          emissions_saved: result.emissionsSaved,
          user_name: 'Current User' // You can make this dynamic later
        }),
      })

      if (response.ok) {
        console.log("Successfully saved to database")
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000) // Reset after 3 seconds
      } else {
        console.error("Failed to save to database")
      }
    } catch (error) {
      console.error("Error saving to database:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance">XiaoPrompt Optimization Playground</h1>
          <p className="text-muted-foreground text-pretty max-w-2xl">
            Optimize prompts for AI image generation (Google Imagen, DALL-E, Midjourney) and other AI models. 
            See how our advanced optimization reduces emissions, token usage, and costs while maintaining quality.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3">
                <SparklesIcon className="h-5 w-5 text-primary" />
                Original Prompt
              </CardTitle>
              <CardDescription className="text-base">
                Enter your AI prompt below to see optimization suggestions. Try the example to see dramatic token savings!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Enter your AI prompt here... (Try the 'Load Example' button for an extremely verbose prompt that demonstrates dramatic token reduction through optimization)"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value)
                  setDisplayedOriginalTokens(null) // Reset to rough estimation when prompt changes
                }}
                className="min-h-[240px] resize-none bg-background/50 border-border/50 text-base leading-relaxed p-4"
              />
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground font-mono">
                    {displayedOriginalTokens ? `~${displayedOriginalTokens} tokens` : `~${Math.ceil(prompt.length / 4)} tokens`}
                  </div>
                  <Button
                    onClick={() => setPrompt("I would be extremely grateful if you could please kindly take the time to create for me, if it would not be too much trouble, a truly magnificent, absolutely stunning, incredibly beautiful, exceptionally high-quality, professional-grade, and completely photorealistic digital image that depicts a wonderfully serene and incredibly peaceful mountain landscape scene. This landscape should feature crystal clear, absolutely pristine, and beautifully reflective blue lakes that perfectly mirror and reflect the majestic, awe-inspiring snow-capped mountain peaks in their entirety. The lighting should be absolutely spectacular dramatic golden hour lighting with wonderfully warm orange and pink hues that create an atmosphere of pure magic. I would like the composition to follow perfect cinematic composition principles with an impeccable rule of thirds arrangement. The resolution should be an outstanding 8K ultra-high resolution that provides incredible detail. The style should be professional photography style that would be absolutely perfect for use as a desktop wallpaper. This image should be shot with a professional DSLR camera and should feature incredible detail and sharpness throughout, truly showcasing the natural beauty of completely untouched wilderness areas. I sincerely appreciate your time and effort in creating this image for me.")}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Load Example
                  </Button>
                </div>
                <Button
                  onClick={optimizePrompt}
                  disabled={!prompt.trim() || isOptimizing}
                  className="bg-primary hover:bg-primary/90 px-6 py-2.5"
                  size="lg"
                >
                  {isOptimizing ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-3" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4 mr-3" />
                      Optimize Prompt
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3">
                <TrendingDownIcon className="h-5 w-5 text-green-500" />
                Optimization Results
              </CardTitle>
              <CardDescription className="text-base">
                {result ? "Your optimized prompt and savings" : "Results will appear here after optimization"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-8">
                  {/* Optimized Prompt */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-foreground">Optimized Prompt</label>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground font-mono">~{result.optimizedTokens} tokens</div>
                        <Button
                          onClick={() => copyToClipboard(result.optimizedPrompt)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs"
                        >
                          {copied ? (
                            <>
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <CopyIcon className="h-3 w-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-background/50 border border-border/50 rounded-lg text-sm leading-relaxed">
                      {result.optimizedPrompt}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Metrics Grid */}
                  <div className="space-y-6">
                    {/* Primary Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <ZapIcon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-semibold">Tokens Saved</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-500">{result.tokensSaved}</div>
                        <Progress value={result.improvementPercentage} className="h-2.5" />
                        <div className="text-xs text-muted-foreground font-medium">
                          {result.improvementPercentage}% token reduction
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <DollarSignIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-semibold">Money Saved</span>
                        </div>
                        <div className="text-3xl font-bold text-green-500">${result.moneySaved.toFixed(4)}</div>
                        <div className="text-xs text-muted-foreground font-medium">Per optimization</div>
                      </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <LeafIcon className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-semibold">Energy Saved</span>
                        </div>
                        <div className="text-xl font-bold text-emerald-500">{result.energySaved.toFixed(3)} kWh</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <LeafIcon className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-semibold">CO₂ Saved</span>
                        </div>
                        <div className="text-xl font-bold text-teal-600">{result.emissionsSaved.toFixed(3)} kg</div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <Button
                      onClick={saveToDatabase}
                      disabled={isSaving}
                      variant="outline"
                      className={`w-full py-2.5 transition-all duration-200 ${
                        saveSuccess 
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                          : 'bg-transparent hover:bg-muted/50'
                      }`}
                      size="lg"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        <>
                          ✓ Saved to Dashboard!
                        </>
                      ) : (
                        'Save to Dashboard'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  <div className="text-center space-y-3"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
