'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { LanguageSelector } from './LanguageSelector'
import type { Locale } from '@/lib/i18n/config'

interface AdminNavbarProps {
  user: {
    email?: string
    avatar_url?: string
    full_name?: string
  } | null
  locale: Locale
}

export function AdminNavbar({ user, locale }: AdminNavbarProps) {
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
    <nav className="bg-white border-b border-nordic-dark/5 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
        <div className="flex items-center gap-12">
          <Link href="/">
            <div className="shrink-0 flex items-center gap-3 cursor-pointer group">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-nordic-dark text-white group-hover:bg-mosque transition-all shadow-sm">
                <span className="material-icons text-lg">arrow_back</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center group-hover:bg-mosque transition-colors shadow-sm">
                  <span className="material-icons text-white text-lg">
                    apartment
                  </span>
                </div>
                <span className="text-xl font-semibold tracking-tight text-nordic-dark group-hover:text-mosque transition-colors">
                  LuxeEstate
                </span>
              </div>
            </div>
          </Link>
          <div className="hidden md:flex space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  isActive(link.href)
                    ? 'bg-nordic-dark/5 text-nordic-dark shadow-sm ring-1 ring-nordic-dark/5'
                    : 'text-nordic-dark/60 hover:text-nordic-dark hover:bg-nordic-dark/5'
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <LanguageSelector currentLocale={locale} />
          
          {user && (
            <div className="flex items-center gap-3 pl-5 border-l border-nordic-dark/10">
              <div className="w-8 h-8 rounded-full bg-nordic-dark/5 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all shrink-0">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name || 'Profile'}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-rounded text-nordic-dark/40 text-lg leading-none select-none">
                    person
                  </span>
                )}
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="cursor-pointer text-xs font-semibold text-mosque hover:text-mosque/80 transition-colors"
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
