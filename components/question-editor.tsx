"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Grip, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { generateId } from "@/lib/utils"
import type { Question, QuestionType, QuestionOption } from "@/types/brief"

interface QuestionEditorProps {
  question: Question
  index: number
  totalQuestions: number
  onUpdate: (question: Question) => void
  onRemove: () => void
  onMove: (direction: "up" | "down") => void
}

export function QuestionEditor({ question, index, totalQuestions, onUpdate, onRemove, onMove }: QuestionEditorProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleTypeChange = (type: QuestionType) => {
    const updatedQuestion: Question = {
      ...question,
      type,
    }

    // Initialize options for multiple choice, checkbox, or dropdown
    if (["multiple-choice", "checkbox", "dropdown"].includes(type) && !question.options) {
      updatedQuestion.options = [
        { id: generateId(), value: "Option 1" },
        { id: generateId(), value: "Option 2" },
      ]
    }

    onUpdate(updatedQuestion)
  }

  const handleAddOption = () => {
    if (!question.options) return

    const newOption: QuestionOption = {
      id: generateId(),
      value: `Option ${question.options.length + 1}`,
    }

    onUpdate({
      ...question,
      options: [...question.options, newOption],
    })
  }

  const handleUpdateOption = (optionId: string, value: string) => {
    if (!question.options) return

    onUpdate({
      ...question,
      options: question.options.map((opt) => (opt.id === optionId ? { ...opt, value } : opt)),
    })
  }

  const handleRemoveOption = (optionId: string) => {
    if (!question.options) return

    onUpdate({
      ...question,
      options: question.options.filter((opt) => opt.id !== optionId),
    })
  }

  const questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: "text", label: "Short Text" },
    { value: "textarea", label: "Long Text" },
    { value: "email", label: "Email" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "checkbox", label: "Checkboxes" },
    { value: "dropdown", label: "Dropdown" },
  ]

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
            <Grip className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <div className="font-medium">
              {question.text ? question.text : <span className="text-muted-foreground">Untitled Question</span>}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {questionTypeOptions.find((opt) => opt.value === question.type)?.label || "Unknown Type"}
              </Badge>
              {question.required && (
                <Badge variant="secondary" className="text-xs">
                  Required
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onMove("up")} disabled={index === 0} className="h-8 w-8">
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Move up</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove("down")}
            disabled={index === totalQuestions - 1}
            className="h-8 w-8"
          >
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Move down</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete question</span>
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}-text`}>Question Text</Label>
            <Input
              id={`question-${question.id}-text`}
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              placeholder="Enter your question here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-type`}>Question Type</Label>
              <Select value={question.type} onValueChange={(value) => handleTypeChange(value as QuestionType)}>
                <SelectTrigger id={`question-${question.id}-type`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-description`}>Description (Optional)</Label>
              <Input
                id={`question-${question.id}-description`}
                value={question.description || ""}
                onChange={(e) => onUpdate({ ...question, description: e.target.value })}
                placeholder="Add additional context or instructions..."
              />
            </div>
          </div>

          {/* Type-specific configuration */}
          {(question.type === "text" || question.type === "textarea" || question.type === "email") && (
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}-placeholder`}>Placeholder Text (Optional)</Label>
              <Input
                id={`question-${question.id}-placeholder`}
                value={question.placeholder || ""}
                onChange={(e) => onUpdate({ ...question, placeholder: e.target.value })}
                placeholder="e.g., Enter your answer here..."
              />
            </div>
          )}

          {(question.type === "text" || question.type === "textarea") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`question-${question.id}-min-length`}>Minimum Length (Optional)</Label>
                <Input
                  id={`question-${question.id}-min-length`}
                  type="number"
                  min="0"
                  value={question.minLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...question,
                      minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`question-${question.id}-max-length`}>Maximum Length (Optional)</Label>
                <Input
                  id={`question-${question.id}-max-length`}
                  type="number"
                  min="0"
                  value={question.maxLength || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...question,
                      maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="No limit"
                />
              </div>
            </div>
          )}

          {question.type === "number" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`question-${question.id}-min`}>Minimum Value (Optional)</Label>
                <Input
                  id={`question-${question.id}-min`}
                  type="number"
                  value={question.min || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...question,
                      min: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="No minimum"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`question-${question.id}-max`}>Maximum Value (Optional)</Label>
                <Input
                  id={`question-${question.id}-max`}
                  type="number"
                  value={question.max || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...question,
                      max: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="No maximum"
                />
              </div>
            </div>
          )}

          {/* Options for multiple choice, checkbox, or dropdown */}
          {(question.type === "multiple-choice" || question.type === "checkbox" || question.type === "dropdown") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button variant="outline" size="sm" onClick={handleAddOption} className="h-8 gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Option</span>
                </Button>
              </div>

              <Card>
                <CardContent className="p-3 space-y-2">
                  {question.options?.map((option, optIndex) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          value={option.value}
                          onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(option.id)}
                        disabled={question.options?.length === 1}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove option</span>
                      </Button>
                    </div>
                  ))}

                  {(!question.options || question.options.length === 0) && (
                    <div className="text-center py-2 text-sm text-muted-foreground">No options added yet</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id={`question-${question.id}-required`}
              checked={question.required}
              onCheckedChange={(checked) => onUpdate({ ...question, required: checked })}
            />
            <Label htmlFor={`question-${question.id}-required`}>Required question</Label>
          </div>
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  )
}

