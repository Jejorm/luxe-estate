import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('properties').select('*').limit(1)
  return NextResponse.json({
    keys: data?.[0] ? Object.keys(data[0]) : [],
    error,
  })
}
