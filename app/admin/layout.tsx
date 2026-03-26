import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans selection:bg-neutral-800">
      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  )
}
