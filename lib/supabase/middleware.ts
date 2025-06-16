import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase environment variables not configured. Authentication middleware disabled.")
        return response
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    request.cookies.set(name, value)
                )
                response = NextResponse.next({
                    request,
                })
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                )
            },
        },
    })

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser()

        const protectedRoutes = ["/dashboard", "/client"]
        const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

        if (isProtectedRoute && !user) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        if (user && isProtectedRoute) {
            const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

            const userRole = profile?.role

            //if (!userRole) {
            //    return NextResponse.redirect(new URL("/setup", request.url))
            //}

            if (request.nextUrl.pathname.startsWith("/dashboard") && userRole !== "freelancer") {
                return NextResponse.redirect(new URL("/client", request.url))
            }

            if (request.nextUrl.pathname.startsWith("/client") && userRole !== "client") {
                return NextResponse.redirect(new URL("/dashboard", request.url))
            }
        }

        if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
            //const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

            // TODO - Client will not be needed to create a profile (for now)
            //if (!profile?.role) {
            //    return NextResponse.redirect(new URL("/setup", request.url))
            //}
            //
            const redirectPath = "/dashboard"
            //const redirectPath = profile.role === "freelancer" ? "/dashboard" : "/client"
            return NextResponse.redirect(new URL(redirectPath, request.url))
        }
    } catch (error) {
        console.error("Middleware error:", error)
    }

    await supabase.auth.getUser()

    return response
}



