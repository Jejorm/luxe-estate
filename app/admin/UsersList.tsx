'use client'

import { useState } from 'react'
import { type AppRole, updateUserRole } from './actions'

type UserData = { id: string; email: string; role: AppRole }

export default function UsersList({
  initialUsers,
}: {
  initialUsers: UserData[]
}) {
  const [users, setUsers] = useState<UserData[]>(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    setLoadingId(userId)
    const result = await updateUserRole(userId, newRole)
    if (result.success) {
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      )
    } else {
      alert(`Failed to update role: ${result.error}`)
    }
    setLoadingId(null)
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-neutral-500 py-12 text-center bg-neutral-950/30 border border-neutral-800/30 rounded-xl">
        No active users found.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/50 hover:bg-neutral-900/60 hover:border-blue-500/30 transition-all group"
        >
          <div className="flex flex-col">
            <p className="text-neutral-100 font-medium group-hover:text-blue-400 transition-colors">
              {user.email || 'No email provided'}
            </p>
            <p className="text-neutral-600 text-xs font-mono mt-0.5">
              {user.id}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                disabled={loadingId === user.id}
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user.id, e.target.value as AppRole)
                }
                className="appearance-none bg-neutral-900 border border-neutral-700 text-neutral-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 pr-8 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {/* Custom select arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="w-5 flex justify-center">
              {loadingId === user.id && (
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
