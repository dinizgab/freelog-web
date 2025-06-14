"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Briefcase, FileText, Home, LogOut, Settings, Users, DollarSign } from "lucide-react"

interface NavProps {
  isCollapsed: boolean
}

export function DashboardNav({ isCollapsed }: NavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/dashboard/clients",
      icon: Users,
      title: "Clients",
    },
    {
      href: "/dashboard/projects",
      icon: Briefcase,
      title: "Projects",
    },
    {
      href: "/dashboard/briefs",
      icon: FileText,
      title: "Briefs",
    },
    {
      href: "/dashboard/finances",
      icon: DollarSign,
      title: "Finances",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              isCollapsed && "group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2",
            )}
          >
            <route.icon className="h-4 w-4" />
            {!isCollapsed && <span>{route.title}</span>}
          </Link>
        ))}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground mt-auto",
            isCollapsed && "group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2",
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Log out</span>}
        </Link>
      </nav>
    </div>
  )
}
