'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/getDictionary'
import { SearchFiltersModal } from './SearchFiltersModal'

export const FilterButtons = ({ dict }: { dict: Dictionary['search'] }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const currentType = searchParams.get('type') ?? 'all'

  const TYPES = [
    { label: dict.allTypes, value: 'all' },
    { label: dict.house, value: 'house' },
    { label: dict.condo, value: 'apartment' },
    { label: dict.villa, value: 'villa' },
    { label: dict.penthouse, value: 'penthouse' },
  ]

  const handleTypeClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('type')
    } else {
      params.set('type', value)
    }
    params.set('page', '1')
    router.push(`/?${params.toString()}`)
  }

  return (
    <>
      <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
        {TYPES.map(({ label, value }) => {
          const isActive = currentType === value
          return (
            <button
              key={value}
              onClick={() => handleTypeClick(value)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 ${
                isActive
                  ? 'bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10'
                  : 'bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5'
              }`}
            >
              {label}
            </button>
          )
        })}

        <div className="w-px h-6 bg-nordic-dark/10 mx-2" />

        <button
          type="button"
          onClick={() => setIsFiltersOpen(true)}
          className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic-dark font-medium text-sm hover:bg-black/5 transition-colors"
        >
          <span className="material-icons text-base">tune</span> Filters
        </button>
      </div>

      <SearchFiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </>
  )
}
