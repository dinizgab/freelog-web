import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthCodeError() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <AlertCircle className="mx-auto h-6 w-6 text-destructive" />
          <h1 className="text-2xl font-semibold tracking-tight">Authentication Error</h1>
          <p className="text-sm text-muted-foreground">
            There was an error during the authentication process. Please try again.
          </p>
        </div>
        <Link href="/login">
          <Button className="w-full">Try Again</Button>
        </Link>
      </div>
    </div>
  )
}
