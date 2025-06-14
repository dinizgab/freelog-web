"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, type UserProfile } from "@/lib/supabase/browser"

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    loading: boolean
    signOut: () => Promise<void>
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>
    isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isConfigured, setIsConfigured] = useState(true)

    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            setIsConfigured(false)
            setLoading(false)
            return
        }

        const getInitialSession = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession()
                setUser(session?.user ?? null)

                if (session?.user) {
                    await fetchProfile(session.user.id)
                }
            } catch (error) {
                console.error("Error getting initial session:", error)
            } finally {
                setLoading(false)
            }
        }

        getInitialSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null)

            if (session?.user) {
                await fetchProfile(session.user.id)
            } else {
                setProfile(null)
            }

            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

            if (error && error.code !== "PGRST116") {
                console.error("Error fetching profile:", error)
                return
            }

            if (data) {
                setProfile(data)
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
        }
    }

    const signOut = async () => {
        if (!isConfigured) {
            throw new Error("Supabase is not configured")
        }

        window.location.href = '/auth/logout'

        setUser(null)
        setProfile(null)
    }

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user || !isConfigured) return

        try {
            const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

            if (error) {
                throw error
            }

            setProfile(data)
        } catch (error) {
            console.error("Error updating profile:", error)
            throw error
        }
    }

    const value = {
        user,
        profile,
        loading,
        signOut,
        updateProfile,
        isConfigured,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
