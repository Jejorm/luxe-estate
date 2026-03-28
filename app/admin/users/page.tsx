import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { fetchAdminUsers } from '../actions'
import UserCard from './UserCard'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const dict = await getDictionary()
  const params = await searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  const limit = 5
  const filter = typeof params?.filter === 'string' ? params.filter : 'all'

  const { data = [], total } = await fetchAdminUsers(page, limit)
  let users = data

  if (filter === 'admins') {
    users = users.filter((u) => u.role === 'admin')
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="bg-background-light text-nordic-dark font-sans min-h-screen flex flex-col antialiased">
      {/* Header */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
              {dict.admin.userDirectory}
            </h1>
            <p className="text-nordic-dark/60 mt-1 text-sm">
              {dict.admin.userDirectoryDesc}
            </p>
          </div>
        </div>
        <div className="mt-8 flex gap-6 border-b border-nordic-dark/10 overflow-x-auto">
          <Link
            href="/admin/users?filter=all"
            className={`pb-3 text-sm transition-colors ${
              filter === 'all'
                ? 'font-semibold text-mosque border-b-2 border-mosque'
                : 'font-medium text-nordic-dark/60 hover:text-nordic-dark'
            }`}
          >
            {dict.admin.allUsers}
          </Link>
          <Link
            href="/admin/users?filter=admins"
            className={`pb-3 text-sm transition-colors ${
              filter === 'admins'
                ? 'font-semibold text-mosque border-b-2 border-mosque'
                : 'font-medium text-nordic-dark/60 hover:text-nordic-dark'
            }`}
          >
            {dict.admin.admins}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50 mb-2">
          <div className="col-span-5">{dict.admin.userDetails}</div>
          <div className="col-span-3">{dict.admin.roleStatus}</div>
          <div className="col-span-2">{dict.admin.info}</div>
          <div className="col-span-2 text-right">{dict.admin.actions}</div>
        </div>

        {/* User Cards */}
        {users.length === 0 ? (
          <div className="text-nordic-dark/50 py-12 text-center bg-white rounded-xl border border-gray-100">
            {dict.admin.noUsers}
          </div>
        ) : (
          users.map((user) => <UserCard key={user.id} user={user} />)
        )}
      </main>

      {/* Footer & Pagination */}
      <footer className="mt-auto border-t border-nordic-dark/5 bg-background-light py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-nordic-dark/60 order-2 sm:order-1">
            {dict.admin.showing}{' '}
            <span className="font-medium text-nordic-dark">{users.length}</span>{' '}
            {dict.admin.of}{' '}
            <span className="font-medium text-nordic-dark">{total}</span>{' '}
            {dict.admin.users}
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Link
              href={`/admin/users?page=${Math.max(1, page - 1)}&filter=${filter}`}
              className={`flex items-center justify-center p-2 rounded-lg border border-nordic-dark/10 transition-colors ${
                page <= 1
                  ? 'bg-gray-50 text-gray-300 pointer-events-none'
                  : 'bg-white text-nordic-dark hover:bg-nordic-dark hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                navigate_before
              </span>
            </Link>
            <div className="flex items-center px-4 h-10 rounded-lg bg-white border border-nordic-dark/10 text-sm font-medium text-nordic-dark">
              {dict.admin.page} {page} {dict.admin.of} {totalPages || 1}
            </div>
            <Link
              href={`/admin/users?page=${Math.min(totalPages, page + 1)}&filter=${filter}`}
              className={`flex items-center justify-center p-2 rounded-lg border border-nordic-dark/10 transition-colors ${
                page >= totalPages
                  ? 'bg-gray-50 text-gray-300 pointer-events-none'
                  : 'bg-white text-nordic-dark hover:bg-nordic-dark hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                navigate_next
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
