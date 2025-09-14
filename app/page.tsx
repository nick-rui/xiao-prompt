import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardWrapper } from "@/components/dashboard-wrapper"
import { createClient } from "@/lib/supabase/server"

export default async function Dashboard() {
  const supabase = await createClient()

  // Fetch all prompts data
  const { data: prompts, error } = await supabase.from("prompts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching prompts:", error)
  }

  // Calculate summary metrics
  const summaryMetrics = prompts?.reduce(
    (acc, prompt) => ({
      totalTokensSaved: acc.totalTokensSaved + prompt.tokens_saved,
      totalMoneySaved: acc.totalMoneySaved + prompt.money_saved,
      totalEnergySaved: acc.totalEnergySaved + prompt.energy_saved,
      totalEmissionsSaved: acc.totalEmissionsSaved + prompt.emissions_saved,
    }),
    {
      totalTokensSaved: 0,
      totalMoneySaved: 0,
      totalEnergySaved: 0,
      totalEmissionsSaved: 0,
    },
  ) || {
    totalTokensSaved: 0,
    totalMoneySaved: 0,
    totalEnergySaved: 0,
    totalEmissionsSaved: 0,
  }

  const uniqueUsers = [...new Set(prompts?.map((p) => p.user_name) || [])]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardWrapper prompts={prompts || []} summaryMetrics={summaryMetrics} uniqueUsers={uniqueUsers} />
    </div>
  )
}
