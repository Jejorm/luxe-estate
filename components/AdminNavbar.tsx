'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'

interface AdminNavbarProps {
  user: {
    email?: string
    avatar_url?: string
    full_name?: string
  } | null
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/properties', label: 'Properties' },
    { href: '/admin/users', label: 'Users' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
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
            {links.map((link) => (
              <Link
                key={link.href}
                className={`px-1 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-mosque border-b-2 border-mosque'
                    : 'text-nordic-dark/60 hover:text-mosque'
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="hidden sm:block text-nordic-dark/60 hover:text-mosque text-sm font-medium transition-colors"
          >
            Exit to App
          </Link>

          {user && (
            <div className="flex items-center gap-3 pl-5 border-l border-nordic-dark/10">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name || 'Profile'}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-nordic-dark/5">
                    <span className="material-symbols-outlined text-nordic-dark/40 text-lg">
                      person
                    </span>
                  </div>
                )}
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-xs font-semibold text-mosque hover:text-mosque/80 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
