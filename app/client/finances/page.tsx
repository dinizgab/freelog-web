"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClientBudgetChart } from "@/components/client-budget-chart"
import type { Project } from "@/types/payment"

// Sample data for demonstration - in a real app, this would be fetched from an API
const clientProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    clientId: "1",
    clientName: "Acme Inc",
    status: "in-progress",
    startDate: "2025-05-15",
    dueDate: "2025-06-20",
    budget: 5000,
    payments: [
      {
        id: "p1",
        projectId: "1",
        clientId: "1",
        amount: 2500,
        description: "50% Upfront Payment",
        status: "paid",
        dueDate: "2025-05-15",
        paidDate: "2025-05-15",
        createdAt: "2025-05-10",
      },
      {
        id: "p2",
        projectId: "1",
        clientId: "1",
        amount: 2500,
        description: "Final Payment",
        status: "to-be-paid",
        dueDate: "2025-06-20",
        createdAt: "2025-05-10",
      },
    ],
  },
  {
    id: "2",
    name: "Brand Identity",
    clientId: "1",
    clientName: "Acme Inc",
    status: "in-review",
    startDate: "2025-05-20",
    dueDate: "2025-06-25",
    budget: 3500,
    payments: [
      {
        id: "p3",
        projectId: "2",
        clientId: "1",
        amount: 1750,
        description: "50% Upfront Payment",
        status: "paid",
        dueDate: "2025-05-20",
        paidDate: "2025-05-20",
        createdAt: "2025-05-15",
      },
      {
        id: "p4",
        projectId: "2",
        clientId: "1",
        amount: 1750,
        description: "Final Payment",
        status: "to-be-paid",
        dueDate: "2025-06-25",
        createdAt: "2025-05-15",
      },
    ],
  },
]

export default function ClientFinancesPage() {
  // Calculate total budget, paid, and to be paid amounts
  const totalBudget = clientProjects.reduce((sum, project) => sum + project.budget, 0)
  const totalPaid = clientProjects.reduce(
    (sum, project) => sum + project.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    0,
  )
  const totalToBePaid = clientProjects.reduce(
    (sum, project) => sum + project.payments.filter((p) => p.status === "to-be-paid").reduce((s, p) => s + p.amount, 0),
    0,
  )

  // Get all payments across all projects
  const allPayments = clientProjects.flatMap((project) =>
    project.payments.map((payment) => ({
      ...payment,
      projectName: project.name,
    })),
  )

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Project Finances</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Project Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid to Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((totalPaid / totalBudget) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalToBePaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalToBePaid / totalBudget) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
            <TabsTrigger value="projects">Project Breakdown</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Visualization of your project budgets and payment status</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ClientBudgetChart projects={clientProjects} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
              <CardDescription>All payments for your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.projectName}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "paid" ? "default" : "secondary"}>
                          {payment.status === "paid" ? "Paid" : "Due"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <div className="grid gap-4">
            {clientProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    Budget: ${project.budget.toLocaleString()} • Due: {new Date(project.dueDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Payment Progress</span>
                        <span>
                          $
                          {project.payments
                            .filter((p) => p.status === "paid")
                            .reduce((sum, p) => sum + p.amount, 0)
                            .toLocaleString()}{" "}
                          / ${project.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(project.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0) / project.budget) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Payment Schedule</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {project.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.description}</TableCell>
                              <TableCell>${payment.amount.toLocaleString()}</TableCell>
                              <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge variant={payment.status === "paid" ? "default" : "secondary"}>
                                  {payment.status === "paid" ? "Paid" : "Due"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
