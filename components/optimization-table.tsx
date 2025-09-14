"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CompareModal } from "@/components/compare-modal"
import {
  EyeIcon,
  ArrowUpDownIcon,
  ZapIcon,
  DollarSignIcon,
  LeafIcon,
  TrendingUpIcon,
  FilterIcon,
  XIcon,
  CalendarIcon,
  UsersIcon,
} from "@/components/icons"

interface PromptData {
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
}

interface OptimizationTableProps {
  data: PromptData[]
  users: string[]
}

export function OptimizationTable({ data, users }: OptimizationTableProps) {
  const [selectedRow, setSelectedRow] = useState<PromptData | null>(null)
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const [filters, setFilters] = useState({
    dateRange: "",
    user: "",
    minTokensSaved: "",
    minMoneySaved: "",
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const clearFilters = () => {
    setFilters({
      dateRange: "",
      user: "",
      minTokensSaved: "",
      minMoneySaved: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField as keyof PromptData]
    const bValue = b[sortField as keyof PromptData]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

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
    <>
      <Card className="glass-effect border-0 neon-border">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUpIcon className="h-5 w-5" />
            </div>
            Optimization Results
            <Badge variant="secondary" className="ml-auto bg-muted text-foreground font-mono border border-border/50">
              {sortedData.length} records
            </Badge>
          </CardTitle>

          <div className="pt-4 border-t border-border/30 mt-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <FilterIcon className="h-3.5 w-3.5" />
                </div>
                <Label className="text-xs font-semibold tracking-wide uppercase text-foreground/70">Filters</Label>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <Label htmlFor="date-range" className="text-xs font-medium whitespace-nowrap">
                  Date Range:
                </Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger
                    className="w-[120px] h-8 text-xs glass-effect border-border/50 hover:border-primary/50 transition-colors"
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

              <div className="flex items-center gap-2">
                <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <Label htmlFor="user-filter" className="text-xs font-medium whitespace-nowrap">
                  User:
                </Label>
                <Select
                  value={filters.user}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, user: value }))}
                >
                  <SelectTrigger
                    className="w-[100px] h-8 text-xs glass-effect border-border/50 hover:border-primary/50 transition-colors"
                    id="user-filter"
                  >
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-border/50">
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <ZapIcon className="h-3.5 w-3.5 text-yellow-400" />
                <Label htmlFor="min-tokens" className="text-xs font-medium whitespace-nowrap">
                  Min Tokens:
                </Label>
                <Input
                  id="min-tokens"
                  type="number"
                  placeholder="0"
                  className="w-20 h-8 text-xs glass-effect border-border/50 hover:border-primary/50 focus:border-primary transition-colors font-mono"
                  value={filters.minTokensSaved}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minTokensSaved: e.target.value }))}
                />
              </div>

              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-3.5 w-3.5 text-green-400" />
                <Label htmlFor="min-money" className="text-xs font-medium whitespace-nowrap">
                  Min $ Saved:
                </Label>
                <Input
                  id="min-money"
                  type="number"
                  placeholder="0"
                  className="w-20 h-8 text-xs glass-effect border-border/50 hover:border-primary/50 focus:border-primary transition-colors font-mono"
                  value={filters.minMoneySaved}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minMoneySaved: e.target.value }))}
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs border-destructive/30 text-destructive/80 hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 bg-transparent"
                >
                  <XIcon className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="tech-grid rounded-md border-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50 bg-muted/20 hover:bg-muted/30">
                  <TableHead className="w-[200px] font-semibold text-foreground/90">Original Prompt</TableHead>
                  <TableHead className="w-[200px] font-semibold text-foreground/90">Optimized Prompt</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors font-semibold"
                    onClick={() => handleSort("tokens_saved")}
                  >
                    <div className="flex items-center gap-2">
                      <ZapIcon className="h-4 w-4 text-yellow-400" />
                      Tokens Saved
                      <ArrowUpDownIcon className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors font-semibold"
                    onClick={() => handleSort("money_saved")}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSignIcon className="h-4 w-4 text-green-400" />
                      Money Saved
                      <ArrowUpDownIcon className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/90">
                    <div className="flex items-center gap-2">
                      <ZapIcon className="h-4 w-4 text-blue-500" />
                      Energy Saved
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/90">
                    <div className="flex items-center gap-2">
                      <LeafIcon className="h-4 w-4 text-teal-600" />
                      Emissions Saved
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors font-semibold"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-2">
                      Date/Time
                      <ArrowUpDownIcon className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/90">User</TableHead>
                  <TableHead className="font-semibold text-foreground/90">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-border/30 hover:bg-muted/10 transition-all duration-200 group"
                  >
                    <TableCell className="max-w-[200px]">
                      <div
                        className="truncate font-mono text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                        title={row.original_prompt}
                      >
                        {row.original_prompt}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div
                        className="truncate font-mono text-sm text-primary/80 group-hover:text-primary transition-colors"
                        title={row.optimized_prompt}
                      >
                        {row.optimized_prompt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/10 text-yellow-800 border border-yellow-500/20 font-mono hover:bg-yellow-500/20 transition-colors"
                      >
                        {row.tokens_saved.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-400 border border-green-500/20 font-mono hover:bg-green-500/20 transition-colors"
                      >
                        ${row.money_saved.toFixed(4)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-blue-600">{row.energy_saved.toFixed(4)} kWh</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-teal-600">{row.emissions_saved.toFixed(4)} kg CO₂e</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground font-mono">{formatDate(row.created_at)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-primary/80 hover:border-primary hover:text-primary transition-colors"
                      >
                        {row.user_name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRow(row)}
                        className="border-primary/30 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-200 group-hover:scale-105"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Compare
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CompareModal data={selectedRow} open={!!selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)} />
    </>
  )
}
