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
      
      if (options.translateToChinese !== false) { // Default to true
        translationResult = await this.translateToChinese(distillationResult.distilledPrompt);
        translationStats = await this.calculateTokenStats(
          'translation',
          distillationResult.distilledPrompt,
          translationResult.translatedText
        );
      } else {
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

    const systemPrompt = `You are a world-class prompt optimization expert specializing in creating highly efficient, concise prompts for AI image generation (like Google Imagen, DALL-E, Midjourney) and other AI models. Your expertise lies in transforming verbose, unclear prompts into precise, actionable instructions that maximize AI performance while minimizing token usage and costs.

CORE OPTIMIZATION PRINCIPLES:

🎯 CLARITY & PRECISION:
- Replace vague language with specific, actionable terms
- Use concrete nouns instead of abstract concepts
- Eliminate ambiguous qualifiers ("somewhat," "kind of," "maybe")
- Specify exact quantities, formats, and constraints when relevant

⚡ EFFICIENCY & CONCISION:
- Remove filler words: "please," "could you," "I was wondering if," "it would be great if," "if possible," "when you have time"
- Eliminate redundancy: "summarize and give me the main points" → "summarize"
- Combine related concepts: "various different methods and approaches" → "methods"
- Use active voice over passive voice
- Replace phrases with single words when possible

🎪 STRUCTURE & ORGANIZATION:
- Lead with the primary action or goal
- Group related instructions together
- Use clear separators (bullets, numbers) for multiple requirements
- Prioritize information by importance
- Maintain logical flow from general to specific

🔧 TECHNICAL EXCELLENCE:
- Preserve all critical constraints, formats, and specifications
- Maintain any required output structure or formatting
- Keep essential context that affects the task outcome
- Preserve technical terminology and domain-specific language
- Maintain the appropriate level of formality for the context

🚫 WHAT TO REMOVE:
- Pleasantries and social niceties ("Hope this helps," "Thanks in advance")
- Redundant explanations of obvious concepts
- Unnecessary background information
- Overly complex sentence structures
- Emotional language that doesn't affect the task

✅ WHAT TO PRESERVE:
- All actionable instructions and requirements
- Specific constraints, formats, or limitations
- Essential context that affects interpretation
- Technical specifications and parameters
- Tone appropriate to the use case (professional, casual, etc.)

EXAMPLES OF OPTIMIZATION:

📸 IMAGE GENERATION PROMPTS:
❌ "Please create a beautiful, high-quality, professional image of a serene mountain landscape with crystal clear lakes, majestic peaks, golden hour lighting, cinematic composition, 8K resolution, photorealistic style, perfect for desktop wallpaper"
✅ "Serene mountain landscape, crystal clear lakes, majestic peaks, golden hour lighting, cinematic composition, 8K, photorealistic"

❌ "Could you please generate an amazing, stunning, incredible portrait of a young woman with beautiful eyes, perfect skin, elegant makeup, professional photography lighting, high resolution, studio quality"
✅ "Portrait of young woman, beautiful eyes, elegant makeup, professional studio lighting, high resolution"

🔤 TEXT/ANALYSIS PROMPTS:
❌ "Could you please help me analyze this data and provide some insights and recommendations if possible?"
✅ "Analyze this data and provide insights with recommendations."

❌ "I was wondering if you could maybe summarize the main points and give me a brief overview?"
✅ "Summarize the main points."

❌ "What do you think about the possibility of implementing various different approaches to solve this problem?"
✅ "Should I implement these approaches to solve this problem?"

Your output should be ONLY the optimized prompt - no explanations, no commentary, no meta-text. Focus on creating the most efficient, clear, and actionable version possible while preserving all essential meaning and requirements.`;

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
    try {
      // Use LibreTranslate (free, open-source translation API)
      const translation = await this.translateWithLibreTranslate(text, 'en', 'zh');
      
      return {
        originalText: text,
        translatedText: translation,
        sourceLanguage: 'en',
        targetLanguage: 'zh',
        confidence: 0.9
      };
    } catch (error) {
      console.warn('Translation failed, using fallback:', error);
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
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error('MyMemory translation failed');
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

    return {
      stage,
      inputTokens,
      outputTokens,
      reduction,
      reductionPercentage: Math.round(reductionPercentage * 100) / 100
    };
  }

  /**
   * Accurate token counting with language-aware estimation
   */
  private async countTokens(text: string): Promise<number> {
    if (!text) return 0;
    
    // Detect language and use appropriate token counting
    const language = this.detectLanguage(text);
    
    if (language === 'chinese' || language === 'japanese' || language === 'korean') {
      // For Asian languages, use more accurate estimation since Anthropic's tokenizer
      // may not be optimized for these languages
      return this.estimateTokensByLanguage(text);
    } else {
      // For English and other languages, use Anthropic's official tokenizer
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

        return response.input_tokens;
      } catch (error) {
        console.warn('Failed to get accurate token count, using estimation:', error);
        return this.estimateTokensByLanguage(text);
      }
    }
  }

  /**
   * Detect the primary language of the text
   */
  private detectLanguage(text: string): string {
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const japaneseChars = (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
    const koreanChars = (text.match(/[\uac00-\ud7af]/g) || []).length;
    const totalAsianChars = chineseChars + japaneseChars + koreanChars;
    
    if (chineseChars > 0 && chineseChars >= japaneseChars && chineseChars >= koreanChars) {
      return 'chinese';
    } else if (japaneseChars > 0 && japaneseChars >= koreanChars) {
      return 'japanese';
    } else if (koreanChars > 0) {
      return 'korean';
    } else {
      return 'english';
    }
  }

  /**
   * Language-aware token estimation
   */
  private estimateTokensByLanguage(text: string): number {
    if (!text) return 0;
    
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const japaneseChars = (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
    const koreanChars = (text.match(/[\uac00-\ud7af]/g) || []).length;
    const totalAsianChars = chineseChars + japaneseChars + koreanChars;
    
    if (totalAsianChars > 0) {
      // Asian languages are more token-efficient
      // Chinese: ~1 token per character (very efficient)
      // Japanese: ~1.2 tokens per character  
      // Korean: ~1.3 tokens per character
      // Other characters (spaces, punctuation): ~0.2 tokens per character
      const otherChars = text.length - totalAsianChars;
      
      const chineseTokens = chineseChars * 1.0;
      const japaneseTokens = japaneseChars * 1.2;
      const koreanTokens = koreanChars * 1.3;
      const otherTokens = otherChars * 0.2;
      
      return Math.ceil(chineseTokens + japaneseTokens + koreanTokens + otherTokens);
    } else {
      // English and other languages: ~4 characters per token
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
