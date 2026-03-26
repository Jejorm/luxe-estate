import type { ReactNode } from 'react'
import { AdminNavbar } from '@/components/AdminNavbar'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const adminUser = user
    ? {
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url as string | undefined,
        full_name: user.user_metadata?.full_name as string | undefined,
      }
    : null

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans selection:bg-neutral-800">
      <AdminNavbar user={adminUser} />
      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  )
}
