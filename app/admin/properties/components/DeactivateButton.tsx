'use client'

import { useState } from 'react'
import { togglePropertyActive } from '@/app/admin/actions'

interface DeactivateButtonProps {
  id: string
  isActive: boolean
}

export function DeactivateButton({ id, isActive }: DeactivateButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    const label = isActive ? 'deactivate' : 'activate'
    if (!confirm(`Are you sure you want to ${label} this property?`)) return

    setLoading(true)
    try {
      const result = await togglePropertyActive(id, isActive)
      if (!result.success) {
        alert('Failed to update property status. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      title={isActive ? 'Deactivate property' : 'Activate property'}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
        isActive
          ? 'hover:bg-rose-50 text-nordic-dark/40 hover:text-rose-600'
          : 'hover:bg-emerald-50 text-nordic-dark/40 hover:text-emerald-600'
      }`}
    >
      <span className="material-symbols-outlined text-xl">
        {loading ? 'hourglass_empty' : isActive ? 'visibility_off' : 'visibility'}
      </span>
    </button>
  )
}
