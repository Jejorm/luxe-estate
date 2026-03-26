import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 font-sans selection:bg-neutral-800">
      {/* Admin Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-lg font-semibold tracking-tight text-white hover:text-neutral-300 transition-colors"
            >
              Luxe Estate{' '}
              <span className="text-neutral-500 font-normal">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Exit to App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">{children}</main>
    </div>
  )
}
