import Link from 'next/link'
import React from 'react'
import { fetchAdminProperties } from '../actions'

export const dynamic = 'force-dynamic'

export default async function AdminPropertiesPage() {
  const propertiesRes = await fetchAdminProperties()
  const properties = propertiesRes.data || []

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
                className="text-mosque border-b-2 border-mosque px-1 py-2 text-sm font-medium"
                href="/admin/properties"
              >
                Properties
              </Link>
              <Link
                className="text-nordic-dark/60 hover:text-mosque px-1 py-2 text-sm font-medium transition-colors"
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
              Property Management
            </h1>
            <p className="text-nordic-dark/60 mt-1 text-sm">
              Manage your real estate catalog and active listings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="bg-mosque hover:bg-mosque-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add
              Property
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50 mb-2">
          <div className="col-span-6">Property Details</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Property List */}
        {properties.length === 0 ? (
          <div className="text-nordic-dark/50 py-12 text-center bg-white rounded-xl border border-gray-100">
            No properties found in database.
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="bg-white p-6 rounded-xl border border-nordic-dark/5 shadow-card hover:shadow-soft transition-all duration-300 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4"
            >
              {/* Info Column */}
              <div className="flex items-center gap-4 col-span-6">
                <div className="w-20 h-20 rounded-lg bg-nordic-dark/5 flex-shrink-0 overflow-hidden relative">
                  <img
                    alt={property.title || 'Property'}
                    className="w-full h-full object-cover"
                    src={
                      property.images?.[0] ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80'
                    }
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-nordic-dark line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-nordic-dark/60 line-clamp-1">
                    {property.location}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-nordic-dark/40">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        bed
                      </span>
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        bathtub
                      </span>
                      {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        square_foot
                      </span>
                      {property.area} sqft
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Column */}
              <div className="col-span-2 text-center">
                <div className="text-base font-bold text-mosque">
                  {property.price_display}
                </div>
                <div className="text-xs text-nordic-dark/40 uppercase font-medium">
                  {property.is_rent ? 'Monthly rent' : 'Direct sale'}
                </div>
              </div>

              {/* Status Column */}
              <div className="col-span-2 flex justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                    property.tag?.toLowerCase() === 'pending'
                      ? 'bg-amber-100 text-amber-700'
                      : property.tag?.toLowerCase() === 'sold'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      property.tag?.toLowerCase() === 'pending'
                        ? 'bg-amber-500'
                        : property.tag?.toLowerCase() === 'sold'
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                    }`}
                  />
                  {property.tag || 'Active'}
                </span>
              </div>

              {/* Actions Column */}
              <div className="flex items-center justify-end gap-2 col-span-2">
                <button
                  type="button"
                  className="p-2 hover:bg-nordic-dark/5 rounded-lg text-nordic-dark/40 hover:text-mosque transition-colors"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-xl">
                    edit
                  </span>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-rose-50 rounded-lg text-nordic-dark/40 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-xl">
                    delete
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-nordic-dark/5 bg-background-light py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-nordic-dark/60">
            Showing{' '}
            <span className="font-medium text-nordic-dark">
              {properties.length}
            </span>{' '}
            listings
          </p>
        </div>
      </footer>
    </div>
  )
}
