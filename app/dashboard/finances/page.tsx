"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetChart } from "@/components/budget-chart"
import { PaymentsList } from "@/components/payments-list"
import { PaymentForm } from "@/components/payment-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, DollarSign, TrendingUp, CreditCard, Calendar } from "lucide-react"
import type { Payment, Project } from "@/types/payment"

// Sample data for demonstration
const sampleProjects: Project[] = [
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
    clientId: "2",
    clientName: "TechStart",
    status: "in-review",
    startDate: "2025-05-20",
    dueDate: "2025-06-25",
    budget: 3500,
    payments: [
      {
        id: "p3",
        projectId: "2",
        clientId: "2",
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
        clientId: "2",
        amount: 1750,
        description: "Final Payment",
        status: "to-be-paid",
        dueDate: "2025-06-25",
        createdAt: "2025-05-15",
      },
    ],
  },
  {
    id: "3",
    name: "Marketing Campaign",
    clientId: "3",
    clientName: "Global Foods",
    status: "in-progress",
    startDate: "2025-06-01",
    dueDate: "2025-07-05",
    budget: 4000,
    payments: [
      {
        id: "p5",
        projectId: "3",
        clientId: "3",
        amount: 1000,
        description: "25% Upfront Payment",
        status: "paid",
        dueDate: "2025-06-01",
        paidDate: "2025-06-01",
        createdAt: "2025-05-25",
      },
      {
        id: "p6",
        projectId: "3",
        clientId: "3",
        amount: 1500,
        description: "Progress Payment",
        status: "to-be-paid",
        dueDate: "2025-06-15",
        createdAt: "2025-05-25",
      },
      {
        id: "p7",
        projectId: "3",
        clientId: "3",
        amount: 1500,
        description: "Final Payment",
        status: "to-be-paid",
        dueDate: "2025-07-05",
        createdAt: "2025-05-25",
      },
    ],
  },
]

export default function FinancesPage() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects)
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate total budget, paid, and to be paid amounts
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0)
  const totalPaid = projects.reduce(
    (sum, project) => sum + project.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    0,
  )
  const totalToBePaid = projects.reduce(
    (sum, project) => sum + project.payments.filter((p) => p.status === "to-be-paid").reduce((s, p) => s + p.amount, 0),
    0,
  )

  // Get all payments across all projects
  const allPayments = projects.flatMap((project) =>
    project.payments.map((payment) => ({
      ...payment,
      projectName: project.name,
      clientName: project.clientName,
    })),
  )

  // Function to mark a payment as paid
  const markAsPaid = (paymentId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => ({
        ...project,
        payments: project.payments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, status: "paid", paidDate: new Date().toISOString().split("T")[0] }
            : payment,
        ),
      })),
    )
  }

  // Function to add a new payment
  const addPayment = (newPayment: Omit<Payment, "id" | "createdAt">) => {
    const paymentToAdd = {
      ...newPayment,
      id: `p${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === newPayment.projectId ? { ...project, payments: [...project.payments, paymentToAdd] } : project,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Finances</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Payment</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Payment</DialogTitle>
              <DialogDescription>Create a new payment for a project.</DialogDescription>
            </DialogHeader>
            <PaymentForm projects={projects} onSubmit={addPayment} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {projects.length} projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalPaid / totalBudget) * 100).toFixed(1)}% of total budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">To Be Paid</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalToBePaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalToBePaid / totalBudget) * 100).toFixed(1)}% of total budget
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPaid / 3).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Average for last 3 months</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Visualization of your budget, paid amounts, and upcoming payments</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BudgetChart projects={projects} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>Manage and track all project payments</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentsList payments={allPayments} onMarkAsPaid={markAsPaid} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Finances</CardTitle>
              <CardDescription>Financial breakdown by project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <div className="text-sm font-medium">Client: {project.clientName}</div>
                      </div>
                      <CardDescription>
                        Budget: ${project.budget.toLocaleString()} • Due:{" "}
                        {new Date(project.dueDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
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
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Payments</h4>
                          <div className="space-y-1">
                            {project.payments.map((payment) => (
                              <div key={payment.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      payment.status === "paid" ? "bg-green-500" : "bg-amber-500"
                                    }`}
                                  />
                                  <span>{payment.description}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span>${payment.amount.toLocaleString()}</span>
                                  {payment.status === "to-be-paid" && (
                                    <Button variant="outline" size="sm" onClick={() => markAsPaid(payment.id)}>
                                      Mark as Paid
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
