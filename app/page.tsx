import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, FileCheck, MessageSquare, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Briefcase className="h-5 w-5" />
            <span>CreativeCRM</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Streamline your freelance business with CreativeCRM
            </h1>
            <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
              A dual-interface CRM built specifically for creative freelancers. Manage clients, projects, deliverables,
              and budgets all in one place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  View demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="mx-auto grid max-w-5xl gap-12 lg:gap-16">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Everything you need to manage your creative business
              </h2>
              <p className="max-w-[85%] text-muted-foreground sm:text-lg">
                Stop juggling between different tools. CreativeCRM brings everything together in one seamless
                experience.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-6 shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Client Management</h3>
                <p className="text-muted-foreground">
                  Organize all your clients in one place with contact details and project history.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-6 shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Project Tracking</h3>
                <p className="text-muted-foreground">
                  Create projects, set deadlines, and track progress all in one dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-6 shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Deliverable Versioning</h3>
                <p className="text-muted-foreground">
                  Upload files with automatic version control and client approval workflows.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-6 shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Client Communication</h3>
                <p className="text-muted-foreground">
                  Keep all project-related communication in one place with threaded comments.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-6 shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                    <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                    <path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
                    <path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Brief Creation</h3>
                <p className="text-muted-foreground">
                  Create professional briefs with customizable templates for different project types.
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-lg border bg-card p-6 shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                    <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                    <path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
                    <path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Budget Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor project budgets, track payments, and get financial insights for your business.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <Briefcase className="h-5 w-5" />
            <span>CreativeCRM</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 CreativeCRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
