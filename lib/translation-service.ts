/**
 * Translation Service
 * Handles translation between languages using various translation providers
 */

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
  provider: string;
  timestamp: string;
}

export interface TranslationError {
  error: string;
  originalText: string;
  provider: string;
  timestamp: string;
}

export type SupportedLanguage = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

export class TranslationService {
  private googleTranslateApiKey: string;
  private baseUrl: string;

  constructor() {
    this.googleTranslateApiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY || '';
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  }

  /**
   * Translate text from English to Chinese (Simplified)
   */
  async translateToChinese(text: string): Promise<TranslationResult> {
    return this.translate(text, 'en', 'zh-CN');
  }

  /**
   * Translate text between any supported languages
   */
  async translate(
    text: string, 
    sourceLang: SupportedLanguage = 'en', 
    targetLang: SupportedLanguage = 'zh-CN'
  ): Promise<TranslationResult> {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid input text');
      }

      console.log(`Translating from ${sourceLang} to ${targetLang}: ${text.length} characters`);

      // Try Google Translate API first
      if (this.googleTranslateApiKey) {
        try {
          return await this.translateWithGoogle(text, sourceLang, targetLang);
        } catch (error) {
          console.warn('Google Translate failed, falling back to mock translation:', error);
        }
      }

      // Fallback to mock translation
      return await this.mockTranslation(text, sourceLang, targetLang);

    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Translate using Google Translate API
   */
  private async translateWithGoogle(
    text: string, 
    sourceLang: SupportedLanguage, 
    targetLang: SupportedLanguage
  ): Promise<TranslationResult> {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${this.googleTranslateApiKey}`,
      {
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
      }
    );

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const translation = data.data.translations[0];

    return {
      originalText: text,
      translatedText: translation.translatedText,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      confidence: 0.95, // Google Translate doesn't provide confidence in this API
      provider: 'google-translate',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Mock translation for development/fallback
   */
  private async mockTranslation(
    text: string, 
    sourceLang: SupportedLanguage, 
    targetLang: SupportedLanguage
  ): Promise<TranslationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let translatedText: string;

    switch (targetLang) {
      case 'zh-CN':
        translatedText = `[中文] ${text}`;
        break;
      case 'zh-TW':
        translatedText = `[繁體中文] ${text}`;
        break;
      case 'es':
        translatedText = `[Español] ${text}`;
        break;
      case 'fr':
        translatedText = `[Français] ${text}`;
        break;
      case 'de':
        translatedText = `[Deutsch] ${text}`;
        break;
      case 'ja':
        translatedText = `[日本語] ${text}`;
        break;
      case 'ko':
        translatedText = `[한국어] ${text}`;
        break;
      default:
        translatedText = text;
    }

    return {
      originalText: text,
      translatedText,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      confidence: 0.8, // Lower confidence for mock translations
      provider: 'mock',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Detect the language of the given text
   */
  async detectLanguage(text: string): Promise<{
    language: SupportedLanguage;
    confidence: number;
    provider: string;
  }> {
    try {
      if (!text || typeof text !== 'string') {
        throw new Error('Invalid input text');
      }

      // Simple language detection based on character patterns
      const language = this.detectLanguageByPatterns(text);
      
      return {
        language,
        confidence: 0.7,
        provider: 'pattern-detection'
      };

    } catch (error) {
      console.error('Language detection error:', error);
      throw new Error(`Language detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Simple pattern-based language detection
   */
  private detectLanguageByPatterns(text: string): SupportedLanguage {
    // Check for Chinese characters
    if (/[\u4e00-\u9fff]/.test(text)) {
      return 'zh-CN';
    }
    
    // Check for Japanese characters
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
      return 'ja';
    }
    
    // Check for Korean characters
    if (/[\uac00-\ud7af]/.test(text)) {
      return 'ko';
    }
    
    // Check for Spanish patterns
    if (/[ñáéíóúü]/i.test(text)) {
      return 'es';
    }
    
    // Check for French patterns
    if (/[àâäéèêëïîôùûüÿç]/i.test(text)) {
      return 'fr';
    }
    
    // Check for German patterns
    if (/[äöüß]/i.test(text)) {
      return 'de';
    }
    
    // Default to English
    return 'en';
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages(): Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
  }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
      { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' }
    ];
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!this.googleTranslateApiKey;
  }

  /**
   * Get configuration status
   */
  getConfigStatus() {
    return {
      googleTranslateConfigured: !!this.googleTranslateApiKey,
      baseUrl: this.baseUrl,
      supportedLanguages: this.getSupportedLanguages().length,
      timestamp: new Date().toISOString()
    };
  }
}

// Export a singleton instance
export const translationService = new TranslationService();
