"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, X, Calendar, Users, Zap, DollarSign } from "lucide-react"

export function FilterBar() {
  const [filters, setFilters] = useState({
    dateRange: "",
    user: "",
    minTokensSaved: "",
    minMoneySaved: "",
  })

  const clearFilters = () => {
    setFilters({
      dateRange: "",
      user: "",
      minTokensSaved: "",
      minMoneySaved: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card className="glass-effect border-0 neon-border">
      <CardContent className="p-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Filter className="h-4 w-4" />
            </div>
            <Label className="text-sm font-semibold tracking-wide uppercase text-foreground/90">Filters</Label>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="date-range" className="text-sm font-medium whitespace-nowrap">
              Date Range:
            </Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger
                className="w-[140px] glass-effect border-border/50 hover:border-primary/50 transition-colors"
                id="date-range"
              >
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-border/50">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="user-filter" className="text-sm font-medium whitespace-nowrap">
              User:
            </Label>
            <Select value={filters.user} onValueChange={(value) => setFilters((prev) => ({ ...prev, user: value }))}>
              <SelectTrigger
                className="w-[120px] glass-effect border-border/50 hover:border-primary/50 transition-colors"
                id="user-filter"
              >
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-border/50">
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="mike">Mike Johnson</SelectItem>
                <SelectItem value="sarah">Sarah Wilson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-yellow-400" />
            <Label htmlFor="min-tokens" className="text-sm font-medium whitespace-nowrap">
              Min Tokens:
            </Label>
            <Input
              id="min-tokens"
              type="number"
              placeholder="0"
              className="w-24 glass-effect border-border/50 hover:border-primary/50 focus:border-primary transition-colors font-mono"
              value={filters.minTokensSaved}
              onChange={(e) => setFilters((prev) => ({ ...prev, minTokensSaved: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-4 w-4 text-green-400" />
            <Label htmlFor="min-money" className="text-sm font-medium whitespace-nowrap">
              Min $ Saved:
            </Label>
            <Input
              id="min-money"
              type="number"
              placeholder="0"
              className="w-24 glass-effect border-border/50 hover:border-primary/50 focus:border-primary transition-colors font-mono"
              value={filters.minMoneySaved}
              onChange={(e) => setFilters((prev) => ({ ...prev, minMoneySaved: e.target.value }))}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-destructive/30 text-destructive/80 hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
