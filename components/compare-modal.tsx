"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, DollarSign, Zap, Leaf, User, Calendar, FileText, Target } from "lucide-react"

interface CompareModalProps {
  data: {
    id: string
    originalPrompt: string
    optimizedPrompt: string
    tokensSaved: number
    moneySaved: number
    energySaved: number
    emissionsSaved: number
    dateProcessed: string
    user: string
    improvementNotes: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompareModal({ data, open, onOpenChange }: CompareModalProps) {
  if (!data) return null

  const metrics = [
    {
      label: "Tokens Saved",
      value: data.tokensSaved.toLocaleString(),
      icon: TrendingUp,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      label: "Money Saved",
      value: `$${data.moneySaved.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "Energy Saved",
      value: `${data.energySaved.toFixed(2)} kWh`,
      icon: Zap,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Emissions Saved",
      value: `${data.emissionsSaved.toFixed(2)} kg CO₂e`,
      icon: Leaf,
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto glass-effect border-border/50">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            Prompt Optimization Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-2">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/20 border border-border/50">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{data.user}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/20 border border-border/50">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-mono text-foreground">{data.dateProcessed}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-effect border-destructive/20">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-lg text-destructive flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  Original Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90">
                    {data.originalPrompt}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium">
                    <strong>Length:</strong> {data.originalPrompt.length} characters
                  </span>
                  <span className="font-medium">
                    <strong>Words:</strong> {data.originalPrompt.split(" ").length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="text-lg text-primary flex items-center gap-3">
                  <Target className="h-5 w-5" />
                  Optimized Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90">
                    {data.optimizedPrompt}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium">
                    <strong>Length:</strong> {data.optimizedPrompt.length} characters
                  </span>
                  <span className="font-medium">
                    <strong>Words:</strong> {data.optimizedPrompt.split(" ").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              Optimization Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric) => (
                <Card
                  key={metric.label}
                  className={`glass-effect ${metric.borderColor} hover:scale-105 transition-transform duration-200`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold font-mono ${metric.color}`}>{metric.value}</div>
                        <div className="text-xs text-muted-foreground font-medium">{metric.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Improvement Notes */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              Improvement Notes
            </h3>
            <Card className="glass-effect border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed text-pretty text-foreground/90 font-medium">
                  {data.improvementNotes}
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              Efficiency Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-effect border-primary/20 hover:scale-105 transition-transform duration-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-mono mb-2">
                      {Math.round(
                        ((data.originalPrompt.length - data.optimizedPrompt.length) / data.originalPrompt.length) * 100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Length Reduction</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-yellow-500/20 hover:scale-105 transition-transform duration-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 font-mono mb-2">{data.tokensSaved}</div>
                    <div className="text-sm text-muted-foreground font-medium">Tokens Saved</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-green-500/20 hover:scale-105 transition-transform duration-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 font-mono mb-2">
                      ${data.moneySaved.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Cost Savings</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
