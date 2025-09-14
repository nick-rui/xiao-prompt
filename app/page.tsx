"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CheckIcon, CodeIcon, BarChartIcon, ZapIcon, ArrowDownIcon, ArrowDownLeftIcon, ArrowDownRightIcon } from "@/components/icons"
import { useLocalization } from "@/lib/use-localization"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default function LandingPage() {
  const { text, loading } = useLocalization()

  if (loading || !text) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="text-sm px-4 py-2 border border-border/50 bg-transparent text-foreground hover:bg-accent/50">
                <img src="/xiaoprompt_logo.png" alt="XiaoPrompt" className="w-8 h-8 mr-2" />
                {text.hero.badge}
              </Badge>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                  {text.hero.title}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {text.hero.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-center pt-8">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                  {text.hero.ctaPrimary}
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Flowchart */}
            <div className="pt-16">
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {text.hero.flowchart.title}
                </h2>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  {text.hero.flowchart.subtitle}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
                {/* Step 1: Distillation */}
                <Card className="neon-border border-primary/50 glow-effect text-center p-4 w-full md:w-64">
                  <div className="text-2xl mb-2">{text.hero.flowchart.steps.distillation.icon}</div>
                  <h3 className="text-base font-bold mb-2 text-primary">
                    {text.hero.flowchart.steps.distillation.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {text.hero.flowchart.steps.distillation.description}
                  </p>
                </Card>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRightIcon className="w-5 h-5 text-primary" />
                </div>

                {/* Step 2: Translation */}
                <Card className="neon-border border-primary/50 glow-effect text-center p-4 w-full md:w-64">
                  <div className="text-2xl mb-2">{text.hero.flowchart.steps.translation.icon}</div>
                  <h3 className="text-base font-bold mb-2 text-primary">
                    {text.hero.flowchart.steps.translation.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {text.hero.flowchart.steps.translation.description}
                  </p>
                </Card>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <ArrowRightIcon className="w-5 h-5 text-primary" />
                </div>

                {/* Step 3: Integration */}
                <Card className="neon-border border-primary/50 glow-effect text-center p-4 w-full md:w-64">
                  <div className="text-2xl mb-2">{text.hero.flowchart.steps.integration.icon}</div>
                  <h3 className="text-base font-bold mb-2 text-primary">
                    {text.hero.flowchart.steps.integration.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {text.hero.flowchart.steps.integration.description}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {text.example.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {text.example.subtitle}
            </p>
          </div>

          {/* Layout with starting image above and between result cards */}
          <div className="relative">
            {/* Starting Image Card - positioned above and centered */}
            <div className="flex justify-center mb-12">
              <Card className="neon-border border-blue-500/30 w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {text.example.startingImage.title}
                  </CardTitle>
                  <CardDescription>
                    {text.example.startingImage.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <img 
                      src="/original_image.png" 
                      alt="Starting image" 
                      className="w-full object-contain rounded-lg bg-muted/30"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Result Cards - positioned below with same size as starting card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Raw Prompt */}
              <Card className="neon-border border-red-500/30 w-full max-w-md mx-auto flex flex-col h-full">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    {text.example.rawPrompt.title}
                  </CardTitle>
                  <CardDescription>
                    {text.example.rawPrompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-end gap-2 mb-2">
                      <div className="flex-1"></div>
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-1 text-xs font-mono text-red-400">
                        {text.example.rawPrompt.placeholder}
                      </div>
                    </div>
                    <div className="w-full">
                      <img 
                        src="/raw_prompt_output.png" 
                        alt="Raw prompt output" 
                        className="w-full object-contain rounded-lg bg-muted/30"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Prompt */}
              <Card className="neon-border border-primary/50 glow-effect w-full max-w-md mx-auto flex flex-col h-full">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {text.example.optimizedPrompt.title}
                  </CardTitle>
                  <CardDescription>
                    {text.example.optimizedPrompt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-end gap-2 mb-2">
                      <div className="flex-1"></div>
                      <div className="bg-primary/20 border border-primary/30 rounded-lg px-3 py-1 text-xs font-mono text-primary">
                        {text.example.optimizedPrompt.placeholder}
                      </div>
                    </div>
                    <div className="w-full">
                      <img 
                        src="/enhanced_prompt_output.png" 
                        alt="Optimized prompt output" 
                        className="w-full object-contain rounded-lg bg-muted/30"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Validation Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {text.validation.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {text.validation.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChartIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{text.validation.qualityMetrics.title}</CardTitle>
                <CardDescription>
                  {text.validation.qualityMetrics.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.qualityMetrics.semanticSimilarity}</span>
                    <Badge>{text.validation.qualityMetrics.semanticSimilarityValue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.qualityMetrics.taskCompletion}</span>
                    <Badge>{text.validation.qualityMetrics.taskCompletionValue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.qualityMetrics.userSatisfaction}</span>
                    <Badge>{text.validation.qualityMetrics.userSatisfactionValue}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ZapIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{text.validation.sustainabilityGains.title}</CardTitle>
                <CardDescription>
                  {text.validation.sustainabilityGains.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.sustainabilityGains.energyReduction}</span>
                    <Badge>{text.validation.sustainabilityGains.energyReductionValue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.sustainabilityGains.carbonReduction}</span>
                    <Badge>{text.validation.sustainabilityGains.carbonReductionValue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.sustainabilityGains.processingSpeed}</span>
                    <Badge>{text.validation.sustainabilityGains.processingSpeedValue}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{text.validation.environmentalImpact.title}</CardTitle>
                <CardDescription>
                  {text.validation.environmentalImpact.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.environmentalImpact.energySaved}</span>
                    <Badge>{text.validation.environmentalImpact.energySavedValue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.environmentalImpact.emissionsReduction}</span>
                    <Badge>{text.validation.environmentalImpact.emissionsReductionValue}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{text.validation.environmentalImpact.greenScore}</span>
                    <Badge>{text.validation.environmentalImpact.greenScoreValue}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API & Integration Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              {text.api.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {text.api.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* API Features */}
            <div className="space-y-8">
              <Card className="glass-effect">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CodeIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{text.api.apiFeatures.title}</CardTitle>
                      <CardDescription>{text.api.apiFeatures.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-2">{text.api.apiFeatures.endpoint}</div>
                      <div className="font-mono text-xs text-foreground">
                        {`{
  "prompt": "${text.api.apiFeatures.example.prompt}",
  "model": "${text.api.apiFeatures.example.model}",
  "optimization_level": "${text.api.apiFeatures.example.optimization_level}"
}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="border border-border/50 bg-transparent text-foreground hover:bg-accent/50">{text.api.apiFeatures.features.jsonResponse}</Badge>
                      <Badge className="border border-border/50 bg-transparent text-foreground hover:bg-accent/50">{text.api.apiFeatures.features.rateLimited}</Badge>
                      <Badge className="border border-border/50 bg-transparent text-foreground hover:bg-accent/50">{text.api.apiFeatures.features.webhookSupport}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="glass-effect">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">{text.api.apiFeatures.uptime}</div>
                      <div className="text-sm text-muted-foreground">{text.api.apiFeatures.uptimeLabel}</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">{text.api.apiFeatures.responseTime}</div>
                      <div className="text-sm text-muted-foreground">{text.api.apiFeatures.responseTimeLabel}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Dashboard Features */}
            <div className="space-y-6">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle>{text.api.dashboardFeatures.title}</CardTitle>
                  <CardDescription>
                    {text.api.dashboardFeatures.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-primary" />
                      <span>{text.api.dashboardFeatures.features.liveTracking}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-primary" />
                      <span>{text.api.dashboardFeatures.features.carbonAnalytics}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-primary" />
                      <span>{text.api.dashboardFeatures.features.energyBenchmarking}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-primary" />
                      <span>{text.api.dashboardFeatures.features.teamCollaboration}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-primary" />
                      <span>{text.api.dashboardFeatures.features.sustainabilityReporting}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full">
                    {text.api.dashboardFeatures.ctaDashboard}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" className="flex-1">
                  {text.api.dashboardFeatures.ctaDocumentation}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/xiaoprompt_logo.png" alt="XiaoPrompt Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-lg text-foreground">XiaoPrompt</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {text.footer.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
