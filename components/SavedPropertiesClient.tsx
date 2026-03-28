'use client'

import { useState, useEffect } from 'react'
import { PropertyCard } from '@/components/PropertyCard'
import { getPropertiesByIds } from '@/lib/properties'
import type { Property } from '@/lib/properties'

const FAVORITES_KEY = 'luxe_estate_favorites'

interface Props {
  dict: any
}

export const SavedPropertiesClient = ({ dict }: Props) => {
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavorites() {
      // Get favorites from localStorage
      const savedFavorites = localStorage.getItem(FAVORITES_KEY)
      if (savedFavorites) {
        try {
          const ids = JSON.parse(savedFavorites) as string[]
          if (ids.length > 0) {
            const properties = await getPropertiesByIds(ids)
            setFavoriteProperties(properties)
          }
        } catch (e) {
          console.error('Error parsing favorites from localStorage:', e)
        }
      }
      setLoading(false)
    }

    loadFavorites()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mosque" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-24 text-center">
        <p className="mt-12 text-2xl md:text-3xl font-light text-nordic-dark/80 tracking-wide leading-relaxed max-w-3xl mx-auto italic">
          "{dict.savedPage.title}"
        </p>
        <div className="h-px w-24 bg-nordic-dark/10 mx-auto mt-12" />
      </div>

      <div className="flex items-center justify-between mb-8 border-b border-nordic-dark/5 pb-4">
        <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-nordic-dark/5 shadow-soft">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mosque opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-mosque"></span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-mosque leading-none">
              {favoriteProperties.length}
            </span>
            <span className="text-xs font-bold text-nordic-dark/60 uppercase tracking-[0.2em] leading-none">
              {dict.home.properties} {dict.savedPage.saved}
            </span>
          </div>
        </div>
      </div>

      {favoriteProperties.length === 0 ? (
        <div className="text-center py-24 space-y-4 bg-white rounded-xl shadow-sm border border-nordic-dark/5">
          <span className="material-icons text-6xl text-nordic-muted/40">
            favorite_border
          </span>
          <p className="text-xl font-light text-nordic-dark">
            {dict.savedPage.noProperties}
          </p>
          <p className="text-nordic-muted text-sm">
            {dict.savedPage.noPropertiesSubtitle}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </>
  )
}
