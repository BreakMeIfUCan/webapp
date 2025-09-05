"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Eye, Trash2 } from "lucide-react"
import { useState } from "react"

// Placeholder data - replace with server actions later
const tests = [
  {
    id: "test-001",
    name: "GPT-4 Adversarial Test",
    model: "GPT-4",
    type: "Adversarial",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T10:32:34Z",
    duration: "2m 34s",
    successRate: 85.2,
    totalPrompts: 1000,
  },
  {
    id: "test-002",
    name: "Vision Model Robustness",
    model: "CLIP",
    type: "Robustness",
    status: "running",
    createdAt: "2024-01-15T11:15:00Z",
    completedAt: null,
    duration: "1m 12s",
    successRate: null,
    totalPrompts: 500,
  },
  {
    id: "test-003",
    name: "BERT Sentiment Analysis",
    model: "BERT",
    type: "Sentiment",
    status: "failed",
    createdAt: "2024-01-15T09:45:00Z",
    completedAt: "2024-01-15T09:46:30Z",
    duration: "0m 45s",
    successRate: null,
    totalPrompts: 200,
  },
  {
    id: "test-004",
    name: "DALL-E Image Generation",
    model: "DALL-E 3",
    type: "Generation",
    status: "completed",
    createdAt: "2024-01-14T16:20:00Z",
    completedAt: "2024-01-14T16:25:15Z",
    duration: "5m 15s",
    successRate: 92.8,
    totalPrompts: 50,
  },
  {
    id: "test-005",
    name: "Code Generation Test",
    model: "Codex",
    type: "Code Generation",
    status: "completed",
    createdAt: "2024-01-14T14:10:00Z",
    completedAt: "2024-01-14T14:12:45Z",
    duration: "2m 45s",
    successRate: 78.5,
    totalPrompts: 300,
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800",
  running: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
}

export default function TestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test History</h1>
          <p className="text-muted-foreground">
            View and manage all your model tests
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="running">Running</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tests ({filteredTests.length})</CardTitle>
          <CardDescription>
            Complete history of your model testing experiments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>{test.model}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{test.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[test.status as keyof typeof statusColors]}>
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(test.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{test.duration}</TableCell>
                  <TableCell>
                    {test.successRate ? `${test.successRate}%` : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
