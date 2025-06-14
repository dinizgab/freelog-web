"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUp, X } from "lucide-react"

interface DeliverableUploadProps {
  deliverableId: string
  onUpload: (deliverableId: string, file: File, comment: string) => void
}

export function DeliverableUpload({ deliverableId, onUpload }: DeliverableUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [comment, setComment] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // In a real app, this would upload the file to a server
    // For this demo, we'll simulate a delay
    setTimeout(() => {
      onUpload(deliverableId, file, comment)
      setIsUploading(false)
      setFile(null)
      setComment("")
    }, 1000)
  }

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        {!file ? (
          <div
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF, PNG, JPG, AI, PSD (Max 50MB)</p>
            <Input ref={fileInputRef} id="file" type="file" className="hidden" onChange={handleFileChange} required />
          </div>
        ) : (
          <div className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                <span className="font-medium">{file.name}</span>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={clearFile} className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment (Optional)</Label>
        <Textarea
          id="comment"
          placeholder="Add a comment about this version..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!file || isUploading}>
          {isUploading ? "Uploading..." : "Upload Version"}
        </Button>
      </div>
    </form>
  )
}
