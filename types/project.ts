export type ProjectStatus = "not-started" | "in-progress" | "in-review" | "completed"
export type DeliverableStatus = "in-review" | "delivered" | "returned"

export interface Comment {
  id: string
  userId: string
  userName: string
  userRole: "freelancer" | "client"
  content: string
  createdAt: string
}

export interface DeliverableVersion {
  id: string
  deliverableId: string
  fileUrl: string
  fileName: string
  fileSize: number
  comment?: string
  status: DeliverableStatus
  uploadedAt: string
  reviewedAt?: string
  comments: Comment[]
}

export interface Deliverable {
  id: string
  projectId: string
  name: string
  description: string
  dueDate: string
  versions: DeliverableVersion[]
  currentVersion: DeliverableVersion
}

export interface Project {
  id: string
  name: string
  clientId: string
  clientName: string
  description: string
  status: ProjectStatus
  startDate: string
  dueDate: string
  budget: number
  deliverables: Deliverable[]
}
