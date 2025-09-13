"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CompareModal } from "@/components/compare-modal"
import { Eye, ArrowUpDown, Zap, DollarSign, Leaf, TrendingUp } from "lucide-react"

// Sample data - replace with real data later
const optimizationData = [
  {
    id: "1",
    originalPrompt:
      "Please analyze the following customer feedback and provide detailed insights about sentiment, key themes, and actionable recommendations for improvement...",
    optimizedPrompt: "Analyze customer feedback for: sentiment, themes, improvement recommendations.",
    tokensSaved: 1247,
    moneySaved: 2.34,
    energySaved: 0.89,
    emissionsSaved: 0.64,
    dateProcessed: "2024-01-15 14:30",
    user: "John Doe",
    improvementNotes: "Reduced verbose instructions while maintaining core requirements. Eliminated redundant phrases.",
  },
  {
    id: "2",
    originalPrompt:
      "I need you to write a comprehensive email to our customers explaining the new features we have launched, including all the technical details and benefits...",
    optimizedPrompt: "Write customer email about new features: technical details, benefits, launch announcement.",
    tokensSaved: 892,
    moneySaved: 1.67,
    energySaved: 0.64,
    emissionsSaved: 0.46,
    dateProcessed: "2024-01-15 13:15",
    user: "Jane Smith",
    improvementNotes: "Streamlined request structure. Removed unnecessary context while preserving key requirements.",
  },
  {
    id: "3",
    originalPrompt:
      "Can you help me create a detailed project plan for our upcoming software development initiative that includes timelines, resources, milestones, and risk assessment...",
    optimizedPrompt: "Create software project plan: timelines, resources, milestones, risk assessment.",
    tokensSaved: 1456,
    moneySaved: 2.73,
    energySaved: 1.04,
    emissionsSaved: 0.75,
    dateProcessed: "2024-01-15 11:45",
    user: "Mike Johnson",
    improvementNotes: "Converted verbose request to structured format. Maintained all essential components.",
  },
  {
    id: "4",
    originalPrompt:
      "Please review this code and tell me if there are any bugs, performance issues, security vulnerabilities, or areas for improvement...",
    optimizedPrompt: "Code review: bugs, performance, security, improvements.",
    tokensSaved: 634,
    moneySaved: 1.19,
    energySaved: 0.45,
    emissionsSaved: 0.33,
    dateProcessed: "2024-01-15 10:20",
    user: "Sarah Wilson",
    improvementNotes: "Simplified review criteria list. Eliminated redundant explanatory text.",
  },
  {
    id: "5",
    originalPrompt:
      "I would like you to generate a comprehensive marketing strategy document that covers target audience analysis, competitive landscape, positioning, messaging, and campaign recommendations...",
    optimizedPrompt:
      "Generate marketing strategy: audience analysis, competitive landscape, positioning, messaging, campaigns.",
    tokensSaved: 1823,
    moneySaved: 3.42,
    energySaved: 1.31,
    emissionsSaved: 0.94,
    dateProcessed: "2024-01-15 09:10",
    user: "John Doe",
    improvementNotes:
      "Restructured as concise list format. Preserved all strategic components while reducing token count.",
  },
]

export function OptimizationTable() {
  const [selectedRow, setSelectedRow] = useState<(typeof optimizationData)[0] | null>(null)
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedData = [...optimizationData].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  return (
    <>
      <Card className="glass-effect border-0 neon-border">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            Optimization Results
            <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary font-mono">
              {sortedData.length} records
            </Badge>
          </CardTitle>
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
                    onClick={() => handleSort("tokensSaved")}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      Tokens Saved
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors font-semibold"
                    onClick={() => handleSort("moneySaved")}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      Money Saved
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/90">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      Energy Saved
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground/90">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-teal-400" />
                      Emissions Saved
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-primary transition-colors font-semibold"
                    onClick={() => handleSort("dateProcessed")}
                  >
                    <div className="flex items-center gap-2">
                      Date/Time
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
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
                        title={row.originalPrompt}
                      >
                        {row.originalPrompt}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div
                        className="truncate font-mono text-sm text-primary/80 group-hover:text-primary transition-colors"
                        title={row.optimizedPrompt}
                      >
                        {row.optimizedPrompt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-mono hover:bg-yellow-500/20 transition-colors"
                      >
                        {row.tokensSaved.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-green-500/10 text-green-400 border border-green-500/20 font-mono hover:bg-green-500/20 transition-colors"
                      >
                        ${row.moneySaved.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-blue-400">{row.energySaved.toFixed(2)} kWh</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-teal-400">{row.emissionsSaved.toFixed(2)} kg CO₂e</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground font-mono">{row.dateProcessed}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-primary/80 hover:border-primary hover:text-primary transition-colors"
                      >
                        {row.user}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRow(row)}
                        className="border-primary/30 text-primary/80 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-200 group-hover:scale-105"
                      >
                        <Eye className="h-4 w-4 mr-2" />
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
