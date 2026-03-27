import { Suspense } from 'react'
import { Navbar } from '@/components/Navbar'
import { Pagination } from '@/components/Pagination'
import { PropertyCard } from '@/components/PropertyCard'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getNewMarketProperties } from '@/lib/properties'

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const dict = await getDictionary()

  const currentPage = Math.max(1, Number(params.page) || 1)

  const {
    data: properties,
    totalPages,
    count,
  } = await getNewMarketProperties(currentPage, 12, { type: 'buy' })

  return (
    <div className="bg-background-light min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-28">
        <div className="mb-24 text-center">
          <p className="mt-12 text-2xl md:text-3xl font-light text-nordic-dark/80 tracking-wide leading-relaxed max-w-3xl mx-auto italic">
            "Encontrá el hogar de tus sueños entre nuestra selección exclusiva
            de propiedades en venta."
          </p>
          <div className="h-px w-24 bg-nordic-dark/10 mx-auto mt-12" />
        </div>

        <div className="flex items-center justify-between mb-8 border-b border-nordic-dark/5 pb-4">
          <span className="text-sm font-medium text-nordic-dark/40 uppercase tracking-widest">
            {count} {dict.home.properties} disponibles
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <span className="material-icons text-6xl text-nordic-muted/40">
              search_off
            </span>
            <p className="text-xl font-light text-nordic-dark">
              {dict.home.noProperties}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <Suspense fallback={null}>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      </main>
    </div>
  )
}
