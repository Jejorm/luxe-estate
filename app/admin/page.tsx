import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/getDictionary'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardIndex() {
  const dict = await getDictionary()

  return (
    <div className="bg-background-light text-nordic-dark font-sans min-h-screen flex flex-col antialiased">
      {/* Header */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
              {dict.admin.portalTitle}
            </h1>
            <p className="text-nordic-dark/60 mt-1 text-sm">
              {dict.admin.portalSubtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/admin/users" className="group">
            <div className="bg-white p-8 rounded-2xl border border-nordic-dark/5 shadow-card group-hover:shadow-soft transition-all duration-300 flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  group
                </span>
              </div>
              <h2 className="text-xl font-bold text-nordic-dark mb-3 group-hover:text-mosque transition-colors">
                {dict.admin.manageUsers}
              </h2>
              <p className="text-nordic-dark/60 text-sm leading-relaxed mb-6">
                {dict.admin.manageUsersDesc}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-mosque">
                {dict.admin.launchDashboard}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>

          <Link href="/admin/properties" className="group">
            <div className="bg-white p-8 rounded-2xl border border-nordic-dark/5 shadow-card group-hover:shadow-soft transition-all duration-300 flex flex-col h-full">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-2xl">
                  real_estate_agent
                </span>
              </div>
              <h2 className="text-xl font-bold text-nordic-dark mb-3 group-hover:text-mosque transition-colors">
                {dict.admin.manageProperties}
              </h2>
              <p className="text-nordic-dark/60 text-sm leading-relaxed mb-6">
                {dict.admin.managePropertiesDesc}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-mosque">
                {dict.admin.launchDashboard}
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-nordic-dark/5 bg-background-light py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-nordic-dark/60">
            LuxeEstate Admin Management Console
          </p>
        </div>
      </footer>
    </div>
  )
}
