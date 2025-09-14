import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon, DollarSignIcon, ZapIcon, LeafIcon } from "@/components/icons"

interface SummaryCardsProps {
  metrics: {
    totalTokensSaved: number
    totalMoneySaved: number
    totalEnergySaved: number
    totalEmissionsSaved: number
  }
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const summaryData = [
    {
      title: "Total Tokens Saved",
      value: metrics.totalTokensSaved.toLocaleString(),
      icon: TrendingUpIcon,
      change: "+12.5%",
      changeType: "positive" as const,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400",
    },
    {
      title: "Total Money Saved",
      value: `$${metrics.totalMoneySaved.toFixed(2)}`,
      icon: DollarSignIcon,
      change: "+8.2%",
      changeType: "positive" as const,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-400",
    },
    {
      title: "Total Energy Saved",
      value: `${metrics.totalEnergySaved.toFixed(2)} kWh`,
      icon: ZapIcon,
      change: "+15.3%",
      changeType: "positive" as const,
      gradient: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-400",
    },
    {
      title: "Total Emissions Saved",
      value: `${metrics.totalEmissionsSaved.toFixed(2)} kg CO₂e`,
      icon: LeafIcon,
      change: "+11.7%",
      changeType: "positive" as const,
      gradient: "from-teal-500/20 to-cyan-500/20",
      iconColor: "text-teal-600",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card
          key={item.title}
          className="relative overflow-hidden glass-effect border-0 hover:neon-border transition-all duration-500 group hover:scale-[1.02]"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50`} />

          <div className="shimmer-effect absolute inset-0" />

          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground/80 tracking-wide uppercase">
              {item.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg bg-background/20 ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </CardHeader>

          <CardContent className="relative">
            <div className="text-3xl font-bold font-mono tracking-tight mb-2 text-foreground">{item.value}</div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30">
                <TrendingUpIcon className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary-foreground font-mono">{item.change}</span>
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
