"use client"

import { FileCheck, FileUp, MessageSquare, User } from "lucide-react"
import type { Project } from "@/types/project"

interface ProjectActivityProps {
  project: Project
}

export function ProjectActivity({ project }: ProjectActivityProps) {
  // Generate activity items based on project data
  const activityItems = []

  // Add activity for each deliverable version
  project.deliverables.forEach((deliverable) => {
    deliverable.versions.forEach((version) => {
      // Add upload activity
      activityItems.push({
        id: `upload-${version.id}`,
        type: "upload",
        title: `New version of ${deliverable.name} uploaded`,
        description: version.comment || "No comment provided",
        date: version.uploadedAt,
      })

      // Add review activity if reviewed
      if (version.reviewedAt) {
        activityItems.push({
          id: `review-${version.id}`,
          type: "review",
          title: `${deliverable.name} was ${version.status === "delivered" ? "approved" : "returned"}`,
          description: `The deliverable was marked as ${version.status}`,
          date: version.reviewedAt,
        })
      }

      // Add comment activities
      version.comments.forEach((comment) => {
        activityItems.push({
          id: `comment-${comment.id}`,
          type: "comment",
          title: `${comment.userName} commented on ${deliverable.name}`,
          description: comment.content,
          date: comment.createdAt,
          user: comment.userName,
          userRole: comment.userRole,
        })
      })
    })
  })

  // Sort activities by date (newest first)
  activityItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <FileUp className="h-4 w-4 text-primary" />
      case "review":
        return <FileCheck className="h-4 w-4 text-primary" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-primary" />
      default:
        return <User className="h-4 w-4 text-primary" />
    }
  }

  return (
    <div className="space-y-4">
      {activityItems.length > 0 ? (
        activityItems.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(activity.date).toLocaleString()}
                {activity.user && ` • ${activity.user} (${activity.userRole})`}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">No activity found for this project.</div>
      )}
    </div>
  )
}
