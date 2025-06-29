"use server"

import { redirect } from "next/navigation"
import { supabaseServer } from "./supabase/server"
import { UserProfile } from "./supabase/browser"

export const signInWithGoogle = async () => {
    const supabase = await supabaseServer()

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                // TODO - Make this url dynamically setted based on environment
                redirectTo: `https://freelog-web-6hpa.vercel.app/auth/callback`,
            },
        })

        if (error) {
            throw error
        }

        if (data.url) {
            redirect(data.url)
        }
    } catch (error) {
        console.error("Error signing in with Google:", error)
        throw error
    }
}

export const signOut = async () => {
    const supabase = await supabaseServer()
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
        redirect("/")
    } catch (error) {
        console.error("Error signing out:", error)
        throw error
    }
}


export const updateProfile = async (updates: Partial<UserProfile>) => {
    const supabase = await supabaseServer()
    try {
        const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

        if (error) {
            throw error
        }

        return data
    } catch (error) {
        console.error("Error updating profile:", error)
        throw error
    }
}

