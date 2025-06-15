import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
    throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export type UserRole = "freelancer" | "client"

export interface UserProfile {
    id: string
    email: string
    full_name: string
    role: UserRole
    avatar_url?: string
    company?: string
    created_at: string
    updated_at: string
}

