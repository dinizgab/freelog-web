export type PaymentStatus = "paid" | "to-be-paid"

export interface Payment {
  id: string
  projectId: string
  clientId: string
  amount: number
  description: string
  status: PaymentStatus
  dueDate: string
  paidDate?: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  clientId: string
  clientName: string
  status: "not-started" | "in-progress" | "in-review" | "completed"
  startDate: string
  dueDate: string
  budget: number
  payments: Payment[]
}

export interface Client {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  projects: number
  status: string
}
