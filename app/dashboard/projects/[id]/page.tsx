"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DeliverablesList } from "@/components/deliverables-list"
import { ProjectActivity } from "@/components/project-activity"
import { ProjectInfo } from "@/components/project-info"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, CalendarDays, Clock, FileUp, Plus } from "lucide-react"
import { getProject, addDeliverableVersion } from "@/lib/project-data"
import type { Project } from "@/types/project"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<Project | undefined>(getProject(projectId))
  const [activeTab, setActiveTab] = useState("deliverables")

  if (!project) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold md:text-2xl">Project Not Found</h1>
        </div>
        <p>The project you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    )
  }

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "not-started":
        return "secondary"
      case "in-progress":
        return "default"
      case "in-review":
        return "warning"
      case "completed":
        return "success"
      default:
        return "secondary"
    }
  }

  const handleFileUpload = (deliverableId: string, file: File, comment: string) => {
    // In a real app, this would upload the file to a server
    // For this demo, we'll simulate it
    const fileUrl = `/files/${file.name}`
    const newVersion = addDeliverableVersion(deliverableId, fileUrl, file.name, file.size, comment)

    // Update the project state to reflect the new version
    setProject(getProject(projectId))

    return newVersion
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold md:text-2xl">{project.name}</h1>
          <Badge variant={getStatusBadgeVariant(project.status) as any} className="ml-2">
            {formatStatus(project.status)}
          </Badge>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Deliverable</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deliverable</DialogTitle>
              <DialogDescription>Create a new deliverable for this project.</DialogDescription>
            </DialogHeader>
            {/* Add deliverable form would go here */}
            <div className="py-4">Form placeholder</div>
            <div className="flex justify-end">
              <Button>Add Deliverable</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Client: {project.clientName} • Due: {new Date(project.dueDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Due Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Deliverables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4 text-muted-foreground" />
                  <span>{project.deliverables.length} deliverables</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {Math.max(
                      0,
                      Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
                    )}{" "}
                    days
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Tabs defaultValue="deliverables" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="info">Project Info</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="deliverables">
          <Card>
            <CardHeader>
              <CardTitle>Project Deliverables</CardTitle>
              <CardDescription>Manage and track all deliverables for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <DeliverablesList
                deliverables={project.deliverables}
                onFileUpload={handleFileUpload}
                isFreelancer={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Project Activity</CardTitle>
              <CardDescription>Recent activity and updates on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectActivity project={project} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Detailed information about this project</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectInfo project={project} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
