'use client'

import { useState } from 'react'
import { toggleFavorite } from '@/app/actions/property'

interface FavoriteButtonProps {
  propertyId: string
  initialIsFavorite?: boolean
  className?: string
}

export const FavoriteButton = ({
  propertyId,
  initialIsFavorite = false,
  className = '',
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isPending) return

    // Optimistic UI update
    setIsFavorite(!isFavorite)
    setIsPending(true)

    try {
      const result = await toggleFavorite(propertyId, isFavorite)
      if (!result.success) {
        // Revert on failure
        setIsFavorite(isFavorite)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      setIsFavorite(isFavorite) // Revert on error
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
