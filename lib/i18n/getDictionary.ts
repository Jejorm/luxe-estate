import 'server-only'
import { cookies } from 'next/headers'
import { i18n } from './config'
import type { Locale } from './config'

import enDictionary from './dictionaries/en.json'

export type Dictionary = typeof enDictionary

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
}

export const getDictionary = async () => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined

  let locale: Locale = i18n.defaultLocale
  
  if (localeCookie && i18n.locales.includes(localeCookie)) {
    locale = localeCookie
  }

  return dictionaries[locale]()
}

export const getCurrentLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined

  if (localeCookie && i18n.locales.includes(localeCookie)) {
    return localeCookie
  }
  return i18n.defaultLocale
}
