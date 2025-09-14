"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CheckIcon, CodeIcon, BarChartIcon, ZapIcon, ArrowDownIcon, ArrowDownLeftIcon, ArrowDownRightIcon, BookIcon } from "@/components/icons"
import { useLocalization } from "@/lib/use-localization"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ChartContainer, ChartContent } from "@/components/ui/chart"

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
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg glow-effect overflow-hidden mr-2">
                  <img src="/xiaoprompt_logo.png" alt="XiaoPrompt" className="w-full h-full object-contain" />
                </div>
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
              <Link href="/dashboard" className="group">
                <Card className="neon-border border-primary/50 glow-effect text-center py-3 px-6 w-56 cursor-pointer hover:scale-105 transition-all duration-300 ease-out">
                  <span className="text-lg font-bold text-primary whitespace-nowrap">{text.hero.ctaPrimary}</span>
                </Card>
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
            
            {/* Research Paper Link */}
            <div className="text-center mt-12">
              <Card className="neon-border border-primary/50 glow-effect max-w-sm mx-auto">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-primary text-sm">Research Paper</h3>
                      <p className="text-xs text-muted-foreground">Read our detailed methodology</p>
                    </div>
                    <a 
                      href="/paper.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <span className="text-xs font-medium">View PDF</span>
                      <ArrowRightIcon className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
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
              Validation Results
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Validated with ICT & HP reward models - 96.8% similarity maintained while reducing tokens by 53%
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Chart */}
            <Card className="neon-border border-primary/50 glow-effect h-full">
              <CardHeader>
                <CardTitle className="text-center">Quality vs Efficiency</CardTitle>
                <CardDescription className="text-center">p
                  Optimized prompts maintain near-identical quality with massive efficiency gains
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ChartContainer className="h-80 w-full">
                  <ChartContent>
                    {/* Custom Shadcn Bar Chart */}
                    <div className="flex h-full">
                      {/* Y-axis */}
                      <div className="flex flex-col justify-between text-xs text-muted-foreground pr-3 w-12" style={{ height: '240px', marginTop: '16px', marginBottom: '64px' }}>
                        <span className="leading-none">100%</span>
                        <span className="leading-none">75%</span>
                        <span className="leading-none">50%</span>
                        <span className="leading-none">25%</span>
                        <span className="leading-none">0%</span>
                      </div>
                      
                      {/* Chart area */}
                      <div className="flex-1 relative" style={{ marginTop: '16px', marginBottom: '64px' }}>
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between" style={{ height: '240px' }}>
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-t border-dashed border-muted-foreground/20" />
                          ))}
                        </div>
                        
                        {/* X-axis baseline */}
                        <div className="absolute bottom-0 left-0 right-0 border-t border-muted-foreground/40"></div>
                        
                        {/* Bars container */}
                        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-12" style={{ height: '240px' }}>
                          {[
                            { name: 'Image\nSimilarity', value: 96.8 },
                            { name: 'Quality\nScore', value: 97.1 },
                            { name: 'Human\nPreference', value: 95.7 },
                            { name: 'Token\nUsage', value: 53.0 }
                          ].map((item, index) => (
                            <div key={index} className="flex flex-col items-center group relative">
                              {/* Bar */}
                              <div 
                                className="w-12 bg-black rounded-t-lg border-t border-l border-r border-solid shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden cursor-pointer"
                                style={{ 
                                  height: `${(item.value / 100) * 240}px`,
                                  borderColor: 'rgb(34 197 94)',
                                  backgroundImage: `repeating-linear-gradient(
                                    45deg,
                                    transparent 0px,
                                    transparent 6px,
                                    rgb(34 197 94 / 0.8) 6px,
                                    rgb(34 197 94 / 0.8) 7px
                                  )`
                                }}
                              >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                              </div>
                              
                              {/* Value label positioned above bar */}
                              <div className="absolute left-1/2 transform -translate-x-1/2 text-xs font-semibold text-foreground bg-card/90 backdrop-blur-sm rounded-md px-2 py-1 border border-border/50 shadow-sm whitespace-nowrap" style={{ bottom: `${(item.value / 100) * 240 + 8}px` }}>
                                {item.value}%
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Labels positioned at bottom */}
                        <div className="absolute left-0 right-0 flex justify-between px-12" style={{ top: '256px' }}>
                          {[
                            'Image\nSimilarity',
                            'Quality\nScore', 
                            'Human\nPreference',
                            'Token\nUsage'
                          ].map((name, index) => (
                            <div key={index} className="text-xs text-muted-foreground text-center font-medium leading-tight whitespace-pre-line w-12">
                              {name}
                            </div>
                          ))}
                        </div>
                        
                        {/* Citation */}
                        <div className="absolute left-0 right-0 text-center" style={{ top: '290px' }}>
                          <a 
                            href="https://arxiv.org/abs/2507.19002" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 italic"
                          >
                            Ba et al. (2025). Enhancing Reward Models for High-quality Image Generation
                          </a>
                        </div>
                      </div>
                    </div>
                  </ChartContent>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Research Framework */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Research Framework</h3>
                <p className="text-sm text-muted-foreground">Dual validation using ICT & HP reward models</p>
              </div>

              {/* ICT Model */}
              <Card className="glass-effect">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-blue-500 font-bold">ICT</span>
                      </div>
                      <div>
                        <div className="font-semibold">Image-Contained-Text Framework</div>
                        <div className="text-sm text-muted-foreground">Hierarchical prompt-image pairs with contrastive learning to mitigate bias against visually rich content</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-500">96.8%</div>
                      <div className="text-xs text-muted-foreground">similarity maintained</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* HP Model */}
              <Card className="glass-effect">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-purple-500 font-bold">HP</span>
                      </div>
                      <div>
                        <div className="font-semibold">High-Preference Model</div>
                        <div className="text-sm text-muted-foreground">Pure aesthetic quality assessment using 360K preference triplets for visual quality evaluation</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-500">97.1%</div>
                      <div className="text-xs text-muted-foreground">quality preserved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Results */}
              <Card className="glass-effect border-primary/20">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <div className="font-semibold">Combined Results</div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-2xl font-bold text-primary">53%</div>
                        <div className="text-sm text-muted-foreground">fewer tokens required</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">94.2%</div>
                        <div className="text-sm text-muted-foreground">consistency rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="mt-12">
            <Card className="neon-border border-primary/50 glow-effect">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-lg font-semibold text-primary">
                    🎯 Optimized prompts produce virtually identical images with 53% fewer tokens
                  </div>
                  <div className="text-sm text-muted-foreground max-w-2xl mx-auto">
                    Our dual ICT-HP framework ensures quality preservation while achieving massive efficiency gains. 
                    Perfect for production systems requiring both quality and cost optimization with 94.2% consistency rate.
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

      {/* Team Impact Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Building This Platform: Our Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              In developing this frontend, our team achieved significant efficiency gains that demonstrate the power of prompt optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Token Savings */}
            <Card className="glass-effect">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ZapIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Token Reduction</CardTitle>
                <CardDescription>
                  From 60,000 to 28,200 tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">53%</div>
                  <div className="text-sm text-muted-foreground">
                    Efficiency improvement
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Energy Savings */}
            <Card className="glass-effect">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-2xl">⚡</div>
                </div>
                <CardTitle>Energy Saved</CardTitle>
                <CardDescription>
                  From our personal site optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-600">0.3 kWh</div>
                  <div className="text-sm text-muted-foreground">
                    Energy reduction
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emissions Reduction */}
            <Card className="glass-effect">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-2xl">🌱</div>
                </div>
                <CardTitle>CO₂ Reduced</CardTitle>
                <CardDescription>
                  From our personal site optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-blue-600">0.125g</div>
                  <div className="text-sm text-muted-foreground">
                    Carbon reduction
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scale Impact Section */}
          <div className="mt-16">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Scale Impact: 3.5M Vercel Users
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                This is just the impact from our personal site over the past 24 hours. If Vercel implemented this optimization for all 3.5 million users of v0, assuming an usage rate matching ours, the daily savings would be:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Energy Savings at Scale */}
              <Card className="glass-effect border-green-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-2xl">⚡</div>
                  </div>
                  <CardTitle>Energy Saved</CardTitle>
                  <CardDescription>
                    Daily savings across all users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">1.05M kWh</div>
                    <div className="text-sm text-muted-foreground">
                      Equivalent to 17.5M hours of 60W bulb usage
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CO₂ Savings at Scale */}
              <Card className="glass-effect border-blue-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-2xl">🌱</div>
                  </div>
                  <CardTitle>CO₂ Reduced</CardTitle>
                  <CardDescription>
                    Daily carbon savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">0.44 tons</div>
                    <div className="text-sm text-muted-foreground">
                      Equivalent to 20 trees absorbing CO₂ for a year
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Savings at Scale */}
              <Card className="glass-effect border-yellow-500/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-2xl">💰</div>
                  </div>
                  <CardTitle>Cost Saved</CardTitle>
                  <CardDescription>
                    Daily energy cost savings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-yellow-600">$315K</div>
                    <div className="text-sm text-muted-foreground">
                      At $0.30/kWh electricity rate
                    </div>
                  </div>
                </CardContent>
              </Card>
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
