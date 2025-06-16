"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit } from "lucide-react"
import { toast } from "sonner"
import { BriefPreview } from "@/components/brief-preview"
import { sampleBriefs } from "@/lib/brief-data"
import type { Brief } from "@/types/brief"

export default function BriefPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const briefId = params.id as string

  const [brief, setBrief] = useState<Brief | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const existingBrief = sampleBriefs.find((b) => b.id === briefId)

    if (existingBrief) {
      setBrief(existingBrief)
    } else {
      toast.error("Brief not found")
      router.push("/dashboard/briefs")
    }

    setIsLoading(false)
  }, [briefId, router])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/briefs">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold md:text-2xl">Loading Brief...</h1>
        </div>
      </div>
    )
  }

  if (!brief) return null

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/briefs">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold md:text-2xl">Preview: {brief.name}</h1>
        </div>
        <Link href={`/dashboard/briefs/${briefId}`}>
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Brief</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brief Preview</CardTitle>
          <CardDescription>This is how your brief will appear to clients</CardDescription>
        </CardHeader>
        <CardContent>
          <BriefPreview brief={brief} />
        </CardContent>
      </Card>
    </div>
  )
}

