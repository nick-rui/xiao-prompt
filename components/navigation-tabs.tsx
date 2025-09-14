"use client"
import { cn } from "@/lib/utils"

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="border-b border-border/40">
      <nav className="container mx-auto px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => onTabChange("dashboard")}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "dashboard"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange("playground")}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "playground"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            Playground
          </button>
          <button
            onClick={() => onTabChange("api")}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "api"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            API Guide
          </button>
          <div className="flex-1" />
          <button
            onClick={() => onTabChange("evaluation")}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === "evaluation"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            Evaluation
          </button>
        </div>
      </nav>
    </div>
  )
}
