/**
 * Prompt Optimization Service
 * Handles the complete pipeline: Input -> Qn Distillation -> Translation -> Output
 */

import Anthropic from '@anthropic-ai/sdk'

export interface OptimizationResult {
  id: string;
  success: boolean;
  timestamp: string;
  processingTimeMs: number;
  
  // Input
  input: {
    prompt: string;
    tokens: number;
  };
  
  // Stage 1: Qn Distillation
  qnDistillation: {
    originalPrompt: string;
    distilledPrompt: string;
    model: string;
    usage: {
      input_tokens: number;
      output_tokens: number;
    };
    tokenStats: {
      stage: string;
      inputTokens: number;
      outputTokens: number;
      reduction: number;
      reductionPercentage: number;
    };
  };
  
  // Stage 2: Translation
  translation: {
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    confidence?: number;
    tokenStats: {
      stage: string;
      inputTokens: number;
      outputTokens: number;
      reduction: number;
      reductionPercentage: number;
    };
  };
  
  // Final output
  output: {
    prompt: string;
    tokens: number;
    language: string;
  };
  
  // Overall statistics
  statistics: {
    totalInputTokens: number;
    totalOutputTokens: number;
    totalTokenReduction: number;
    totalTokenReductionPercentage: number;
    stages: Array<{
      stage: string;
      tokens: number;
      reduction?: number;
      reductionPercentage?: number;
      description: string;
    }>;
  };
}

export interface OptimizationError {
  id: string;
  success: false;
  error: string;
  timestamp: string;
  processingTimeMs: number;
  input: {
    prompt: string;
    tokens: number;
  };
}

export class PromptOptimizer {
  private anthropicApiKey: string;
  private baseUrl: string;
  private anthropic: Anthropic;

  constructor() {
    this.anthropicApiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    this.anthropic = new Anthropic({
      apiKey: this.anthropicApiKey,
      dangerouslyAllowBrowser: false, // Explicitly set to false for security
    });
  }

  /**
   * Process a prompt through the complete optimization pipeline
   */
  async optimizePrompt(
    inputPrompt: string, 
    options: {
      model?: string;
      temperature?: number;
      translateToChinese?: boolean;
    } = {}
  ): Promise<OptimizationResult | OptimizationError> {
    const startTime = Date.now();
    const pipelineId = this.generateId();

    try {
      console.log(`Starting optimization pipeline ${pipelineId}`);

      // Stage 1: Qn Distillation
      const distillationResult = await this.distillPrompt(inputPrompt, options);
      const distillationStats = await this.calculateTokenStats(
        'qn_distillation',
        inputPrompt,
        distillationResult.distilledPrompt
      );

      // Stage 2: Translation (if enabled)
      let translationResult;
      let translationStats;
      
      console.log('🔍 Translation check:', { 
        translateToChinese: options.translateToChinese,
        defaultBehavior: 'translateToChinese !== false (defaults to true)'
      });
      
      if (options.translateToChinese !== false) { // Default to true
        console.log('🌐 Starting Chinese translation...');
        translationResult = await this.translateToChinese(distillationResult.distilledPrompt);
        console.log('✅ Translation completed:', {
          original: translationResult.originalText,
          translated: translationResult.translatedText,
          confidence: translationResult.confidence
        });
        translationStats = await this.calculateTokenStats(
          'translation',
          distillationResult.distilledPrompt,
          translationResult.translatedText
        );
      } else {
        console.log('⏭️ Skipping translation (translateToChinese is false)');
        // Skip translation, use distilled prompt as final output
        translationResult = {
          originalText: distillationResult.distilledPrompt,
          translatedText: distillationResult.distilledPrompt,
          sourceLanguage: 'en',
          targetLanguage: 'en',
          confidence: 1.0
        };
        translationStats = await this.calculateTokenStats(
          'translation',
          distillationResult.distilledPrompt,
          distillationResult.distilledPrompt
        );
      }

      // Calculate overall statistics
      const totalProcessingTime = Date.now() - startTime;
      const inputTokens = await this.countTokens(inputPrompt);
      const outputTokens = await this.countTokens(translationResult.translatedText);
      const totalReduction = inputTokens - outputTokens;
      const totalReductionPercentage = (totalReduction / inputTokens) * 100;

      const result: OptimizationResult = {
        id: pipelineId,
        success: true,
        timestamp: new Date().toISOString(),
        processingTimeMs: totalProcessingTime,
        
        input: {
          prompt: inputPrompt,
          tokens: inputTokens
        },
        
        qnDistillation: {
          ...distillationResult,
          tokenStats: distillationStats
        },
        
        translation: {
          ...translationResult,
          tokenStats: translationStats
        },
        
        output: {
          prompt: translationResult.translatedText,
          tokens: outputTokens,
          language: translationResult.targetLanguage
        },
        
        statistics: {
          totalInputTokens: inputTokens,
          totalOutputTokens: outputTokens,
          totalTokenReduction: totalReduction,
          totalTokenReductionPercentage: Math.round(totalReductionPercentage * 100) / 100,
          stages: [
            {
              stage: 'input',
              tokens: inputTokens,
              description: 'Original English prompt'
            },
            {
              stage: 'qn_distillation',
              tokens: distillationStats.outputTokens,
              reduction: distillationStats.reduction,
              reductionPercentage: distillationStats.reductionPercentage,
              description: 'Distilled English prompt'
            },
            {
              stage: 'translation',
              tokens: translationStats.outputTokens,
              reduction: translationStats.reduction,
              reductionPercentage: translationStats.reductionPercentage,
              description: `Final ${translationResult.targetLanguage.toUpperCase()} prompt`
            }
          ]
        }
      };

      console.log(`Pipeline ${pipelineId} completed successfully`);
      return result;

    } catch (error) {
      const totalProcessingTime = Date.now() - startTime;
      console.error(`Pipeline ${pipelineId} failed:`, error);

      return {
        id: pipelineId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        processingTimeMs: totalProcessingTime,
        input: {
          prompt: inputPrompt,
          tokens: await this.countTokens(inputPrompt)
        }
      };
    }
  }

  /**
   * Distill a prompt using Anthropic Claude
   */
  private async distillPrompt(
    prompt: string, 
    options: { model?: string; temperature?: number } = {}
  ) {
    const model = options.model || 'claude-3-haiku-20240307';
    const temperature = options.temperature || 0.3;

    const systemPrompt = `You are an expert prompt optimizer specializing in eliminating unnecessary verbosity and politeness while preserving all essential meaning. Your goal is to dramatically reduce token count by removing redundant language, excessive politeness, and verbose expressions.

AGGRESSIVE VERBOSITY REDUCTION:

🚫 ELIMINATE POLITENESS OVERKILL:
- Remove: "I would be extremely grateful," "please kindly," "if it would not be too much trouble," "I sincerely appreciate"
- Remove: "I would like," "I would love," "I would really appreciate it if you could"
- Remove: "Could you please," "Would you mind," "I was wondering if you could"
- Remove: "Thank you in advance," "Thanks so much," "I really appreciate your time"

⚡ CUT REDUNDANT INTENSIFIERS:
- Remove: "truly magnificent," "absolutely stunning," "incredibly beautiful," "exceptionally high-quality"
- Remove: "completely photorealistic," "wonderfully serene," "incredibly peaceful"
- Remove: "absolutely pristine," "perfectly mirror," "incredible detail"
- Keep only ONE intensifier: "beautiful" not "absolutely stunning and incredibly beautiful"

🎯 STREAMLINE DESCRIPTIONS:
- "crystal clear, absolutely pristine, and beautifully reflective blue lakes" → "crystal clear blue lakes"
- "majestic, awe-inspiring snow-capped mountain peaks" → "snow-capped mountain peaks"
- "absolutely spectacular dramatic golden hour lighting" → "golden hour lighting"
- "perfect cinematic composition principles with impeccable rule of thirds" → "cinematic composition, rule of thirds"

🔧 PRESERVE TECHNICAL SPECS:
- Keep: resolution (8K), style (photorealistic), format (desktop wallpaper)
- Keep: technical terms (DSLR, golden hour, rule of thirds)
- Keep: specific requirements (mountain landscape, lakes, peaks)

📝 CONVERSION PATTERNS:
- "I would like the composition to follow" → "Composition:"
- "The resolution should be" → "8K resolution"
- "The style should be" → "Professional photography style"
- "This image should be shot with" → "Shot with DSLR"
- "I sincerely appreciate your time and effort" → [REMOVE ENTIRELY]

🎯 OPTIMIZATION GOALS:
- Reduce token count by 60-80%
- Maintain all essential visual and technical requirements
- Keep the core request intact
- Remove ALL unnecessary politeness and redundancy
- Use comma-separated lists for multiple descriptors

EXAMPLES:

❌ VERBOSE: "I would be extremely grateful if you could please kindly create for me, if it would not be too much trouble, a truly magnificent, absolutely stunning, incredibly beautiful, exceptionally high-quality, professional-grade, and completely photorealistic digital image..."

✅ OPTIMIZED: "Create photorealistic mountain landscape, crystal clear blue lakes, snow-capped peaks, golden hour lighting, 8K, DSLR, desktop wallpaper"

Your output should be ONLY the optimized prompt - no explanations, no commentary, no meta-text. Focus on aggressively removing verbosity while preserving all essential requirements.`;

    const response = await this.anthropic.messages.create({
      model,
      max_tokens: 1000,
      temperature,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const distilledPrompt = response.content[0].type === 'text' 
      ? response.content[0].text.trim()
      : '';

    if (!distilledPrompt) {
      throw new Error('Failed to generate distilled prompt');
    }

    return {
      originalPrompt: prompt,
      distilledPrompt,
      model,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      }
    };
  }

  /**
   * Translate text to Chinese using free translation service
   */
  private async translateToChinese(text: string) {
    console.log('🔄 Attempting translation:', { text, length: text.length });
    
    try {
      // Use LibreTranslate (free, open-source translation API)
      const translation = await this.translateWithLibreTranslate(text, 'en', 'zh');
      console.log('✅ Translation successful:', translation);
      
      return {
        originalText: text,
        translatedText: translation,
        sourceLanguage: 'en',
        targetLanguage: 'zh',
        confidence: 0.9
      };
    } catch (error) {
      console.warn('❌ Translation failed, using fallback:', error);
      // Fallback to simple mock translation
      return {
        originalText: text,
        translatedText: `[Chinese Translation]: ${text}`,
        sourceLanguage: 'en',
        targetLanguage: 'zh',
        confidence: 0.5
      };
    }
  }

  /**
   * Translate using LibreTranslate (free service)
   */
  private async translateWithLibreTranslate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    // Try multiple free translation services
    const services = [
      this.translateWithMyMemory,
      this.translateWithLibreTranslateAPI,
      this.translateWithGoogleTranslateFree
    ];

    for (const service of services) {
      try {
        return await service(text, sourceLang, targetLang);
      } catch (error) {
        console.warn(`Translation service failed:`, error);
        continue;
      }
    }

    throw new Error('All translation services failed');
  }

  /**
   * MyMemory Translation API (free, no API key required)
   */
  private async translateWithMyMemory(text: string, sourceLang: string, targetLang: string): Promise<string> {
    console.log('🌐 Trying MyMemory translation...');
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
    const data = await response.json();
    
    console.log('📡 MyMemory response:', { status: data.responseStatus, hasTranslation: !!data.responseData?.translatedText });
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      console.log('✅ MyMemory translation successful:', data.responseData.translatedText);
      return data.responseData.translatedText;
    }
    throw new Error(`MyMemory translation failed: ${data.responseStatus}`);
  }

  /**
   * LibreTranslate API (free, open-source)
   */
  private async translateWithLibreTranslateAPI(text: string, sourceLang: string, targetLang: string): Promise<string> {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    const data = await response.json();
    
    if (data.translatedText) {
      return data.translatedText;
    }
    throw new Error('LibreTranslate API failed');
  }

  /**
   * Google Translate (free, unofficial API)
   */
  private async translateWithGoogleTranslateFree(text: string, sourceLang: string, targetLang: string): Promise<string> {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    
    if (data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    throw new Error('Google Translate free API failed');
  }

  /**
   * Calculate token statistics for a pipeline stage
   */
  private async calculateTokenStats(stage: string, input: string, output: string) {
    const inputTokens = await this.countTokens(input);
    const outputTokens = await this.countTokens(output);
    const reduction = inputTokens - outputTokens;
    const reductionPercentage = inputTokens > 0 ? (reduction / inputTokens) * 100 : 0;

    console.log(`📊 Token stats for ${stage}:`, {
      inputTokens,
      outputTokens,
      reduction,
      reductionPercentage: Math.round(reductionPercentage * 100) / 100
    });

    return {
      stage,
      inputTokens,
      outputTokens,
      reduction,
      reductionPercentage: Math.round(reductionPercentage * 100) / 100
    };
  }

  /**
   * Accurate token counting using Anthropic's official tokenizer
   */
  private async countTokens(text: string): Promise<number> {
    if (!text) return 0;
    
    try {
      const response = await this.anthropic.messages.countTokens({
        model: 'claude-3-haiku-20240307',
        messages: [
          {
            role: 'user',
            content: text
          }
        ]
      });

      console.log(`🔢 Anthropic token count: ${response.input_tokens} tokens for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      return response.input_tokens;
    } catch (error) {
      console.warn('Failed to get accurate token count from Anthropic, using fallback estimation:', error);
      // Fallback to simple estimation
      return Math.ceil(text.length / 4);
    }
  }


  /**
   * Generate unique ID for pipeline tracking
   */
  private generateId(): string {
    return `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.anthropicApiKey;
  }

  /**
   * Get configuration status
   */
  getConfigStatus() {
    return {
      anthropicConfigured: !!this.anthropicApiKey,
      baseUrl: this.baseUrl,
      timestamp: new Date().toISOString()
    };
  }
}

// Export a singleton instance
export const promptOptimizer = new PromptOptimizer();
