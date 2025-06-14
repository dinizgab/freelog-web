import type { Project, Deliverable, DeliverableVersion, Comment, DeliverableStatus } from "@/types/project"

// Sample projects data
export const projects: Project[] = [
  {
    id: "project1",
    name: "Website Redesign",
    clientId: "client1",
    clientName: "Acme Inc",
    description: "Complete redesign of the company website with new branding and improved UX.",
    status: "in-progress",
    startDate: "2025-05-15",
    dueDate: "2025-06-20",
    budget: 5000,
    deliverables: [],
  },
  {
    id: "project2",
    name: "Brand Identity",
    clientId: "client2",
    clientName: "TechStart",
    description: "Create a new brand identity including logo, color palette, and brand guidelines.",
    status: "in-review",
    startDate: "2025-05-20",
    dueDate: "2025-06-25",
    budget: 3500,
    deliverables: [],
  },
  {
    id: "project3",
    name: "Marketing Campaign",
    clientId: "client3",
    clientName: "Global Foods",
    description: "Design and develop assets for the summer marketing campaign.",
    status: "in-progress",
    startDate: "2025-06-01",
    dueDate: "2025-07-05",
    budget: 4000,
    deliverables: [],
  },
]

// Sample deliverables data
export const deliverables: Deliverable[] = [
  {
    id: "deliverable1",
    projectId: "project1",
    name: "Homepage Design",
    description: "Design of the main homepage with new branding elements.",
    dueDate: "2025-06-01",
    versions: [],
    currentVersion: {} as DeliverableVersion,
  },
  {
    id: "deliverable2",
    projectId: "project1",
    name: "About Page Design",
    description: "Design of the about page with team section and company history.",
    dueDate: "2025-06-10",
    versions: [],
    currentVersion: {} as DeliverableVersion,
  },
  {
    id: "deliverable3",
    projectId: "project2",
    name: "Logo Design",
    description: "Main logo design with variations for different use cases.",
    dueDate: "2025-06-05",
    versions: [],
    currentVersion: {} as DeliverableVersion,
  },
  {
    id: "deliverable4",
    projectId: "project2",
    name: "Brand Guidelines",
    description: "Comprehensive brand guidelines document.",
    dueDate: "2025-06-15",
    versions: [],
    currentVersion: {} as DeliverableVersion,
  },
  {
    id: "deliverable5",
    projectId: "project3",
    name: "Social Media Banners",
    description: "Set of banners for various social media platforms.",
    dueDate: "2025-06-20",
    versions: [],
    currentVersion: {} as DeliverableVersion,
  },
]

// Sample deliverable versions data
export const deliverableVersions: DeliverableVersion[] = [
  {
    id: "version1",
    deliverableId: "deliverable1",
    fileUrl: "/files/homepage-design-v1.pdf",
    fileName: "homepage-design-v1.pdf",
    fileSize: 2500000,
    comment: "First draft of the homepage design.",
    status: "in-review",
    uploadedAt: "2025-05-25T10:30:00Z",
    comments: [],
  },
  {
    id: "version2",
    deliverableId: "deliverable1",
    fileUrl: "/files/homepage-design-v2.pdf",
    fileName: "homepage-design-v2.pdf",
    fileSize: 2700000,
    comment: "Updated version with client feedback incorporated.",
    status: "delivered",
    uploadedAt: "2025-05-28T14:45:00Z",
    reviewedAt: "2025-05-29T09:15:00Z",
    comments: [],
  },
  {
    id: "version3",
    deliverableId: "deliverable2",
    fileUrl: "/files/about-page-v1.pdf",
    fileName: "about-page-v1.pdf",
    fileSize: 1800000,
    comment: "Initial design for the about page.",
    status: "returned",
    uploadedAt: "2025-05-27T11:20:00Z",
    reviewedAt: "2025-05-28T16:30:00Z",
    comments: [],
  },
  {
    id: "version4",
    deliverableId: "deliverable3",
    fileUrl: "/files/logo-design-v1.pdf",
    fileName: "logo-design-v1.pdf",
    fileSize: 1200000,
    comment: "First concepts for the logo design.",
    status: "in-review",
    uploadedAt: "2025-05-26T09:45:00Z",
    comments: [],
  },
  {
    id: "version5",
    deliverableId: "deliverable4",
    fileUrl: "/files/brand-guidelines-v1.pdf",
    fileName: "brand-guidelines-v1.pdf",
    fileSize: 3500000,
    comment: "Draft of the brand guidelines document.",
    status: "in-review",
    uploadedAt: "2025-05-29T13:10:00Z",
    comments: [],
  },
]

// Sample comments data
export const comments: Comment[] = [
  {
    id: "comment1",
    userId: "client1",
    userName: "John Smith",
    userRole: "client",
    content: "I like the overall design, but can we make the header more prominent?",
    createdAt: "2025-05-26T14:30:00Z",
  },
  {
    id: "comment2",
    userId: "freelancer1",
    userName: "Jane Doe",
    userRole: "freelancer",
    content: "Sure, I'll update the header in the next version.",
    createdAt: "2025-05-26T15:45:00Z",
  },
  {
    id: "comment3",
    userId: "client1",
    userName: "John Smith",
    userRole: "client",
    content: "The team section needs more visual hierarchy.",
    createdAt: "2025-05-28T10:15:00Z",
  },
  {
    id: "comment4",
    userId: "client2",
    userName: "Sarah Johnson",
    userRole: "client",
    content: "I prefer the second logo concept. Can we explore more variations of that one?",
    createdAt: "2025-05-27T11:30:00Z",
  },
]

// Link comments to deliverable versions
deliverableVersions[0].comments = [comments[0], comments[1]]
deliverableVersions[2].comments = [comments[2]]
deliverableVersions[3].comments = [comments[3]]

// Link versions to deliverables
deliverables[0].versions = [deliverableVersions[0], deliverableVersions[1]]
deliverables[0].currentVersion = deliverableVersions[1]
deliverables[1].versions = [deliverableVersions[2]]
deliverables[1].currentVersion = deliverableVersions[2]
deliverables[2].versions = [deliverableVersions[3]]
deliverables[2].currentVersion = deliverableVersions[3]
deliverables[3].versions = [deliverableVersions[4]]
deliverables[3].currentVersion = deliverableVersions[4]

// Link deliverables to projects
projects[0].deliverables = [deliverables[0], deliverables[1]]
projects[1].deliverables = [deliverables[2], deliverables[3]]
projects[2].deliverables = [deliverables[4]]

// Helper functions
export function getProject(projectId: string): Project | undefined {
  return projects.find((project) => project.id === projectId)
}

export function getDeliverable(deliverableId: string): Deliverable | undefined {
  return deliverables.find((deliverable) => deliverable.id === deliverableId)
}

export function getDeliverableVersion(versionId: string): DeliverableVersion | undefined {
  return deliverableVersions.find((version) => version.id === versionId)
}

export function updateDeliverableStatus(
  deliverableId: string,
  versionId: string,
  status: DeliverableStatus,
  comment?: string,
): void {
  const deliverable = getDeliverable(deliverableId)
  if (!deliverable) return

  const version = deliverable.versions.find((v) => v.id === versionId)
  if (!version) return

  version.status = status
  version.reviewedAt = new Date().toISOString()
  if (comment) {
    const newComment: Comment = {
      id: `comment${Math.random().toString(36).substr(2, 9)}`,
      userId: "client1", // In a real app, this would be the current user's ID
      userName: "John Smith", // In a real app, this would be the current user's name
      userRole: "client",
      content: comment,
      createdAt: new Date().toISOString(),
    }
    version.comments.push(newComment)
  }

  // Update the current version if this is the latest
  if (deliverable.versions.indexOf(version) === deliverable.versions.length - 1) {
    deliverable.currentVersion = version
  }
}

export function addDeliverableVersion(
  deliverableId: string,
  fileUrl: string,
  fileName: string,
  fileSize: number,
  comment?: string,
): DeliverableVersion {
  const deliverable = getDeliverable(deliverableId)
  if (!deliverable) throw new Error("Deliverable not found")

  const newVersion: DeliverableVersion = {
    id: `version${Math.random().toString(36).substr(2, 9)}`,
    deliverableId,
    fileUrl,
    fileName,
    fileSize,
    comment,
    status: "in-review",
    uploadedAt: new Date().toISOString(),
    comments: [],
  }

  deliverable.versions.push(newVersion)
  deliverable.currentVersion = newVersion
  deliverableVersions.push(newVersion)

  return newVersion
}

export function addComment(versionId: string, content: string, isClient = false): Comment {
  const version = getDeliverableVersion(versionId)
  if (!version) throw new Error("Version not found")

  const newComment: Comment = {
    id: `comment${Math.random().toString(36).substr(2, 9)}`,
    userId: isClient ? "client1" : "freelancer1", // In a real app, this would be the current user's ID
    userName: isClient ? "John Smith" : "Jane Doe", // In a real app, this would be the current user's name
    userRole: isClient ? "client" : "freelancer",
    content,
    createdAt: new Date().toISOString(),
  }

  version.comments.push(newComment)
  comments.push(newComment)

  return newComment
}

export function updateDeliverableDueDate(deliverableId: string, newDueDate: string): void {
  const deliverable = getDeliverable(deliverableId)
  if (!deliverable) return

  deliverable.dueDate = newDueDate
}
