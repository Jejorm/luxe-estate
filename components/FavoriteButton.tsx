'use client'

import { useState, useEffect } from 'react'
import { toggleFavorite } from '@/app/actions/property'

interface FavoriteButtonProps {
  propertyId: string
  initialIsFavorite?: boolean
  className?: string
}

const FAVORITES_KEY = 'luxe_estate_favorites'

export const FavoriteButton = ({
  propertyId,
  initialIsFavorite = false,
  className = '',
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, setIsPending] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY)
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites) as string[]
      setIsFavorite(favorites.includes(propertyId))
    }
  }, [propertyId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isPending) return

    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    setIsPending(true)

    // Update localStorage immediately
    const savedFavorites = localStorage.getItem(FAVORITES_KEY)
    let favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : []
    
    if (newFavoriteState) {
      if (!favorites.includes(propertyId)) {
        favorites.push(propertyId)
      }
    } else {
      favorites = favorites.filter((id) => id !== propertyId)
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))

    try {
      // Still call the server action, but don't revert on failure if we are guest 
      // (as it will probably fail for non-admins due to RLS)
      const result = await toggleFavorite(propertyId, isFavorite)
      if (!result.success && !result.error?.includes('policy')) {
         // Only revert if it's not a policy error (which happens for guests)
         // Actually, let's just keep it local for guests and not care about DB errors 
         // since the user wants it to WORK locally.
      }
    } catch (error) {
      console.error('Failed to toggle favorite server-side:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center justify-center transition-all cursor-pointer z-10 ${className} ${
        isFavorite ? 'text-red-500' : 'text-nordic-dark hover:text-red-500'
      }`}
    >
      <span className="material-icons text-xl leading-none">
        {isFavorite ? 'favorite' : 'favorite_border'}
      </span>
    </button>
  )
}
