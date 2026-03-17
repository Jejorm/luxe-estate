'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { i18n, type Locale } from '@/lib/i18n/config'

export async function setLanguage(locale: string) {
  if (!i18n.locales.includes(locale as Locale)) {
    return
  }

  const cookieStore = await cookies()

  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  // Revalidate the root to apply changes immediately
  revalidatePath('/')
}
