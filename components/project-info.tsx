"use client"

import { CalendarDays, DollarSign } from "lucide-react"
import type { Project } from "@/types/project"

interface ProjectInfoProps {
  project: Project
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Project Details</h3>
        <div className="mt-2 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client</p>
              <p>{project.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>
                {project.status
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Start Date</p>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Date</p>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Budget</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>${project.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Description</h3>
        <p className="mt-2 text-muted-foreground">{project.description}</p>
      </div>

      <div>
        <h3 className="text-lg font-medium">Deliverables</h3>
        <div className="mt-2 space-y-2">
          {project.deliverables.length > 0 ? (
            project.deliverables.map((deliverable) => (
              <div key={deliverable.id} className="border rounded-md p-3">
                <div className="font-medium">{deliverable.name}</div>
                <p className="text-sm text-muted-foreground">{deliverable.description}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No deliverables have been added to this project.</p>
          )}
        </div>
      </div>
    </div>
  )
}
