import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"


export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)

    const code = searchParams.get("code")

    if (code) {
        const supabase = await supabaseServer()

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error("Code exchange error:", error)
        }

        if (!error && data.user) {
            const { data: existingProfile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

            if (!existingProfile) {
                await supabase.from("profiles").insert({
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: data.user.user_metadata.full_name || data.user.email!.split("@")[0],
                    avatar_url: data.user.user_metadata.avatar_url,
                })
            }

            const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

            const redirectPath = profile?.role === "freelancer" ? "/dashboard" : "/client"
            return NextResponse.redirect(`${origin}${redirectPath}`)
        }
    }

    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
