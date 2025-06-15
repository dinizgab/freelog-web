"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import type { UserRole } from "@/lib/supabase/browser"

export default function SetupPage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
  const [company, setCompany] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !fullName) return

    try {
      setIsLoading(true)
      await updateProfile({
        role: selectedRole,
        full_name: fullName,
        ...(selectedRole === "client" && company ? { company } : {}),
      })

      toast.success("Profile setup completed!")

      const redirectPath = selectedRole === "freelancer" ? "/dashboard" : "/client"
      router.push(redirectPath)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">Tell us a bit about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-4">
            <Label>I am a...</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <Card
                className={`cursor-pointer transition-colors ${
                  selectedRole === "freelancer" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedRole("freelancer")}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <CardTitle className="text-lg">Freelancer</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>I provide creative services and manage client projects</CardDescription>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  selectedRole === "client" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedRole("client")}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <CardTitle className="text-lg">Client</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>I hire freelancers and collaborate on creative projects</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>

          {selectedRole === "client" && (
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter your company name"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!selectedRole || !fullName || isLoading}>
            {isLoading ? "Setting up..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  )
}
