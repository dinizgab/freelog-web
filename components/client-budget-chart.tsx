"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/types/payment"

interface ClientBudgetChartProps {
  projects: Project[]
}

export function ClientBudgetChart({ projects }: ClientBudgetChartProps) {
  // Prepare data for the overview chart
  const overviewData = [
    {
      name: "Paid",
      value: projects.reduce(
        (sum, project) => sum + project.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
        0,
      ),
    },
    {
      name: "Due",
      value: projects.reduce(
        (sum, project) =>
          sum + project.payments.filter((p) => p.status === "to-be-paid").reduce((s, p) => s + p.amount, 0),
        0,
      ),
    },
  ]

  // Prepare data for the projects chart
  const projectsData = projects.map((project) => ({
    name: project.name,
    paid: project.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    due: project.payments.filter((p) => p.status === "to-be-paid").reduce((sum, p) => sum + p.amount, 0),
    total: project.budget,
  }))

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Payment Status</TabsTrigger>
        <TabsTrigger value="projects">By Project</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="h-[320px]">
        <ChartContainer
          config={{
            paid: {
              label: "Paid",
              color: "hsl(var(--chart-1))",
            },
            due: {
              label: "Due",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={overviewData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                <Cell key="paid" fill="var(--color-paid)" />
                <Cell key="due" fill="var(--color-due)" />
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </TabsContent>
      <TabsContent value="projects" className="h-[320px]">
        <ChartContainer
          config={{
            paid: {
              label: "Paid",
              color: "hsl(var(--chart-1))",
            },
            due: {
              label: "Due",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectsData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="paid" stackId="a" fill="var(--color-paid)" />
              <Bar dataKey="due" stackId="a" fill="var(--color-due)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </TabsContent>
    </Tabs>
  )
}
