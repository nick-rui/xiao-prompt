import { NextResponse } from 'next/server'

export async function GET() {
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'PromptOptimizer API',
      description: 'AI-powered prompt optimization service for reducing token usage and improving efficiency',
      version: '1.0.0',
      contact: {
        name: 'PromptOptimizer Support',
        email: 'support@promptoptimizer.com',
        url: 'https://promptoptimizer.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://api.promptoptimizer.com/v1',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server'
      }
    ],
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/optimize': {
        post: {
          summary: 'Optimize a single prompt',
          description: 'Optimize a single prompt using various AI strategies to reduce token usage while maintaining quality',
          operationId: 'optimizePrompt',
          tags: ['Optimization'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['prompt'],
                  properties: {
                    prompt: {
                      type: 'string',
                      minLength: 1,
                      maxLength: 10000,
                      description: 'The prompt to optimize',
                      example: 'Create a beautiful sunset landscape with dramatic clouds and warm colors'
                    },
                    strategy: {
                      type: 'string',
                      enum: ['concise', 'creative', 'technical', 'multilingual'],
                      default: 'concise',
                      description: 'Optimization strategy to use'
                    },
                    targetLanguage: {
                      type: 'string',
                      minLength: 2,
                      maxLength: 2,
                      description: 'Target language code for translation (e.g., "zh" for Chinese)',
                      example: 'zh'
                    },
                    model: {
                      type: 'string',
                      enum: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
                      default: 'claude-3-haiku-20240307',
                      description: 'AI model to use for optimization'
                    },
                    temperature: {
                      type: 'number',
                      minimum: 0,
                      maximum: 2,
                      default: 0.3,
                      description: 'Temperature setting for the AI model'
                    },
                    includeMetrics: {
                      type: 'boolean',
                      default: true,
                      description: 'Whether to include detailed metrics in the response'
                    },
                    webhook: {
                      type: 'string',
                      format: 'uri',
                      description: 'Webhook URL to receive completion notification'
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Successful optimization',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        description: 'Unique optimization ID',
                        example: 'opt_1705123456789_abc123def'
                      },
                      originalPrompt: {
                        type: 'string',
                        description: 'The original prompt'
                      },
                      optimizedPrompt: {
                        type: 'string',
                        description: 'The optimized prompt'
                      },
                      strategy: {
                        type: 'string',
                        description: 'Strategy used for optimization'
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time',
                        description: 'When the optimization was completed'
                      },
                      status: {
                        type: 'string',
                        enum: ['completed', 'failed', 'processing'],
                        description: 'Current status of the optimization'
                      },
                      metrics: {
                        type: 'object',
                        properties: {
                          originalTokens: {
                            type: 'integer',
                            description: 'Number of tokens in original prompt'
                          },
                          optimizedTokens: {
                            type: 'integer',
                            description: 'Number of tokens in optimized prompt'
                          },
                          tokensSaved: {
                            type: 'integer',
                            description: 'Number of tokens saved'
                          },
                          reductionPercentage: {
                            type: 'number',
                            description: 'Percentage of tokens reduced'
                          },
                          estimatedCostSavings: {
                            type: 'number',
                            description: 'Estimated cost savings in USD'
                          },
                          processingTimeMs: {
                            type: 'integer',
                            description: 'Processing time in milliseconds'
                          },
                          model: {
                            type: 'string',
                            description: 'Model used for optimization'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'Bad request - invalid input',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' },
                      details: { type: 'array' }
                    }
                  }
                }
              }
            },
            '429': {
              description: 'Rate limit exceeded',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' },
                      retryAfter: { type: 'integer' }
                    }
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: { type: 'string' },
                      details: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        get: {
          summary: 'Get API information',
          description: 'Get basic information about the API',
          operationId: 'getApiInfo',
          tags: ['General'],
          responses: {
            '200': {
              description: 'API information',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      version: { type: 'string' },
                      description: { type: 'string' },
                      endpoints: { type: 'object' },
                      authentication: { type: 'object' },
                      rateLimits: { type: 'object' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/optimize/batch': {
        post: {
          summary: 'Optimize multiple prompts',
          description: 'Optimize multiple prompts in a single batch request',
          operationId: 'optimizeBatch',
          tags: ['Optimization'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['prompts'],
                  properties: {
                    prompts: {
                      type: 'array',
                      minItems: 1,
                      maxItems: 10,
                      items: {
                        type: 'object',
                        required: ['content'],
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Optional ID for the prompt'
                          },
                          content: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 10000,
                            description: 'The prompt content to optimize'
                          },
                          strategy: {
                            type: 'string',
                            enum: ['concise', 'creative', 'technical', 'multilingual'],
                            default: 'concise'
                          },
                          targetLanguage: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 2
                          },
                          model: {
                            type: 'string',
                            enum: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229'],
                            default: 'claude-3-haiku-20240307'
                          },
                          temperature: {
                            type: 'number',
                            minimum: 0,
                            maximum: 2,
                            default: 0.3
                          }
                        }
                      }
                    },
                    options: {
                      type: 'object',
                      properties: {
                        parallel: {
                          type: 'boolean',
                          default: true,
                          description: 'Whether to process prompts in parallel'
                        },
                        maxConcurrency: {
                          type: 'integer',
                          minimum: 1,
                          maximum: 10,
                          default: 5,
                          description: 'Maximum number of concurrent requests'
                        },
                        webhook: {
                          type: 'string',
                          format: 'uri',
                          description: 'Webhook URL for completion notification'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Batch optimization completed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      batchId: { type: 'string' },
                      totalPrompts: { type: 'integer' },
                      successful: { type: 'integer' },
                      failed: { type: 'integer' },
                      processingTimeMs: { type: 'integer' },
                      parallel: { type: 'boolean' },
                      maxConcurrency: { type: 'integer' },
                      timestamp: { type: 'string', format: 'date-time' },
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            originalPrompt: { type: 'string' },
                            optimizedPrompt: { type: 'string' },
                            strategy: { type: 'string' },
                            status: { type: 'string', enum: ['completed', 'failed'] },
                            metrics: { type: 'object' },
                            error: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/analytics/usage': {
        get: {
          summary: 'Get usage analytics',
          description: 'Get usage statistics and analytics for the specified period',
          operationId: 'getUsageAnalytics',
          tags: ['Analytics'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'period',
              in: 'query',
              description: 'Time period for analytics',
              schema: {
                type: 'string',
                enum: ['1d', '7d', '30d', '90d'],
                default: '30d'
              }
            },
            {
              name: 'userId',
              in: 'query',
              description: 'Filter by specific user ID',
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Usage analytics data',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      period: { type: 'string' },
                      dateRange: {
                        type: 'object',
                        properties: {
                          start: { type: 'string', format: 'date-time' },
                          end: { type: 'string', format: 'date-time' }
                        }
                      },
                      summary: {
                        type: 'object',
                        properties: {
                          totalOptimizations: { type: 'integer' },
                          totalTokensSaved: { type: 'integer' },
                          totalMoneySaved: { type: 'number' },
                          totalEnergySaved: { type: 'number' },
                          totalEmissionsSaved: { type: 'number' },
                          averageReduction: { type: 'number' }
                        }
                      },
                      breakdown: {
                        type: 'object',
                        properties: {
                          strategies: { type: 'object' },
                          costBreakdown: { type: 'object' },
                          topUsers: { type: 'array' }
                        }
                      },
                      trends: {
                        type: 'object',
                        properties: {
                          dailyUsage: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                date: { type: 'string' },
                                count: { type: 'integer' }
                              }
                            }
                          }
                        }
                      },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token or API key'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'string',
              description: 'Additional error details'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Invalid request'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'General',
        description: 'General API information'
      },
      {
        name: 'Optimization',
        description: 'Prompt optimization endpoints'
      },
      {
        name: 'Analytics',
        description: 'Usage analytics and statistics'
      }
    ]
  }

  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
