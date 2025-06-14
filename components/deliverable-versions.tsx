"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, MessageSquare, Send } from "lucide-react"
import type { Deliverable } from "@/types/project"

interface DeliverableVersionsProps {
  deliverable: Deliverable
  onAddComment?: (versionId: string, content: string) => void
}

export function DeliverableVersions({ deliverable, onAddComment }: DeliverableVersionsProps) {
  const [activeVersionId, setActiveVersionId] = useState<string | null>(
    deliverable.versions.length > 0 ? deliverable.versions[deliverable.versions.length - 1].id : null,
  )
  const [newComment, setNewComment] = useState("")

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

  const activeVersion = deliverable.versions.find((v) => v.id === activeVersionId)

  const handleAddComment = () => {
    if (onAddComment && activeVersionId && newComment.trim()) {
      onAddComment(activeVersionId, newComment.trim())
      setNewComment("")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[500px]">
      <div className="w-full md:w-1/3 border rounded-md overflow-hidden">
        <div className="bg-muted p-3 font-medium">Version History</div>
        <div className="overflow-y-auto h-[calc(500px-48px)]">
          {deliverable.versions.map((version, index) => (
            <div
              key={version.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                activeVersionId === version.id ? "bg-muted" : ""
              }`}
              onClick={() => setActiveVersionId(version.id)}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">Version {deliverable.versions.length - index}</div>
                <Badge variant={getStatusBadgeVariant(version.status) as any}>{formatStatus(version.status)}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{new Date(version.uploadedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-2/3 border rounded-md overflow-hidden flex flex-col">
        {activeVersion ? (
          <>
            <div className="bg-muted p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  Version {deliverable.versions.indexOf(activeVersion) + 1} of {deliverable.versions.length}
                </div>
                <Badge variant={getStatusBadgeVariant(activeVersion.status) as any}>
                  {formatStatus(activeVersion.status)}
                </Badge>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  <span className="font-medium">{activeVersion.fileName}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={activeVersion.fileUrl} download={activeVersion.fileName}>
                    Download
                  </a>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground mb-2">Size: {formatFileSize(activeVersion.fileSize)}</div>
              {activeVersion.comment && (
                <div className="bg-muted p-3 rounded-md mb-4">
                  <p className="text-sm">{activeVersion.comment}</p>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </h4>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {activeVersion.comments.length > 0 ? (
                    activeVersion.comments.map((comment) => (
                      <div key={comment.id} className="bg-muted p-3 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-sm">{comment.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-2">No comments yet</div>
                  )}
                </div>
              </div>
            </div>
            {onAddComment && (
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button type="button" size="icon" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">No versions available</div>
        )}
      </div>
    </div>
  )
}
