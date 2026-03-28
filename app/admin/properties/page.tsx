import Image from 'next/image'
import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { fetchAdminProperties } from '../actions'
import { DeactivateButton } from './components/DeactivateButton'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const dict = await getDictionary()
  const params = await searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  const limit = 5

  const { data: properties = [], total } = await fetchAdminProperties(
    page,
    limit,
  )
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="bg-background-light text-nordic-dark font-sans min-h-screen flex flex-col antialiased">
      {/* Header */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic-dark">
              {dict.admin.propertyManagement}
            </h1>
            <p className="text-nordic-dark/60 mt-1 text-sm">
              {dict.admin.propertyManagementDesc}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/properties/new"
              className="bg-mosque hover:bg-mosque-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>{' '}
              {dict.admin.addProperty}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic-dark/50 mb-2">
          <div className="col-span-6">{dict.admin.propertyDetails}</div>
          <div className="col-span-2 text-center">{dict.admin.price}</div>
          <div className="col-span-2 text-center">{dict.admin.status}</div>
          <div className="col-span-2 text-right">{dict.admin.actions}</div>
        </div>

        {/* Property List */}
        {properties.length === 0 ? (
          <div className="text-nordic-dark/50 py-12 text-center bg-white rounded-xl border border-gray-100">
            {dict.admin.noProperties}
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
                  <Image
                    alt={property.title || 'Property'}
                    className="w-full h-full object-cover"
                    src={
                      property.images?.[0] ||
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80'
                    }
                    width={80}
                    height={80}
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
                      {property.area} {dict.property.sqft}
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
                  {property.is_rent ? dict.home.rentBtn : dict.home.buyBtn}
                </div>
              </div>

              {/* Status Column */}
              <div className="col-span-2 flex flex-col items-center gap-1.5">
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
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                    property.is_active
                      ? 'bg-hint-green/40 text-emerald-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {property.is_active ? 'Visible' : 'Hidden'}
                </span>
              </div>

              {/* Actions Column */}
              <div className="flex items-center justify-end gap-2 col-span-2">
                <Link
                  href={`/admin/properties/${property.id}`}
                  className="p-2 hover:bg-nordic-dark/5 rounded-lg text-nordic-dark/40 hover:text-mosque transition-colors"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-xl">
                    edit
                  </span>
                </Link>
                <DeactivateButton
                  id={property.id}
                  isActive={property.is_active}
                />
              </div>
            </div>
          ))
        )}
      </main>

      {/* Footer & Pagination */}
      <footer className="mt-auto border-t border-nordic-dark/5 bg-background-light py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-nordic-dark/60 order-2 sm:order-1">
            {dict.admin.showing}{' '}
            <span className="font-medium text-nordic-dark">
              {properties.length}
            </span>{' '}
            {dict.admin.of}{' '}
            <span className="font-medium text-nordic-dark">{total}</span>{' '}
            {dict.admin.listings}
          </p>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Link
              href={`/admin/properties?page=${Math.max(1, page - 1)}`}
              className={`flex items-center justify-center p-2 rounded-lg border border-nordic-dark/10 transition-colors ${
                page <= 1
                  ? 'bg-gray-50 text-gray-300 pointer-events-none'
                  : 'bg-white text-nordic-dark hover:bg-nordic-dark hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                navigate_before
              </span>
            </Link>
            <div className="flex items-center px-4 h-10 rounded-lg bg-white border border-nordic-dark/10 text-sm font-medium text-nordic-dark">
              {dict.admin.page} {page} {dict.admin.of} {totalPages || 1}
            </div>
            <Link
              href={`/admin/properties?page=${Math.min(totalPages, page + 1)}`}
              className={`flex items-center justify-center p-2 rounded-lg border border-nordic-dark/10 transition-colors ${
                page >= totalPages
                  ? 'bg-gray-50 text-gray-300 pointer-events-none'
                  : 'bg-white text-nordic-dark hover:bg-nordic-dark hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                navigate_next
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
