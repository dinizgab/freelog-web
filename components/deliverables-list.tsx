"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DeliverableUpload } from "@/components/deliverable-upload"
import { DeliverableVersions } from "@/components/deliverable-versions"
import { DeliverableReview } from "@/components/deliverable-review"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarDays, FileUp, History } from "lucide-react"
import type { Deliverable, DeliverableStatus } from "@/types/project"

interface DeliverablesListProps {
  deliverables: Deliverable[]
  onFileUpload?: (deliverableId: string, file: File, comment: string) => void
  onReviewDeliverable?: (deliverableId: string, versionId: string, status: DeliverableStatus, comment?: string) => void
  onAddComment?: (versionId: string, content: string) => void
  isFreelancer: boolean
}

export function DeliverablesList({
  deliverables,
  onFileUpload,
  onReviewDeliverable,
  onAddComment,
  isFreelancer,
}: DeliverablesListProps) {
  const [expandedDeliverable, setExpandedDeliverable] = useState<string | null>(null)
  const [activeDeliverable, setActiveDeliverable] = useState<Deliverable | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isVersionsDialogOpen, setIsVersionsDialogOpen] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  const formatStatus = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "in-review":
        return "warning"
      case "delivered":
        return "success"
      case "returned":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleUpload = (deliverableId: string, file: File, comment: string) => {
    if (onFileUpload) {
      onFileUpload(deliverableId, file, comment)
      setIsUploadDialogOpen(false)
    }
  }

  const handleReview = (deliverableId: string, versionId: string, status: DeliverableStatus, comment?: string) => {
    if (onReviewDeliverable) {
      onReviewDeliverable(deliverableId, versionId, status, comment)
      setIsReviewDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      {deliverables.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No deliverables found for this project.</div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedDeliverable || undefined}
          onValueChange={(value) => setExpandedDeliverable(value)}
        >
          {deliverables.map((deliverable) => (
            <AccordionItem key={deliverable.id} value={deliverable.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div>
                    <div className="font-medium">{deliverable.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  {deliverable.currentVersion && (
                    <Badge variant={getStatusBadgeVariant(deliverable.currentVersion.status) as any}>
                      {formatStatus(deliverable.currentVersion.status)}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="border-0 shadow-none">
                  <CardHeader className="px-2 pb-2 pt-0">
                    <CardDescription>{deliverable.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-2 py-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileUp className="h-4 w-4 text-muted-foreground" />
                          <span>Versions: {deliverable.versions.length}</span>
                        </div>
                      </div>

                      {deliverable.currentVersion && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Current Version</h4>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileUp className="h-4 w-4" />
                                <span className="font-medium">{deliverable.currentVersion.fileName}</span>
                              </div>
                              <Badge variant={getStatusBadgeVariant(deliverable.currentVersion.status) as any}>
                                {formatStatus(deliverable.currentVersion.status)}
                              </Badge>
                            </div>
                            {deliverable.currentVersion.comment && (
                              <p className="text-sm text-muted-foreground mt-2">{deliverable.currentVersion.comment}</p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <div className="text-xs text-muted-foreground">
                                Uploaded: {new Date(deliverable.currentVersion.uploadedAt).toLocaleString()}
                              </div>
                              <div>
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={deliverable.currentVersion.fileUrl}
                                    download={deliverable.currentVersion.fileName}
                                  >
                                    Download
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="px-2 pt-4 pb-0 flex justify-between">
                    <div className="flex gap-2">
                      <Dialog
                        open={isVersionsDialogOpen && activeDeliverable?.id === deliverable.id}
                        onOpenChange={(open) => {
                          setIsVersionsDialogOpen(open)
                          if (open) setActiveDeliverable(deliverable)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <History className="h-3.5 w-3.5" />
                            <span>Version History</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Version History</DialogTitle>
                            <DialogDescription>All versions of {deliverable.name}</DialogDescription>
                          </DialogHeader>
                          <DeliverableVersions deliverable={deliverable} onAddComment={onAddComment} />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex gap-2">
                      {isFreelancer ? (
                        <Dialog
                          open={isUploadDialogOpen && activeDeliverable?.id === deliverable.id}
                          onOpenChange={(open) => {
                            setIsUploadDialogOpen(open)
                            if (open) setActiveDeliverable(deliverable)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" className="gap-1">
                              <FileUp className="h-3.5 w-3.5" />
                              <span>Upload New Version</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload New Version</DialogTitle>
                              <DialogDescription>Upload a new version of {deliverable.name}</DialogDescription>
                            </DialogHeader>
                            <DeliverableUpload deliverableId={deliverable.id} onUpload={handleUpload} />
                          </DialogContent>
                        </Dialog>
                      ) : (
                        deliverable.currentVersion &&
                        deliverable.currentVersion.status === "in-review" && (
                          <Dialog
                            open={isReviewDialogOpen && activeDeliverable?.id === deliverable.id}
                            onOpenChange={(open) => {
                              setIsReviewDialogOpen(open)
                              if (open) setActiveDeliverable(deliverable)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button size="sm" className="gap-1">
                                <span>Review Deliverable</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Review Deliverable</DialogTitle>
                                <DialogDescription>Review and provide feedback on {deliverable.name}</DialogDescription>
                              </DialogHeader>
                              <DeliverableReview deliverable={deliverable} onReview={handleReview} />
                            </DialogContent>
                          </Dialog>
                        )
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
