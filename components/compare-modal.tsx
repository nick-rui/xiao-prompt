"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUpIcon,
  DollarSignIcon,
  ZapIcon,
  LeafIcon,
  UserIcon,
  CalendarIcon,
  FileTextIcon,
  TargetIcon,
} from "@/components/icons"

interface CompareModalProps {
  data: {
    id: string
    original_prompt: string
    optimized_prompt: string
    original_tokens: number
    optimized_tokens: number
    tokens_saved: number
    money_saved: number
    energy_saved: number
    emissions_saved: number
    user_name: string
    created_at: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompareModal({ data, open, onOpenChange }: CompareModalProps) {
  if (!data) return null

  const metrics = [
    {
      label: "Tokens Saved",
      value: data.tokens_saved.toLocaleString(),
      icon: TrendingUpIcon,
      color: "text-yellow-800",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      label: "Money Saved",
      value: `$${data.money_saved.toFixed(4)}`,
      icon: DollarSignIcon,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "Energy Saved",
      value: `${data.energy_saved.toFixed(4)} kWh`,
      icon: ZapIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Emissions Saved",
      value: `${data.emissions_saved.toFixed(4)} kg CO₂e`,
      icon: LeafIcon,
      color: "text-teal-600",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto glass-effect border-border/50">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TargetIcon className="h-6 w-6" />
            </div>
            Prompt Optimization Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-2">
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/20 border border-border/50">
              <UserIcon className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{data.user_name}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/20 border border-border/50">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-mono text-foreground">{formatDate(data.created_at)}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="glass-effect border-destructive/20">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-lg text-destructive flex items-center gap-3">
                  <FileTextIcon className="h-5 w-5" />
                  Original Prompt
                  <span className="ml-auto text-sm font-mono text-muted-foreground">{data.original_tokens} tokens</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-lg min-h-[200px]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90 break-words">
                    {data.original_prompt}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium">
                    <strong>Length:</strong> {data.original_prompt.length} characters
                  </span>
                  <span className="font-medium">
                    <strong>Words:</strong> {data.original_prompt.split(" ").length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="text-lg text-primary flex items-center gap-3">
                  <TargetIcon className="h-5 w-5" />
                  Optimized Prompt
                  <span className="ml-auto text-sm font-mono text-muted-foreground">
                    {data.optimized_tokens} tokens
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg min-h-[200px]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90 break-words">
                    {data.optimized_prompt}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium">
                    <strong>Length:</strong> {data.optimized_prompt.length} characters
                  </span>
                  <span className="font-medium">
                    <strong>Words:</strong> {data.optimized_prompt.split(" ").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
              Optimization Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric) => (
                <Card
                  key={metric.label}
                  className={`glass-effect ${metric.borderColor} hover:scale-105 transition-transform duration-200`}
                >
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                      </div>
                      <div className="text-right flex-1 ml-4">
                        <div className={`text-2xl font-bold font-mono ${metric.color} break-all`}>{metric.value}</div>
                        <div className="text-xs text-muted-foreground font-medium">{metric.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <TrendingUpIcon className="h-5 w-5" />
              </div>
              Efficiency Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-effect border-primary/20 hover:scale-105 transition-transform duration-200">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary font-mono mb-2">
                      {Math.round(
                        ((data.original_prompt.length - data.optimized_prompt.length) / data.original_prompt.length) *
                          100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Length Reduction</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-yellow-500/20 hover:scale-105 transition-transform duration-200">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-800 font-mono mb-2">{data.tokens_saved.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground font-medium">Tokens Saved</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-effect border-green-500/20 hover:scale-105 transition-transform duration-200">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 font-mono mb-2">
                      ${data.money_saved.toFixed(4)}
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
