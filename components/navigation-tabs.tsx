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
        </div>
      </nav>
    </div>
  )
}
