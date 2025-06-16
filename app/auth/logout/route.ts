import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await supabaseServer()

    await supabase.auth.signOut({ scope: 'local' })

    const origin = new URL(request.url).origin

    return NextResponse.redirect(`${origin}/`)
}

