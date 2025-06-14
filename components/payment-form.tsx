"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Payment, Project } from "@/types/payment"

interface PaymentFormProps {
  projects: Project[]
  onSubmit: (payment: Omit<Payment, "id" | "createdAt">) => void
}

export function PaymentForm({ projects, onSubmit }: PaymentFormProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [dueDate, setDueDate] = useState<string>("")
  const [status, setStatus] = useState<"paid" | "to-be-paid">("to-be-paid")
  const [paidDate, setPaidDate] = useState<string>("")

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProjectId || !amount || !description || !dueDate) {
      return
    }

    const newPayment: Omit<Payment, "id" | "createdAt"> = {
      projectId: selectedProjectId,
      clientId: selectedProject?.clientId || "",
      amount: Number.parseFloat(amount),
      description,
      status,
      dueDate,
      ...(status === "paid" && paidDate ? { paidDate } : {}),
    }

    onSubmit(newPayment)

    // Reset form
    setSelectedProjectId("")
    setAmount("")
    setDescription("")
    setDueDate("")
    setStatus("to-be-paid")
    setPaidDate("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project">Project</Label>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger id="project">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name} ({project.clientName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="e.g., Initial deposit, Final payment, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: "paid" | "to-be-paid") => setStatus(value)}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to-be-paid">To Be Paid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {status === "paid" && (
        <div className="space-y-2">
          <Label htmlFor="paidDate">Payment Date</Label>
          <Input id="paidDate" type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} required />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit">Add Payment</Button>
      </div>
    </form>
  )
}
