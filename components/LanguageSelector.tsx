'use client'

import { useTransition, useState, useRef, useEffect } from 'react'
import { setLanguage } from '@/app/actions/language'
import type { Locale } from '@/lib/i18n/config'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

export const LanguageSelector = ({ currentLocale }: { currentLocale: Locale }) => {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === currentLocale)

  const handleLanguageChange = (locale: string) => {
    startTransition(() => {
      setLanguage(locale)
    })
    setIsOpen(false)
  }

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-nordic-dark hover:bg-nordic-dark/5 rounded-lg transition-colors"
      >
        <span>{currentLanguage?.flag}</span>
        <span className="hidden sm:inline-block uppercase">{currentLanguage?.code}</span>
        <span className="material-icons text-sm opacity-60">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-nordic-dark/10 rounded-xl shadow-soft py-1.5 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                currentLocale === lang.code
                  ? 'bg-mosque/5 text-mosque font-medium'
                  : 'text-nordic-dark hover:bg-nordic-dark/5'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLocale === lang.code && (
                <span className="material-icons text-mosque text-[16px] ml-auto">check</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
