import { Suspense } from 'react'
import { getNewMarketProperties } from '@/lib/properties'
import { fetchAdminUsers } from './actions'
import PropertiesList from './PropertiesList'
import UsersList from './UsersList'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const usersRes = await fetchAdminUsers()
  // Fetch a larger page size for admin view
  const propertiesRes = await getNewMarketProperties(1, 100)

  return (
    <div className="space-y-12 animate-in fade-in duration-500 slide-in-from-bottom-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-neutral-400 text-lg">
          Manage system users and view active property listings securely.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Users & Roles</h2>
          </div>
          <div className="bg-[#111] border border-neutral-800 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="p-6">
              <Suspense
                fallback={
                  <div className="text-neutral-500 animate-pulse">
                    Loading users...
                  </div>
                }
              >
                <UsersList initialUsers={usersRes.data || []} />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Properties Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">
              Latest Properties
            </h2>
          </div>
          <div className="bg-[#111] border border-neutral-800 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent transition-opacity opacity-50 group-hover:opacity-100" />
            <div className="p-6">
              <Suspense
                fallback={
                  <div className="text-neutral-500 animate-pulse">
                    Loading properties...
                  </div>
                }
              >
                <PropertiesList properties={propertiesRes.data || []} />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
