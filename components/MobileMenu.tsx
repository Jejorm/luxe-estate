'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Dictionary } from '@/lib/i18n/getDictionary'
import { signOut } from '@/app/actions/auth'

interface MobileMenuProps {
  dict: Dictionary
  userRole: string | null
  user: User | null
}

export function MobileMenu({ dict, userRole, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
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
            {/* <p className="text-[10px] uppercase tracking-widest font-bold text-nordic-dark/30 mb-1">
              Navigation
            </p> */}

            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-mosque text-white font-bold shadow-lg shadow-mosque/20 active:scale-[0.98] transition-transform"
              >
                <span className="material-symbols-rounded text-xl">
                  admin_panel_settings
                </span>
                {dict.nav.manageProperties}
              </Link>
            )}

            <Link
              href="/buy"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98] ${
                pathname === '/buy'
                  ? 'bg-nordic-dark text-white shadow-md'
                  : 'bg-nordic-dark/5 text-nordic-dark hover:bg-nordic-dark/10'
              }`}
            >
              <span className="material-symbols-rounded text-xl">
                shopping_bag
              </span>
              {dict.nav.buy}
            </Link>

            <Link
              href="/rent"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98] ${
                pathname === '/rent'
                  ? 'bg-nordic-dark text-white shadow-md'
                  : 'bg-nordic-dark/5 text-nordic-dark hover:bg-nordic-dark/10'
              }`}
            >
              <span className="material-symbols-rounded text-xl">key</span>
              {dict.nav.rent}
            </Link>

            <Link
              href="/saved"
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all active:scale-[0.98] ${
                pathname === '/saved'
                  ? 'bg-nordic-dark text-white shadow-md'
                  : 'bg-nordic-dark/5 text-nordic-dark hover:bg-nordic-dark/10'
              }`}
            >
              <span className="material-symbols-rounded text-xl">favorite</span>
              {dict.nav.savedHomes}
            </Link>
          </nav>

          {/* Footer / Auth */}
          <div className="mt-auto pt-8 border-t border-nordic-dark/10">
            {pathname !== '/' && (
              <div className="space-y-3 mb-3">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-nordic-dark text-white rounded-2xl font-bold shadow-xl shadow-nordic-dark/20 transition-transform active:scale-[0.98]"
                >
                  <span className="material-icons text-xl">home</span>
                  {dict.nav.backToHome}
                </Link>
              </div>
            )}

            {!user ? (
              <Link
                href="/login"
                className="flex items-center justify-center gap-3 w-full py-4 bg-mosque text-white rounded-2xl font-bold shadow-xl shadow-mosque/20 transition-transform active:scale-[0.98]"
              >
                <span className="material-symbols-rounded">login</span>
                {dict.nav.signIn}
              </Link>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-error  text-error rounded-2xl font-bold hover:border-error/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-rounded text-xl">
                    logout
                  </span>
                  {dict.nav.signOut}
                </button>
                <p className="mt-8 text-xs font-medium text-nordic-dark/40 px-2 text-center">
                  Signed in as{' '}
                  <span className="text-nordic-dark font-bold">
                    {user.email}
                  </span>
                </p>
              </div>
            )}

            {/* <p className="text-center text-[10px] text-nordic-dark/20 mt-8 uppercase tracking-[0.2em] font-black">
              LuxeEstate Premium © 2026
            </p> */}
          </div>
        </div>
      </div>
    </>
  ) : null

  return (
    <div className="md:hidden flex items-center">
      <button
        type="button"
        onClick={open}
        className="p-2 -ml-2 text-nordic-dark hover:bg-nordic-dark/5 rounded-lg transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <span className="material-icons text-3xl">menu</span>
      </button>

      {/* Portal the overlay to body to escape navbar overflow containment */}
      {mounted && menuOverlay && createPortal(menuOverlay, document.body)}
    </div>
  )
}
