import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    const origin = request.nextUrl.origin
    const searchParams = request.nextUrl.searchParams

    const code = searchParams.get("code")
    const next = searchParams.get("next") ?? "/"

    console.log("Auth code request received:", { code, next })
    console.log("Next URL:", next, "Origin:", request.url)
    console.log("Auth code received:", code)


    if (code) {
        const supabase = await supabaseServer()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        console.log("Auth response:", { data, error })

        if (!error && data.user) {
            const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()
            console.log("Existing profile:", existingProfile)

            if (!existingProfile) {
                await supabase.from("profiles").insert({
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: data.user.user_metadata.full_name || data.user.email!.split("@")[0],
                    role: "client",
                    avatar_url: data.user.user_metadata.avatar_url,
                })
            }

            // Determine redirect based on role
            const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()
            console.log("User profile:", profile)

            const redirectPath = profile?.role === "freelancer" ? "/dashboard" : "/client"
            return NextResponse.redirect(`${origin}${redirectPath}`)
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
