"use client"

import { useState, useEffect } from 'react'

interface LocalizedText {
  navigation: {
    home: string
    dashboard: string
    playground: string
    apiTest: string
    apiGuide: string
    apiDocs: string
    getStarted: string
    profile: string
    settings: string
    logout: string
  }
  hero: {
    badge: string
    title: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
    flowchart: {
      title: string
      subtitle: string
      steps: {
        distillation: {
          title: string
          description: string
          icon: string
        }
        translation: {
          title: string
          description: string
          icon: string
        }
        integration: {
          title: string
          description: string
          icon: string
        }
      }
    }
  }
  example: {
    title: string
    subtitle: string
    startingImage: {
      title: string
      description: string
      placeholder: string
    }
    rawPrompt: {
      title: string
      description: string
      placeholder: string
    }
    optimizedPrompt: {
      title: string
      description: string
      placeholder: string
    }
  }
  validation: {
    title: string
    subtitle: string
    qualityMetrics: {
      title: string
      description: string
      semanticSimilarity: string
      semanticSimilarityValue: string
      taskCompletion: string
      taskCompletionValue: string
      userSatisfaction: string
      userSatisfactionValue: string
    }
    sustainabilityGains: {
      title: string
      description: string
      energyReduction: string
      energyReductionValue: string
      carbonReduction: string
      carbonReductionValue: string
      processingSpeed: string
      processingSpeedValue: string
    }
    environmentalImpact: {
      title: string
      description: string
      energySaved: string
      energySavedValue: string
      emissionsReduction: string
      emissionsReductionValue: string
      greenScore: string
      greenScoreValue: string
    }
  }
  api: {
    title: string
    subtitle: string
    apiFeatures: {
      title: string
      description: string
      endpoint: string
      example: {
        prompt: string
        model: string
        optimization_level: string
      }
      features: {
        jsonResponse: string
        rateLimited: string
        webhookSupport: string
      }
      uptime: string
      uptimeLabel: string
      responseTime: string
      responseTimeLabel: string
    }
    dashboardFeatures: {
      title: string
      description: string
      features: {
        liveTracking: string
        carbonAnalytics: string
        energyBenchmarking: string
        teamCollaboration: string
        sustainabilityReporting: string
      }
      ctaDashboard: string
      ctaDocumentation: string
    }
  }
  cta: {
    title: string
    subtitle: string
    ctaPrimary: string
    ctaSecondary: string
  }
  footer: {
    copyright: string
  }
}

export function useLocalization() {
  const [text, setText] = useState<LocalizedText | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/text.json')
      .then(response => response.json())
      .then(data => {
        setText(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load localization:', error)
        setLoading(false)
      })
  }, [])

  return { text, loading }
}
