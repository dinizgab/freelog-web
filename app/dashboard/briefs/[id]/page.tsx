"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Save, Eye, FileText } from "lucide-react"
import { toast } from "sonner"
import { QuestionEditor } from "@/components/question-editor"
import { BriefPreview } from "@/components/brief-preview"
import { sampleBriefs } from "@/lib/brief-data"
import { generateId } from "@/lib/utils"
import type { Brief, Question } from "@/types/brief"

export default function BriefEditPage() {
  const params = useParams()
  const router = useRouter()
  const briefId = params.id as string
  const isNewBrief = briefId === "new"

  const [brief, setBrief] = useState<Brief>({
    id: isNewBrief ? `brief-${Date.now()}` : briefId,
    name: "",
    description: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    questions: [],
  })

  const [activeTab, setActiveTab] = useState("edit")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isNewBrief) {
      // In a real app, this would be an API call
      const existingBrief = sampleBriefs.find((b) => b.id === briefId)
      if (existingBrief) {
        setBrief(existingBrief)
      } else {
        toast.error("Brief not found")
        router.push("/dashboard/briefs")
      }
    }
  }, [briefId, isNewBrief, router])

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      text: "",
      type: "text",
      required: false,
    }

    setBrief((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleUpdateQuestion = (questionId: string, updatedQuestion: Question) => {
    setBrief((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? updatedQuestion : q)),
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleRemoveQuestion = (questionId: string) => {
    setBrief((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleMoveQuestion = (questionId: string, direction: "up" | "down") => {
    const questionIndex = brief.questions.findIndex((q) => q.id === questionId)
    if (questionIndex === -1) return

    const newQuestions = [...brief.questions]
    const question = newQuestions[questionIndex]

    if (direction === "up" && questionIndex > 0) {
      newQuestions.splice(questionIndex, 1)
      newQuestions.splice(questionIndex - 1, 0, question)
    } else if (direction === "down" && questionIndex < newQuestions.length - 1) {
      newQuestions.splice(questionIndex, 1)
      newQuestions.splice(questionIndex + 1, 0, question)
    }

    setBrief((prev) => ({
      ...prev,
      questions: newQuestions,
      updatedAt: new Date().toISOString(),
    }))
  }

  const handleSaveBrief = async () => {
    if (!brief.name.trim()) {
      toast.error("Brief name is required")
      return
    }

    setIsSaving(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`Brief "${brief.name}" saved successfully`)

      if (isNewBrief) {
        router.push("/dashboard/briefs")
      }
    } catch (error) {
      toast.error("Failed to save brief")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

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
          <h1 className="text-lg font-semibold md:text-2xl">
            {isNewBrief ? "Create New Brief" : `Edit Brief: ${brief.name}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setActiveTab(activeTab === "edit" ? "preview" : "edit")}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{activeTab === "edit" ? "Preview" : "Edit"}</span>
          </Button>
          <Button size="sm" className="gap-1" onClick={handleSaveBrief} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Brief</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit Brief</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brief Details</CardTitle>
              <CardDescription>Define the basic information for your brief template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brief Name *</Label>
                <Input
                  id="name"
                  value={brief.name}
                  onChange={(e) => setBrief({ ...brief, name: e.target.value, updatedAt: new Date().toISOString() })}
                  placeholder="e.g., Website Design Brief, Logo Design Questionnaire"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={brief.description}
                  onChange={(e) =>
                    setBrief({ ...brief, description: e.target.value, updatedAt: new Date().toISOString() })
                  }
                  placeholder="Describe the purpose of this brief and what information it collects..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add and configure the questions for your brief</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddQuestion} className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Question</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {brief.questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No questions yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add questions to your brief to collect information from your clients
                  </p>
                  <Button onClick={handleAddQuestion} className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Your First Question</span>
                  </Button>
                </div>
              ) : (
                brief.questions.map((question, index) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    totalQuestions={brief.questions.length}
                    onUpdate={(updatedQuestion) => handleUpdateQuestion(question.id, updatedQuestion)}
                    onRemove={() => handleRemoveQuestion(question.id)}
                    onMove={(direction) => handleMoveQuestion(question.id, direction)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Brief Preview</CardTitle>
              <CardDescription>This is how your brief will appear to clients</CardDescription>
            </CardHeader>
            <CardContent>
              <BriefPreview brief={brief} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

