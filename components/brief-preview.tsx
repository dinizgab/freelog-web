"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Brief } from "@/types/brief"

interface BriefPreviewProps {
  brief: Brief
  onSubmit?: (responses: Record<string, any>) => void
  readOnly?: boolean
}

export function BriefPreview({ brief, onSubmit, readOnly = true }: BriefPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(responses)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = (question: Brief["questions"][0], index: number) => {
    const questionId = `question-${question.id}`
    const isRequired = question.required
    const value = responses[question.id]

    switch (question.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={questionId}>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <Input
              id={questionId}
              value={value || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              required={isRequired}
              disabled={readOnly}
              minLength={question.minLength}
              maxLength={question.maxLength}
            />
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={questionId}>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <Textarea
              id={questionId}
              value={value || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              required={isRequired}
              disabled={readOnly}
              minLength={question.minLength}
              maxLength={question.maxLength}
              rows={4}
            />
          </div>
        )

      case "email":
        return (
          <div className="space-y-2">
            <Label htmlFor={questionId}>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <Input
              id={questionId}
              type="email"
              value={value || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder || "email@example.com"}
              required={isRequired}
              disabled={readOnly}
            />
          </div>
        )

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={questionId}>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <Input
              id={questionId}
              type="number"
              value={value || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value ? Number(e.target.value) : "")}
              placeholder={question.placeholder}
              required={isRequired}
              disabled={readOnly}
              min={question.min}
              max={question.max}
            />
          </div>
        )

      case "date":
        return (
          <div className="space-y-2">
            <Label>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
                  disabled={readOnly}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => handleInputChange(question.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case "multiple-choice":
        return (
          <div className="space-y-2">
            <div>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </div>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <RadioGroup
              value={value || ""}
              onValueChange={(val) => handleInputChange(question.id, val)}
              disabled={readOnly}
            >
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`${questionId}-${option.id}`} />
                  <Label htmlFor={`${questionId}-${option.id}`}>{option.value}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            <div>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </div>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <div className="space-y-2">
              {question.options?.map((option) => {
                const checked = Array.isArray(value) ? value.includes(option.id) : false
                return (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${questionId}-${option.id}`}
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const currentValues = Array.isArray(value) ? [...value] : []
                        if (isChecked) {
                          handleInputChange(question.id, [...currentValues, option.id])
                        } else {
                          handleInputChange(
                            question.id,
                            currentValues.filter((id) => id !== option.id),
                          )
                        }
                      }}
                      disabled={readOnly}
                    />
                    <Label htmlFor={`${questionId}-${option.id}`}>{option.value}</Label>
                  </div>
                )
              })}
            </div>
          </div>
        )

      case "dropdown":
        return (
          <div className="space-y-2">
            <Label htmlFor={questionId}>
              {question.text}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
            <Select
              value={value || ""}
              onValueChange={(val) => handleInputChange(question.id, val)}
              disabled={readOnly}
            >
              <SelectTrigger id={questionId}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{brief.name}</CardTitle>
          {brief.description && <CardDescription>{brief.description}</CardDescription>}
        </CardHeader>
      </Card>

      <div className="space-y-8">
        {brief.questions.map((question, index) => (
          <Card key={question.id}>
            <CardContent className="pt-6">{renderQuestion(question, index)}</CardContent>
          </Card>
        ))}
      </div>

      {!readOnly && (
        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Brief"}
          </Button>
        </div>
      )}

      {brief.questions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">This brief has no questions yet.</p>
          </CardContent>
        </Card>
      )}
    </form>
  )
}

