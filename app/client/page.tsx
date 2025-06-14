import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, FileCheck, MessageSquare } from "lucide-react"

export default function ClientDashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Client Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 project completed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Deliverables waiting for your review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Across 2 projects</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="projects">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="deliverables">Recent Deliverables</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="projects" className="border rounded-md">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-sm font-medium">Project</div>
              <div className="text-sm font-medium">Status</div>
              <div className="text-sm font-medium">Due Date</div>
              <div className="text-sm font-medium">Actions</div>
            </div>
            {[
              {
                name: "Website Redesign",
                status: "In Progress",
                dueDate: "Jun 20, 2025",
              },
              {
                name: "Brand Identity",
                status: "In Review",
                dueDate: "Jun 25, 2025",
              },
              {
                name: "Marketing Campaign",
                status: "In Progress",
                dueDate: "Jul 05, 2025",
              },
            ].map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="font-medium">{project.name}</div>
                <div>
                  <div
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      project.status === "In Progress"
                        ? "border-blue-600/20 bg-blue-600/10 text-blue-600"
                        : project.status === "In Review"
                          ? "border-yellow-600/20 bg-yellow-600/10 text-yellow-600"
                          : "border-gray-600/20 bg-gray-600/10 text-gray-600 dark:border-gray-400/20 dark:bg-gray-400/10 dark:text-gray-400"
                    }`}
                  >
                    {project.status}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{project.dueDate}</span>
                </div>
                <div>
                  <Link href={`/client/projects/${i + 1}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="deliverables" className="border rounded-md">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-sm font-medium">Deliverable</div>
              <div className="text-sm font-medium">Project</div>
              <div className="text-sm font-medium">Status</div>
              <div className="text-sm font-medium">Actions</div>
            </div>
            {[
              {
                name: "Homepage Mockup",
                project: "Website Redesign",
                status: "Needs Approval",
              },
              {
                name: "Logo Final Version",
                project: "Brand Identity",
                status: "Needs Approval",
              },
              {
                name: "Social Media Banners",
                project: "Marketing Campaign",
                status: "In Progress",
              },
              {
                name: "About Page Design",
                project: "Website Redesign",
                status: "Approved",
              },
              {
                name: "Color Palette",
                project: "Brand Identity",
                status: "Approved",
              },
            ].map((deliverable, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="font-medium">{deliverable.name}</div>
                <div className="text-sm text-muted-foreground">{deliverable.project}</div>
                <div>
                  <div
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      deliverable.status === "Needs Approval"
                        ? "border-yellow-600/20 bg-yellow-600/10 text-yellow-600"
                        : deliverable.status === "In Progress"
                          ? "border-blue-600/20 bg-blue-600/10 text-blue-600"
                          : "border-green-600/20 bg-green-600/10 text-green-600"
                    }`}
                  >
                    {deliverable.status}
                  </div>
                </div>
                <div>
                  <Link href={`/client/deliverables/${i + 1}`}>
                    <Button size="sm" variant="outline">
                      {deliverable.status === "Needs Approval" ? "Review" : "View"}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
