import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, DollarSign, FileCheck, FilePlus, Plus, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/projects/new">
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Project</span>
            </Button>
          </Link>
          <Link href="/dashboard/clients/new">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Client</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Deliverables</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">-2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="projects">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="projects">Recent Projects</TabsTrigger>
            <TabsTrigger value="deliverables">Pending Deliverables</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="projects" className="border rounded-md">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-sm font-medium">Project</div>
              <div className="text-sm font-medium">Client</div>
              <div className="text-sm font-medium">Status</div>
              <div className="text-sm font-medium">Due Date</div>
            </div>
            {[
              {
                name: "Website Redesign",
                client: "Acme Inc",
                status: "In Progress",
                dueDate: "Jun 20, 2025",
              },
              {
                name: "Brand Identity",
                client: "TechStart",
                status: "In Review",
                dueDate: "Jun 25, 2025",
              },
              {
                name: "Marketing Campaign",
                client: "Global Foods",
                status: "In Progress",
                dueDate: "Jul 05, 2025",
              },
              {
                name: "App UI Design",
                client: "Fitness Pro",
                status: "Not Started",
                dueDate: "Jul 15, 2025",
              },
              {
                name: "Social Media Assets",
                client: "Retail Shop",
                status: "In Progress",
                dueDate: "Jun 30, 2025",
              },
            ].map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-muted-foreground">{project.client}</div>
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
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="deliverables" className="border rounded-md">
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-sm font-medium">Deliverable</div>
              <div className="text-sm font-medium">Project</div>
              <div className="text-sm font-medium">Client</div>
              <div className="text-sm font-medium">Due Date</div>
            </div>
            {[
              {
                name: "Homepage Mockup",
                project: "Website Redesign",
                client: "Acme Inc",
                dueDate: "Jun 18, 2025",
              },
              {
                name: "Logo Final Version",
                project: "Brand Identity",
                client: "TechStart",
                dueDate: "Jun 19, 2025",
              },
              {
                name: "Social Media Banners",
                project: "Marketing Campaign",
                client: "Global Foods",
                dueDate: "Jun 22, 2025",
              },
              {
                name: "App Wireframes",
                project: "App UI Design",
                client: "Fitness Pro",
                dueDate: "Jun 25, 2025",
              },
              {
                name: "Instagram Post Templates",
                project: "Social Media Assets",
                client: "Retail Shop",
                dueDate: "Jun 20, 2025",
              },
            ].map((deliverable, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="font-medium">{deliverable.name}</div>
                <div className="text-sm text-muted-foreground">{deliverable.project}</div>
                <div className="text-sm text-muted-foreground">{deliverable.client}</div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{deliverable.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activity" className="border rounded-md">
          <div className="flex flex-col p-4 space-y-4">
            {[
              {
                action: "Uploaded new deliverable",
                project: "Website Redesign",
                time: "2 hours ago",
              },
              {
                action: "Client approved deliverable",
                project: "Brand Identity",
                time: "5 hours ago",
              },
              {
                action: "Created new project",
                project: "App UI Design",
                time: "Yesterday",
              },
              {
                action: "Added new client",
                project: "Fitness Pro",
                time: "Yesterday",
              },
              {
                action: "Updated project brief",
                project: "Marketing Campaign",
                time: "2 days ago",
              },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  {activity.action.includes("Uploaded") ? (
                    <FilePlus className="w-4 h-4 text-primary" />
                  ) : activity.action.includes("approved") ? (
                    <FileCheck className="w-4 h-4 text-primary" />
                  ) : activity.action.includes("Created") ? (
                    <Plus className="w-4 h-4 text-primary" />
                  ) : activity.action.includes("Added") ? (
                    <Users className="w-4 h-4 text-primary" />
                  ) : (
                    <FileCheck className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.project} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
