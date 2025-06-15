import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await supabaseServer()

    await supabase.auth.signOut({ scope: 'local' })

    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL))
}

