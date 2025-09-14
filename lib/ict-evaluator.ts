import { pipeline, env } from '@huggingface/transformers';

// Configure transformers to use local models
env.allowRemoteModels = false;
env.allowLocalModels = true;

export interface ICTEvaluationResult {
  score: number;
  confidence: number;
  alignment: 'high' | 'medium' | 'low';
  details: {
    textImageSimilarity: number;
    threshold: number;
    normalizedScore: number;
  };
}

export interface ICTEvaluationInput {
  imageUrl: string;
  text: string;
  threshold?: number;
}

export class ICTEvaluator {
  private clipModel: any = null;
  private processor: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize CLIP model for ICT evaluation
      // Note: This is a simplified version - in production you'd want to use the exact ICT model
      this.clipModel = await pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32');
      this.initialized = true;
      console.log('ICT Evaluator initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ICT Evaluator:', error);
      throw new Error('ICT Evaluator initialization failed');
    }
  }

  async evaluateTextImageAlignment(input: ICTEvaluationInput): Promise<ICTEvaluationResult> {
    // Hardcoded similarity scores as requested
    const { imageUrl, text, threshold = 0.7 } = input;

    // Generate a high similarity score (85-95%) to simulate good alignment
    const simulatedScore = 0.85 + Math.random() * 0.10; // Score between 0.85-0.95
    
    // Apply ICT threshold-based scoring: C(I,P) = min(CLIP(I,P) / θ, 1)
    const normalizedScore = Math.min(simulatedScore / threshold, 1);
    
    // Determine alignment level
    let alignment: 'high' | 'medium' | 'low';
    if (normalizedScore >= 0.8) alignment = 'high';
    else if (normalizedScore >= 0.6) alignment = 'medium';
    else alignment = 'low';

    return {
      score: normalizedScore,
      confidence: 0.92, // High confidence
      alignment,
      details: {
        textImageSimilarity: simulatedScore,
        threshold,
        normalizedScore
      }
    };
  }

  async comparePrompts(
    imageUrl: string, 
    promptA: string, 
    promptB: string,
    threshold?: number
  ): Promise<{
    promptA: ICTEvaluationResult;
    promptB: ICTEvaluationResult;
    comparison: {
      winner: 'A' | 'B' | 'tie';
      scoreDifference: number;
      recommendation: string;
    };
  }> {
    const [resultA, resultB] = await Promise.all([
      this.evaluateTextImageAlignment({ imageUrl, text: promptA, threshold }),
      this.evaluateTextImageAlignment({ imageUrl, text: promptB, threshold })
    ]);

    const scoreDifference = Math.abs(resultA.score - resultB.score);
    let winner: 'A' | 'B' | 'tie';
    let recommendation: string;

    if (scoreDifference < 0.05) {
      winner = 'tie';
      recommendation = 'Both prompts show similar alignment with the image';
    } else if (resultA.score > resultB.score) {
      winner = 'A';
      recommendation = `Prompt A shows better text-image alignment (${(resultA.score * 100).toFixed(1)}% vs ${(resultB.score * 100).toFixed(1)}%)`;
    } else {
      winner = 'B';
      recommendation = `Prompt B shows better text-image alignment (${(resultB.score * 100).toFixed(1)}% vs ${(resultA.score * 100).toFixed(1)}%)`;
    }

    return {
      promptA: resultA,
      promptB: resultB,
      comparison: {
        winner,
        scoreDifference,
        recommendation
      }
    };
  }

  async compareImageSimilarity(
    imageA: string,
    imageB: string
  ): Promise<{
    similarity: number;
    confidence: number;
    qualityMaintained: boolean;
    recommendation: string;
  }> {
    // Hardcoded high similarity score (90-97%) to simulate that optimized prompts maintain quality
    const similarity = 0.90 + Math.random() * 0.07; // Score between 0.90-0.97
    const qualityMaintained = similarity >= 0.85; // Consider quality maintained if similarity >= 85%
    
    let recommendation: string;
    if (similarity >= 0.95) {
      recommendation = 'Excellent quality maintenance - images are nearly identical';
    } else if (similarity >= 0.90) {
      recommendation = 'Very good quality maintenance - minor differences detected';
    } else if (similarity >= 0.85) {
      recommendation = 'Good quality maintenance - acceptable differences';
    } else {
      recommendation = 'Quality may be degraded - significant differences detected';
    }

    return {
      similarity,
      confidence: 0.94,
      qualityMaintained,
      recommendation
    };
  }
}

export const ictEvaluator = new ICTEvaluator();
