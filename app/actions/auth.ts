'use server'

import { redirect } from 'next/navigation'
import { createClient, getURL } from '@/lib/supabase/server'

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=google_signin_error')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGitHub() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${getURL()}auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=github_signin_error')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'invalid_credentials' }
  }

  redirect('/')
}

export async function signUpWithEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  // 1. Sign up the user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) {
    console.error('Sign up error:', signUpError.message)
    const errorKey = signUpError.message.includes('already registered') 
      ? 'email_exists' 
      : 'default'
    return { error: errorKey }
  }

  const user = data.user
  
  if (user && data.session) {
    redirect('/')
  } else if (user) {
    return { success: 'check_email' }
  }

  return { success: 'check_email' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
