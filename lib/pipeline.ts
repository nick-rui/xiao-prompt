/**
 * Main Pipeline Orchestrator
 * Coordinates the complete prompt optimization workflow
 */

import { promptOptimizer, type OptimizationResult, type OptimizationError } from './prompt-optimizer';
import { translationService } from './translation-service';
import { tokenCounter, type TokenStats } from './token-counter';

export interface PipelineConfig {
  // Qn Distillation settings
  distillation: {
    enabled: boolean;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  
  // Translation settings
  translation: {
    enabled: boolean;
    targetLanguage: string;
    provider: 'google' | 'mock';
  };
  
  // Token counting settings
  tokenCounting: {
    enabled: boolean;
    method: 'estimation' | 'tiktoken';
  };
  
  // Performance settings
  performance: {
    timeout: number;
    retries: number;
    concurrency: number;
  };
}

export interface BatchOptimizationResult {
  batchId: string;
  totalPrompts: number;
  successful: number;
  failed: number;
  results: (OptimizationResult | OptimizationError)[];
  statistics: {
    totalProcessingTime: number;
    averageProcessingTime: number;
    totalTokenReduction: number;
    averageTokenReduction: number;
  };
  timestamp: string;
}

export class PromptOptimizationPipeline {
  private config: PipelineConfig;

  constructor(config?: Partial<PipelineConfig>) {
    this.config = {
      distillation: {
        enabled: true,
        model: 'claude-3-haiku-20240307',
        temperature: 0.3,
        maxTokens: 1000,
        ...config?.distillation
      },
      translation: {
        enabled: false, // Disabled for now - focus on distillation
        targetLanguage: 'zh-CN',
        provider: 'google',
        ...config?.translation
      },
      tokenCounting: {
        enabled: true,
        method: 'estimation',
        ...config?.tokenCounting
      },
      performance: {
        timeout: 30000,
        retries: 3,
        concurrency: 3,
        ...config?.performance
      }
    };
  }

  /**
   * Process a single prompt through the complete pipeline
   */
  async processPrompt(
    inputPrompt: string,
    options?: {
      skipDistillation?: boolean;
      skipTranslation?: boolean;
      customConfig?: Partial<PipelineConfig>;
    }
  ): Promise<OptimizationResult | OptimizationError> {
    const pipelineId = this.generatePipelineId();
    const startTime = Date.now();

    try {
      console.log(`Starting pipeline ${pipelineId} for single prompt`);

      // Merge custom config if provided
      const activeConfig = options?.customConfig 
        ? this.mergeConfig(this.config, options.customConfig)
        : this.config;

      let currentPrompt = inputPrompt;
      let distillationResult: any = null;
      let translationResult: any = null;

      // Stage 1: Qn Distillation (if enabled and not skipped)
      if (activeConfig.distillation.enabled && !options?.skipDistillation) {
        console.log(`Stage 1: Qn Distillation with ${activeConfig.distillation.model}`);
        distillationResult = await this.distillPrompt(currentPrompt, activeConfig);
        currentPrompt = distillationResult.distilledPrompt;
      }

      // Stage 2: Translation (if enabled and not skipped)
      // TODO: Re-enable translation feature later
      /*
      if (activeConfig.translation.enabled && !options?.skipTranslation) {
        console.log(`Stage 2: Translation to ${activeConfig.translation.targetLanguage}`);
        translationResult = await this.translatePrompt(currentPrompt, activeConfig);
        currentPrompt = translationResult.translatedText;
      }
      */

      // Build result
      const result = this.buildOptimizationResult(
        pipelineId,
        inputPrompt,
        currentPrompt,
        distillationResult,
        translationResult,
        activeConfig,
        startTime
      );

      console.log(`Pipeline ${pipelineId} completed successfully`);
      return result;

    } catch (error) {
      console.error(`Pipeline ${pipelineId} failed:`, error);
      return this.buildErrorResult(pipelineId, inputPrompt, error, startTime);
    }
  }

  /**
   * Process multiple prompts in batch
   */
  async processBatch(
    prompts: string[],
    options?: {
      skipDistillation?: boolean;
      skipTranslation?: boolean;
      customConfig?: Partial<PipelineConfig>;
    }
  ): Promise<BatchOptimizationResult> {
    const batchId = this.generatePipelineId();
    const startTime = Date.now();
    const { concurrency } = this.config.performance;

    console.log(`Starting batch processing ${prompts.length} prompts with concurrency ${concurrency}`);

    const results: (OptimizationResult | OptimizationError)[] = [];

    // Process in batches to avoid overwhelming APIs
    for (let i = 0; i < prompts.length; i += concurrency) {
      const batch = prompts.slice(i, i + concurrency);
      const batchPromises = batch.map(prompt => 
        this.processPrompt(prompt, options)
      );

      try {
        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map(result => 
          result.status === 'fulfilled' 
            ? result.value 
            : this.buildErrorResult(
                this.generatePipelineId(), 
                batch[0], 
                result.reason,
                Date.now()
              )
        ));
      } catch (error) {
        console.error('Batch processing error:', error);
        results.push(...batch.map(prompt => 
          this.buildErrorResult(
            this.generatePipelineId(),
            prompt,
            error,
            Date.now()
          )
        ));
      }
    }

    const totalProcessingTime = Date.now() - startTime;
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    // Calculate batch statistics
    const successfulResults = results.filter(r => r.success) as OptimizationResult[];
    const totalTokenReduction = successfulResults.reduce(
      (sum, r) => sum + r.statistics.totalTokenReduction, 
      0
    );
    const averageTokenReduction = successful > 0 ? totalTokenReduction / successful : 0;

    return {
      batchId,
      totalPrompts: prompts.length,
      successful,
      failed,
      results,
      statistics: {
        totalProcessingTime,
        averageProcessingTime: totalProcessingTime / prompts.length,
        totalTokenReduction,
        averageTokenReduction
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Distill a prompt using the configured model
   */
  private async distillPrompt(prompt: string, config: PipelineConfig) {
    const { model, temperature, maxTokens } = config.distillation;

    return await promptOptimizer['distillPrompt'](prompt, {
      model,
      temperature,
      maxTokens
    });
  }

  /**
   * Translate a prompt using the configured service
   */
  private async translatePrompt(prompt: string, config: PipelineConfig) {
    const { targetLanguage } = config.translation;

    return await translationService.translate(prompt, 'en', targetLanguage as any);
  }

  /**
   * Build the final optimization result
   */
  private buildOptimizationResult(
    pipelineId: string,
    inputPrompt: string,
    finalPrompt: string,
    distillationResult: any,
    translationResult: any,
    config: PipelineConfig,
    startTime: number
  ): OptimizationResult {
    const processingTime = Date.now() - startTime;
    const inputTokens = tokenCounter.countTokens(inputPrompt);
    const outputTokens = tokenCounter.countTokens(finalPrompt);
    const totalReduction = inputTokens - outputTokens;
    const totalReductionPercentage = (totalReduction / inputTokens) * 100;

    // Build stages array
    const stages = [
      {
        stage: 'input',
        tokens: inputTokens,
        description: 'Original prompt'
      }
    ];

    let currentTokens = inputTokens;

    // Add distillation stage if it occurred
    if (distillationResult) {
      const distillationTokens = tokenCounter.countTokens(distillationResult.distilledPrompt);
      const distillationReduction = currentTokens - distillationTokens;
      const distillationPercentage = (distillationReduction / currentTokens) * 100;

      stages.push({
        stage: 'qn_distillation',
        tokens: distillationTokens,
        reduction: distillationReduction,
        reductionPercentage: Math.round(distillationPercentage * 100) / 100,
        description: 'Distilled prompt'
      });

      currentTokens = distillationTokens;
    }

    // Add translation stage if it occurred
    if (translationResult) {
      const translationTokens = tokenCounter.countTokens(translationResult.translatedText);
      const translationReduction = currentTokens - translationTokens;
      const translationPercentage = (translationReduction / currentTokens) * 100;

      stages.push({
        stage: 'translation',
        tokens: translationTokens,
        reduction: translationReduction,
        reductionPercentage: Math.round(translationPercentage * 100) / 100,
        description: 'Translated prompt'
      });

      currentTokens = translationTokens;
    }

    return {
      id: pipelineId,
      success: true,
      timestamp: new Date().toISOString(),
      processingTimeMs: processingTime,
      
      input: {
        prompt: inputPrompt,
        tokens: inputTokens
      },
      
      qnDistillation: distillationResult ? {
        originalPrompt: distillationResult.originalPrompt,
        distilledPrompt: distillationResult.distilledPrompt,
        model: distillationResult.model,
        usage: distillationResult.usage,
        tokenStats: this.calculateTokenStats(
          'qn_distillation',
          inputPrompt,
          distillationResult.distilledPrompt
        )
      } : {
        originalPrompt: inputPrompt,
        distilledPrompt: inputPrompt,
        model: 'none',
        usage: { input_tokens: 0, output_tokens: 0 },
        tokenStats: this.calculateTokenStats('qn_distillation', inputPrompt, inputPrompt)
      },
      
      translation: translationResult ? {
        originalText: translationResult.originalText,
        translatedText: translationResult.translatedText,
        sourceLanguage: translationResult.sourceLanguage,
        targetLanguage: translationResult.targetLanguage,
        confidence: translationResult.confidence,
        tokenStats: this.calculateTokenStats(
          'translation',
          translationResult.originalText,
          translationResult.translatedText
        )
      } : {
        originalText: finalPrompt,
        translatedText: finalPrompt,
        sourceLanguage: 'en',
        targetLanguage: 'en',
        confidence: 1.0,
        tokenStats: this.calculateTokenStats('translation', finalPrompt, finalPrompt)
      },
      
      output: {
        prompt: finalPrompt,
        tokens: outputTokens,
        language: translationResult?.targetLanguage || 'en'
      },
      
      statistics: {
        totalInputTokens: inputTokens,
        totalOutputTokens: outputTokens,
        totalTokenReduction: totalReduction,
        totalTokenReductionPercentage: Math.round(totalReductionPercentage * 100) / 100,
        stages
      }
    };
  }

  /**
   * Build error result
   */
  private buildErrorResult(
    pipelineId: string,
    inputPrompt: string,
    error: any,
    startTime: number
  ): OptimizationError {
    return {
      id: pipelineId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      processingTimeMs: Date.now() - startTime,
      input: {
        prompt: inputPrompt,
        tokens: tokenCounter.countTokens(inputPrompt)
      }
    };
  }

  /**
   * Calculate token statistics for a stage
   */
  private calculateTokenStats(stage: string, input: string, output: string): TokenStats {
    return tokenCounter.getStageStats(stage, input, output);
  }

  /**
   * Merge configuration objects
   */
  private mergeConfig(base: PipelineConfig, override: Partial<PipelineConfig>): PipelineConfig {
    return {
      distillation: { ...base.distillation, ...override.distillation },
      translation: { ...base.translation, ...override.translation },
      tokenCounting: { ...base.tokenCounting, ...override.tokenCounting },
      performance: { ...base.performance, ...override.performance }
    };
  }

  /**
   * Generate unique pipeline ID
   */
  private generatePipelineId(): string {
    return `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current configuration
   */
  getConfig(): PipelineConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PipelineConfig>): void {
    this.config = this.mergeConfig(this.config, newConfig);
  }

  /**
   * Get pipeline health status
   */
  getHealthStatus(): {
    healthy: boolean;
    services: {
      promptOptimizer: boolean;
      translationService: boolean;
      tokenCounter: boolean;
    };
    config: PipelineConfig;
    timestamp: string;
  } {
    return {
      healthy: promptOptimizer.isConfigured() && translationService.isConfigured(),
      services: {
        promptOptimizer: promptOptimizer.isConfigured(),
        translationService: translationService.isConfigured(),
        tokenCounter: true // Token counter doesn't require external config
      },
      config: this.getConfig(),
      timestamp: new Date().toISOString()
    };
  }
}

// Export a singleton instance with default configuration
export const promptPipeline = new PromptOptimizationPipeline();
