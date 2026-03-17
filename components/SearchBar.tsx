'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Dictionary } from '@/lib/i18n/getDictionary'

export function SearchBar({ dict }: { dict: Dictionary['home'] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('search') ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    router.push(`/?${params.toString()}`)
  }

  const handleClear = () => {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.set('page', '1')
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span className="material-icons text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors">
          search
        </span>
      </div>
      <input
        className="block w-full pl-12 pr-28 py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
        placeholder={dict.searchPlaceholder}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-24 flex items-center text-nordic-muted hover:text-nordic-dark transition-colors px-2"
        >
          <span className="material-icons text-xl">close</span>
        </button>
      )}
      <button
        type="submit"
        className="absolute inset-y-2 right-2 px-6 bg-mosque hover:bg-mosque/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20"
      >
        <span className="material-icons sm:hidden">search</span>
        <span className="hidden sm:inline-block">{dict.searchPlaceholder.split(' ')[0]}</span>
      </button>
    </form>
  )
}
