'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/actions/auth'
import { LanguageSelector } from './LanguageSelector'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/getDictionary'

interface AdminNavbarProps {
  user: {
    email?: string
    avatar_url?: string
    full_name?: string
  } | null
  locale: Locale
  dict: Dictionary
}

export function AdminNavbar({ user, locale, dict }: AdminNavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const prevPathname = useRef(pathname)

  // Hydration-safe portal
  useEffect(() => {
    setMounted(true)
  }, [])

  const close = useCallback(() => {
    setIsAnimating(false)
    setTimeout(() => setIsOpen(false), 300)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      setIsAnimating(false)
      setTimeout(() => setIsOpen(false), 300)
    }
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const open = () => {
    setIsOpen(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    })
  }

  const links = [
    { href: '/admin', label: dict.admin.launchDashboard, icon: 'dashboard' },
    {
      href: '/admin/properties',
      label: dict.admin.manageProperties,
      icon: 'home_work',
    },
    { href: '/admin/users', label: dict.admin.manageUsers, icon: 'people' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const menuOverlay = isOpen ? (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-9998 bg-nordic-dark/60 backdrop-blur-md transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-9999 w-[min(300px,85vw)] bg-white shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col min-h-full p-6 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
                <span className="material-icons text-white text-lg">
                  apartment
                </span>
              </div>
              <span className="text-xl font-bold text-nordic-dark tracking-tight">
                LuxeEstate
              </span>
            </div>
            <button
              type="button"
              onClick={close}
              className="p-2 -mr-2 text-nordic-dark hover:bg-nordic-dark/5 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-icons text-2xl">close</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-3 flex-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98] ${
                  isActive(link.href)
                    ? 'bg-nordic-dark text-white shadow-md'
                    : 'bg-nordic-dark/5 text-nordic-dark hover:bg-nordic-dark/10'
                }`}
              >
                <span className="material-icons text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Footer / Auth */}
          <div className="mt-auto pt-8 border-t border-nordic-dark/10">
            <div className="space-y-3">
              <div className="space-y-3 mb-3">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-mosque text-white rounded-2xl font-bold shadow-xl shadow-mosque/20 transition-transform active:scale-[0.98]"
                >
                  <span className="material-icons text-xl">home</span>
                  {dict.nav.backToHome}
                </Link>
              </div>

              <form action={signOut} className="w-full">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-4 border-2 border-error text-error rounded-2xl font-bold hover:border-error/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-icons text-xl">logout</span>
                  {dict.nav.signOut}
                </button>
              </form>
            </div>
            {user && (
              <p className="mt-8 text-xs font-medium text-nordic-dark/40 px-2 text-center">
                Signed in as{' '}
                <span className="text-nordic-dark font-bold">
                  {user?.email}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  ) : null

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
        <div className="flex items-center gap-12">
          <Link href="/">
            <div className="shrink-0 flex items-center gap-3 cursor-pointer group">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Luxe Estate Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg group-hover:opacity-80 transition-opacity shadow-sm"
                />
                <span className="text-xl font-semibold tracking-tight text-nordic-dark group-hover:text-mosque transition-colors">
                  LuxeEstate
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1 ml-10">
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

        <div className="flex items-center space-x-2 sm:space-x-6">
          <LanguageSelector currentLocale={locale} />

          {user && (
            <div className="flex items-center gap-4 sm:pl-2 sm:border-l border-nordic-dark/10 sm:ml-2">
              <div className="w-9 h-9 rounded-full bg-nordic-dark/5 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all shrink-0">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.full_name || 'Profile'}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-rounded text-nordic-dark/40 text-xl leading-none select-none">
                    person
                  </span>
                )}
              </div>
              <form action={signOut} className="hidden sm:block">
                <button
                  type="submit"
                  className="cursor-pointer text-sm font-semibold text-mosque hover:text-mosque/80 transition-colors"
                >
                  {dict.nav.signOut}
                </button>
              </form>
            </div>
          )}

          {/* Mobile Menu Toggle (Right on Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={open}
              className="p-2 -mr-2 text-nordic-dark hover:bg-nordic-dark/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <span className="material-icons text-3xl">menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portal the overlay to body */}
      {mounted && menuOverlay && createPortal(menuOverlay, document.body)}
    </nav>
  )
}
