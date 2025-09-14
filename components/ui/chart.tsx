"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Chart container
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full h-full", className)}
    {...props}
  />
))
ChartContainer.displayName = "ChartContainer"

// Chart content wrapper
const ChartContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative w-full h-full", className)}
    {...props}
  />
))
ChartContent.displayName = "ChartContent"

export { ChartContainer, ChartContent }
