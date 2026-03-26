'use client'

import { useState } from 'react'
import { type AppRole, updateUserRole } from '../actions'

interface UserCardProps {
  user: {
    id: string
    email: string
    role: AppRole
  }
}

export default function UserCard({ user }: UserCardProps) {
  const [role, setRole] = useState<AppRole>(user.role)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isAdmin = role === 'admin'

  const handleRoleChange = async (newRole: AppRole) => {
    if (newRole === role) {
      setIsOpen(false)
      return
    }
    setLoading(true)
    const result = await updateUserRole(user.id, newRole)
    if (result.success) {
      setRole(newRole)
    } else {
      alert(`Error: ${result.error}`)
    }
    setLoading(false)
    setIsOpen(false)
  }

  return (
    <div className="group relative bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:bg-hint-green transition-colors flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
      {/* User Details */}
      <div className="col-span-12 md:col-span-5 flex items-center w-full">
        <div className="relative shrink-0">
          <div className="h-12 w-12 rounded-full bg-nordic-dark/10 flex items-center justify-center overflow-hidden border border-nordic-dark/10">
            <span className="material-symbols-outlined text-nordic-dark/60 text-2xl">
              person
            </span>
          </div>
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
        </div>
        <div className="ml-4 overflow-hidden">
          <div className="text-sm font-bold text-nordic-dark truncate">
            {user.email}
          </div>
          <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-gray-50 rounded text-nordic-dark/50 group-hover:bg-white/50 transition-colors">
            ID: {user.id.slice(0, 8)}
          </div>
        </div>
      </div>

      {/* Role & Status */}
      <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
        {isAdmin ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-nordic-dark text-white">
            Administrator
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
            User
          </span>
        )}
        <div className="flex items-center text-xs text-nordic-dark/60">
          <span className="material-icons text-[14px] mr-1 text-mosque">
            check_circle
          </span>
          Active
        </div>
      </div>

      {/* Info */}
      <div className="col-span-12 md:col-span-2 w-full">
        <div className="text-[10px] uppercase tracking-wider text-nordic-dark/40">
          Role
        </div>
        <div className="text-sm font-semibold text-nordic-dark capitalize">
          {role}
        </div>
      </div>

      {/* Actions */}
      <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
        <button
          type="button"
          disabled={loading}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-mosque hover:bg-mosque-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Change Role'}
          <span className="material-symbols-outlined text-[18px]">
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-dropdown bg-mosque ring-1 ring-black/5 overflow-hidden z-50 origin-top-right">
            <div className="py-1" role="menu">
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`w-full group flex items-center px-4 py-3 text-xs transition-colors ${
                  role === 'admin'
                    ? 'text-white bg-white/10 font-medium hover:bg-white/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                role="menuitem"
              >
                <span
                  className={`material-icons text-sm mr-3 ${role === 'admin' ? 'text-white' : 'text-white/50 group-hover:text-white'}`}
                >
                  shield
                </span>
                Administrator
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`w-full group flex items-center px-4 py-3 text-xs transition-colors ${
                  role === 'user'
                    ? 'text-white bg-white/10 font-medium hover:bg-white/20'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                role="menuitem"
              >
                <span
                  className={`material-icons text-sm mr-3 ${role === 'user' ? 'text-white' : 'text-white/50 group-hover:text-white'}`}
                >
                  person
                </span>
                User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
