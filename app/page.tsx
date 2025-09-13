import { DashboardHeader } from "@/components/dashboard-header"
import { SummaryCards } from "@/components/summary-cards"
import { OptimizationTable } from "@/components/optimization-table"
import { FilterBar } from "@/components/filter-bar"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Prompt Optimization Dashboard</h1>
          <p className="text-muted-foreground text-pretty">
            Track and analyze your AI prompt optimization results to improve efficiency and reduce costs.
          </p>
        </div>

        <SummaryCards />

        <div className="space-y-6">
          <FilterBar />
          <OptimizationTable />
        </div>
      </main>
    </div>
  )
}
