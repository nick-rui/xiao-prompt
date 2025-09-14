"use client"

import { useState } from "react"
import { NavigationTabs } from "@/components/navigation-tabs"
import { Playground } from "@/components/playground"
import { DashboardContent } from "@/components/dashboard-content"

interface DashboardWrapperProps {
  prompts: any[]
  summaryMetrics: {
    totalTokensSaved: number
    totalMoneySaved: number
    totalEnergySaved: number
    totalEmissionsSaved: number
  }
  uniqueUsers: string[]
}

export function DashboardWrapper({ prompts, summaryMetrics, uniqueUsers }: DashboardWrapperProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <>
      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-6 py-8">
        {activeTab === "dashboard" ? (
          <DashboardContent prompts={prompts} summaryMetrics={summaryMetrics} uniqueUsers={uniqueUsers} />
        ) : (
          <Playground />
        )}
      </main>
    </>
  )
}
