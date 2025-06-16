"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal, Plus, Search, Copy, Eye } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { sampleBriefs } from "@/lib/brief-data"
import type { Brief } from "@/types/brief"

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>(sampleBriefs)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBriefs = briefs.filter(
    (brief) =>
      brief.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDuplicateBrief = (briefId: string) => {
    const briefToDuplicate = briefs.find((brief) => brief.id === briefId)
    if (!briefToDuplicate) return

    const duplicatedBrief: Brief = {
      ...briefToDuplicate,
      id: `brief-${Date.now()}`,
      name: `${briefToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setBriefs([...briefs, duplicatedBrief])
    toast.success(`Brief "${briefToDuplicate.name}" duplicated successfully`)
  }

  const handleDeleteBrief = (briefId: string) => {
    const briefToDelete = briefs.find((brief) => brief.id === briefId)
    if (!briefToDelete) return

    setBriefs(briefs.filter((brief) => brief.id !== briefId))
    toast.success(`Brief "${briefToDelete.name}" deleted successfully`)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Brief Templates</h1>
        <Link href="/dashboard/briefs/new">
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span>Create Brief</span>
          </Button>
        </Link>
      </div>

      {briefs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Brief Templates</CardTitle>
            <CardDescription>
              You haven't created any brief templates yet. Create your first brief template to start collecting
              structured information from clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/briefs/new">
              <Button className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Create Your First Brief</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search briefs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brief Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Questions</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBriefs.map((brief) => (
                  <TableRow key={brief.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{brief.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="line-clamp-1">{brief.description}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{brief.questions.length} questions</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(brief.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/dashboard/briefs/${brief.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Edit Brief</span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/dashboard/briefs/${brief.id}/preview`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Preview</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleDuplicateBrief(brief.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplicate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteBrief(brief.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBriefs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No briefs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}

