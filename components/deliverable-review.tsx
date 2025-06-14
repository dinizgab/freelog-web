"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FileUp } from "lucide-react"
import type { Deliverable, DeliverableStatus } from "@/types/project"

interface DeliverableReviewProps {
  deliverable: Deliverable
  onReview: (deliverableId: string, versionId: string, status: DeliverableStatus, comment?: string) => void
}

export function DeliverableReview({ deliverable, onReview }: DeliverableReviewProps) {
  const [status, setStatus] = useState<DeliverableStatus>("delivered")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentVersion = deliverable.currentVersion

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentVersion) return

    setIsSubmitting(true)

    // In a real app, this would send the review to a server
    // For this demo, we'll simulate a delay
    setTimeout(() => {
      onReview(deliverable.id, currentVersion.id, status, comment)
      setIsSubmitting(false)
    }, 1000)
  }

  if (!currentVersion) {
    return <div>No version available for review</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-muted p-3 rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            <span className="font-medium">{currentVersion.fileName}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={currentVersion.fileUrl} download={currentVersion.fileName}>
              Download
            </a>
          </Button>
        </div>
        {currentVersion.comment && <p className="text-sm mt-2">{currentVersion.comment}</p>}
      </div>

      <div className="space-y-2">
        <Label>Review Decision</Label>
        <RadioGroup
          defaultValue="delivered"
          value={status}
          onValueChange={(value) => setStatus(value as DeliverableStatus)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivered" id="approve" />
            <Label htmlFor="approve">Approve</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="returned" id="return" />
            <Label htmlFor="return">Return for Revisions</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Feedback (Optional)</Label>
        <Textarea
          id="comment"
          placeholder="Add feedback or comments..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  )
}
