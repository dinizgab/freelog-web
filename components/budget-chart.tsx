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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { Project } from "@/types/payment"

interface BudgetChartProps {
  projects: Project[]
}

export function BudgetChart({ projects }: BudgetChartProps) {
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
      name: "To Be Paid",
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
    toBePaid: project.payments.filter((p) => p.status === "to-be-paid").reduce((sum, p) => sum + p.amount, 0),
    total: project.budget,
  }))

  // Prepare data for the monthly chart (simplified for demo)
  const currentMonth = new Date().getMonth()
  const monthlyData = Array(6)
    .fill(0)
    .map((_, i) => {
      const month = new Date(2025, currentMonth - 5 + i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })

      // Simulate some monthly data
      const paid =
        i < 3
          ? Math.floor(Math.random() * 3000) + 1000
          : projects.reduce(
              (sum, project) =>
                sum +
                project.payments
                  .filter((p) => p.status === "paid" && new Date(p.paidDate || "").getMonth() === month.getMonth())
                  .reduce((s, p) => s + p.amount, 0),
              0,
            )

      const toBePaid =
        i >= 3
          ? Math.floor(Math.random() * 2000) + 500
          : projects.reduce(
              (sum, project) =>
                sum +
                project.payments
                  .filter((p) => p.status === "to-be-paid" && new Date(p.dueDate).getMonth() === month.getMonth())
                  .reduce((s, p) => s + p.amount, 0),
              0,
            )

      return {
        name: monthName,
        paid: paid,
        toBePaid: toBePaid,
      }
    })

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects">By Project</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="h-[320px]">
        <ChartContainer
          config={{
            paid: {
              label: "Paid",
              color: "hsl(var(--chart-1))",
            },
            toBePaid: {
              label: "To Be Paid",
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
                <Cell key="toBePaid" fill="var(--color-toBePaid)" />
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
            toBePaid: {
              label: "To Be Paid",
              color: "hsl(var(--chart-2))",
            },
            total: {
              label: "Total Budget",
              color: "hsl(var(--chart-3))",
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
              <Bar dataKey="toBePaid" stackId="a" fill="var(--color-toBePaid)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </TabsContent>
      <TabsContent value="monthly" className="h-[320px]">
        <ChartContainer
          config={{
            paid: {
              label: "Paid",
              color: "hsl(var(--chart-1))",
            },
            toBePaid: {
              label: "To Be Paid",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="paid" fill="var(--color-paid)" />
              <Bar dataKey="toBePaid" fill="var(--color-toBePaid)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </TabsContent>
    </Tabs>
  )
}
