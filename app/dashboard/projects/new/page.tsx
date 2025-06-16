"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarIcon, DollarSign, Plus, FileText } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { ProjectStatus } from "@/types/project"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

// Sample clients data - in a real app, this would come from an API
const clients = [
    { id: "client1", name: "Acme Inc", contact: "John Smith", email: "john@acmeinc.com" },
    { id: "client2", name: "TechStart", contact: "Sarah Johnson", email: "sarah@techstart.io" },
    { id: "client3", name: "Global Foods", contact: "Michael Brown", email: "michael@globalfoods.com" },
    { id: "client4", name: "Fitness Pro", contact: "Jessica Lee", email: "jessica@fitnesspro.com" },
    { id: "client5", name: "Retail Shop", contact: "David Wilson", email: "david@retailshop.com" },
]

interface DeliverableFormData {
    name: string
    description: string
    dueDate: Date | undefined
}

interface ProjectFormData {
    name: string
    description: string
    clientId: string
    status: ProjectStatus
    startDate: Date | undefined
    dueDate: Date | undefined
    budget: string
    includeDeliverable: boolean
    deliverable: DeliverableFormData
}

interface FormErrors {
    name?: string
    description?: string
    clientId?: string
    startDate?: string
    dueDate?: string
    budget?: string
    deliverable?: {
        name?: string
        description?: string
        dueDate?: string
    }
}

export default function NewProjectPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})

    const [formData, setFormData] = useState<ProjectFormData>({
        name: "",
        description: "",
        clientId: "",
        status: "not-started",
        startDate: new Date(),
        dueDate: undefined,
        budget: "",
        includeDeliverable: false,
        deliverable: {
            name: "",
            description: "",
            dueDate: undefined,
        },
    })

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Project name validation
        if (!formData.name.trim()) {
            newErrors.name = "Project name is required"
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Project name must be at least 3 characters"
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = "Project description is required"
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters"
        }

        // Client validation
        if (!formData.clientId) {
            newErrors.clientId = "Please select a client"
        }

        // Start date validation
        if (!formData.startDate) {
            newErrors.startDate = "Start date is required"
        }

        // Due date validation
        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required"
        } else if (formData.startDate && formData.dueDate < formData.startDate) {
            newErrors.dueDate = "Due date must be after start date"
        }

        // Budget validation
        if (!formData.budget.trim()) {
            newErrors.budget = "Budget is required"
        } else {
            const budgetNumber = Number.parseFloat(formData.budget)
            if (isNaN(budgetNumber) || budgetNumber <= 0) {
                newErrors.budget = "Budget must be a valid positive number"
            }
        }

        // Deliverable validation (if included)
        if (formData.includeDeliverable) {
            const deliverableErrors: FormErrors["deliverable"] = {}

            if (!formData.deliverable.name.trim()) {
                deliverableErrors.name = "Deliverable name is required"
            } else if (formData.deliverable.name.trim().length < 3) {
                deliverableErrors.name = "Deliverable name must be at least 3 characters"
            }

            if (!formData.deliverable.description.trim()) {
                deliverableErrors.description = "Deliverable description is required"
            } else if (formData.deliverable.description.trim().length < 10) {
                deliverableErrors.description = "Description must be at least 10 characters"
            }

            if (!formData.deliverable.dueDate) {
                deliverableErrors.dueDate = "Deliverable due date is required"
            } else if (formData.startDate && formData.deliverable.dueDate < formData.startDate) {
                deliverableErrors.dueDate = "Deliverable due date must be after project start date"
            } else if (formData.dueDate && formData.deliverable.dueDate > formData.dueDate) {
                deliverableErrors.dueDate = "Deliverable due date must be before or on project due date"
            }

            if (Object.keys(deliverableErrors).length > 0) {
                newErrors.deliverable = deliverableErrors
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof ProjectFormData | string, value: string | Date | undefined | boolean) => {
        if (field.startsWith("deliverable.")) {
            const deliverableField = field.split(".")[1] as keyof DeliverableFormData
            setFormData((prev) => ({
                ...prev,
                deliverable: {
                    ...prev.deliverable,
                    [deliverableField]: value,
                },
            }))

            // Clear deliverable error for this field
            if (errors.deliverable?.[deliverableField as keyof typeof errors.deliverable]) {
                setErrors((prev) => ({
                    ...prev,
                    deliverable: {
                        ...prev.deliverable,
                        [deliverableField]: undefined,
                    },
                }))
            }
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }))

            // Clear error for this field when user starts typing
            if (errors[field as keyof FormErrors]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }))
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting")
            return
        }

        setIsSubmitting(true)

        try {
            // Simulate API call to create project
            await new Promise((resolve) => setTimeout(resolve, 1500))

            const selectedClient = clients.find((c) => c.id === formData.clientId)

            // In a real app, you would make an API call here
            const projectData = {
                ...formData,
                budget: Number.parseFloat(formData.budget),
                clientName: selectedClient?.name,
            }

            console.log("Creating project:", projectData)

            if (formData.includeDeliverable) {
                console.log("Creating deliverable:", formData.deliverable)
                toast.success("Project and deliverable created successfully!")
            } else {
                toast.success("Project created successfully!")
            }

            // Redirect to projects list or the new project detail page
            router.push("/dashboard/projects")
        } catch (error) {
            console.error("Error creating project:", error)
            toast.error("Failed to create project. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedClient = clients.find((c) => c.id === formData.clientId)

    return (
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center gap-2">
                <Link href="/dashboard/projects">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to projects</span>
                    </Button>
                </Link>
                <h1 className="text-lg font-semibold md:text-2xl">Create New Project</h1>
            </div>

            <div className="w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>Fill in the information below to create a new project for your client.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Project Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="e.g., Website Redesign, Brand Identity"
                                    className={errors.name ? "border-destructive" : ""}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            {/* Client Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="client">Client *</Label>
                                <Select value={formData.clientId} onValueChange={(value) => handleInputChange("clientId", value)}>
                                    <SelectTrigger className={errors.clientId ? "border-destructive" : ""}>
                                        <SelectValue placeholder="Select a client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{client.name}</span>
                                                    <span className="text-sm text-muted-foreground">{client.contact}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.clientId && <p className="text-sm text-destructive">{errors.clientId}</p>}
                                {selectedClient && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline">
                                            {selectedClient.name} - {selectedClient.contact}
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Project Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Project Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Describe the project scope, objectives, and key deliverables..."
                                    rows={4}
                                    className={errors.description ? "border-destructive" : ""}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
                            </div>

                            {/* Dates */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Start Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.startDate && "text-muted-foreground",
                                                    errors.startDate && "border-destructive",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a start date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.startDate}
                                                onSelect={(date) => handleInputChange("startDate", date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Due Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.dueDate && "text-muted-foreground",
                                                    errors.dueDate && "border-destructive",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a due date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formData.dueDate}
                                                onSelect={(date) => handleInputChange("dueDate", date)}
                                                initialFocus
                                                disabled={(date) => (formData.startDate ? date < formData.startDate : false)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate}</p>}
                                </div>
                            </div>

                            {/* Budget and Status */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="budget">Budget (BRL) *</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="budget"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.budget}
                                            onChange={(e) => handleInputChange("budget", e.target.value)}
                                            placeholder="5000.00"
                                            className={cn("pl-9", errors.budget && "border-destructive")}
                                        />
                                    </div>
                                    {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Initial Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value: ProjectStatus) => handleInputChange("status", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="not-started">Not Started</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Deliverable Section */}
                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-medium">Add Initial Deliverable</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Optionally add a deliverable to get started with this project
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.includeDeliverable}
                                        onCheckedChange={(checked) => handleInputChange("includeDeliverable", checked)}
                                    />
                                </div>

                                {formData.includeDeliverable && (
                                    <Card className="border-dashed">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                <CardTitle className="text-base">Deliverable Details</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Deliverable Name */}
                                            <div className="space-y-2">
                                                <Label htmlFor="deliverable-name">Deliverable Name *</Label>
                                                <Input
                                                    id="deliverable-name"
                                                    value={formData.deliverable.name}
                                                    onChange={(e) => handleInputChange("deliverable.name", e.target.value)}
                                                    placeholder="e.g., Homepage Design, Logo Concepts"
                                                    className={errors.deliverable?.name ? "border-destructive" : ""}
                                                />
                                                {errors.deliverable?.name && (
                                                    <p className="text-sm text-destructive">{errors.deliverable.name}</p>
                                                )}
                                            </div>

                                            {/* Deliverable Description */}
                                            <div className="space-y-2">
                                                <Label htmlFor="deliverable-description">Deliverable Description *</Label>
                                                <Textarea
                                                    id="deliverable-description"
                                                    value={formData.deliverable.description}
                                                    onChange={(e) => handleInputChange("deliverable.description", e.target.value)}
                                                    placeholder="Describe what will be delivered, specifications, and requirements..."
                                                    rows={3}
                                                    className={errors.deliverable?.description ? "border-destructive" : ""}
                                                />
                                                {errors.deliverable?.description && (
                                                    <p className="text-sm text-destructive">{errors.deliverable.description}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {formData.deliverable.description.length}/300 characters
                                                </p>
                                            </div>

                                            {/* Deliverable Due Date */}
                                            <div className="space-y-2">
                                                <Label>Deliverable Due Date *</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !formData.deliverable.dueDate && "text-muted-foreground",
                                                                errors.deliverable?.dueDate && "border-destructive",
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {formData.deliverable.dueDate ? (
                                                                format(formData.deliverable.dueDate, "PPP")
                                                            ) : (
                                                                <span>Pick deliverable due date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={formData.deliverable.dueDate}
                                                            onSelect={(date) => handleInputChange("deliverable.dueDate", date)}
                                                            initialFocus
                                                            disabled={(date) => {
                                                                const minDate = formData.startDate || new Date()
                                                                const maxDate = formData.dueDate
                                                                if (date < minDate) return true;
                                                                if (maxDate && date > maxDate) return true;
                                                                return false
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {errors.deliverable?.dueDate && (
                                                    <p className="text-sm text-destructive">{errors.deliverable.dueDate}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    Must be between project start date and project due date
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 pt-4">
                                <Link href="/dashboard/projects">
                                    <Button variant="outline" type="button" className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                                    {isSubmitting ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                            Creating Project...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Project
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-base">Need to add a new client?</CardTitle>
                        <CardDescription>
                            If the client you're looking for isn't in the list, you can create a new client first.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/dashboard/clients/new">
                            <Button variant="outline" size="sm" className="gap-1">
                                <Plus className="h-3.5 w-3.5" />
                                Add New Client
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

