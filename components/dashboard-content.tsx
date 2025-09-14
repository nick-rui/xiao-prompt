import { SummaryCards } from "@/components/summary-cards"
import { OptimizationTable } from "@/components/optimization-table"
import { FilterBar } from "@/components/filter-bar"

interface DashboardContentProps {
  prompts: any[]
  summaryMetrics: {
    totalTokensSaved: number
    totalMoneySaved: number
    totalEnergySaved: number
    totalEmissionsSaved: number
  }
  uniqueUsers: string[]
}

export function DashboardContent({ prompts, summaryMetrics, uniqueUsers }: DashboardContentProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Prompt Optimization Dashboard</h1>
        <p className="text-muted-foreground text-pretty">
          Track and analyze your AI prompt optimization results to improve efficiency and reduce costs.
        </p>
      </div>

      <SummaryCards metrics={summaryMetrics} />

      <div className="space-y-6">
        <FilterBar users={uniqueUsers} />
        <OptimizationTable data={prompts} />
      </div>
    </div>
  )
}
