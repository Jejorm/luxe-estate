import Link from 'next/link'
import { fetchAdminUsers } from '../actions'
import UserCard from './UserCard'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const usersRes = await fetchAdminUsers()
  let users = usersRes.data || []

  const params = await searchParams
  const filter = typeof params?.filter === 'string' ? params.filter : 'all'

  if (filter === 'admins') {
    users = users.filter((u) => u.role === 'admin')
  }

  return (
    <div className="bg-background-light text-nordic-dark font-sans min-h-screen flex flex-col antialiased">
      {/* Navbar */}
      <nav className="bg-white border-b border-nordic-dark/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-mosque text-2xl">
                apartment
              </span>
              <span className="font-bold text-lg text-nordic-dark tracking-tight">
                LuxeEstate
              </span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link
                className="text-nordic-dark/60 hover:text-mosque px-1 py-2 text-sm font-medium transition-colors"
                href="/admin"
              >
                Dashboard
              </Link>
              <Link
                className="text-nordic-dark/60 hover:text-mosque px-1 py-2 text-sm font-medium transition-colors"
                href="/admin/properties"
              >
                Properties
              </Link>
              <Link
                className="text-mosque border-b-2 border-mosque px-1 py-2 text-sm font-medium"
                href="/admin/users"
              >
                Users
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-nordic-dark/60 hover:text-mosque text-sm font-medium transition-colors"
            >
              Exit to App
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
              User Directory
            </h1>
            <p className="text-nordic-dark/60 mt-1 text-sm">
              Manage user access and roles for your properties.
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
            All Users
          </Link>
          <Link
            href="/admin/users?filter=admins"
            className={`pb-3 text-sm transition-colors ${
              filter === 'admins'
                ? 'font-semibold text-mosque border-b-2 border-mosque'
                : 'font-medium text-nordic-dark/60 hover:text-nordic-dark'
            }`}
          >
            Admins
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50 mb-2">
          <div className="col-span-5">User Details</div>
          <div className="col-span-3">Role &amp; Status</div>
          <div className="col-span-2">Info</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* User Cards */}
        {users.length === 0 ? (
          <div className="text-nordic-dark/50 py-12 text-center bg-white rounded-xl border border-gray-100">
            No users found.
          </div>
        ) : (
          users.map((user) => <UserCard key={user.id} user={user} />)
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-nordic-dark/5 bg-background-light py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-nordic-dark/60">
            Showing{' '}
            <span className="font-medium text-nordic-dark">{users.length}</span>{' '}
            users
          </p>
        </div>
      </footer>
    </div>
  )
}
