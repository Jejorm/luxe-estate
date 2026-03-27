import Link from 'next/link'
import { Suspense } from 'react'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { FeaturedPropertyCard } from '../components/FeaturedPropertyCard'
import { FilterButtons } from '../components/FilterButtons'
import { Navbar } from '../components/Navbar'
import { Pagination } from '../components/Pagination'
import { PropertyCard } from '../components/PropertyCard'
import { SearchBar } from '../components/SearchBar'
import {
  getFeaturedProperties,
  getNewMarketProperties,
} from '../lib/properties'

interface HomeProps {
  searchParams: Promise<{
    page?: string
    search?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    minBeds?: string
    minBaths?: string
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const dict = await getDictionary()

  const currentPage = Math.max(1, Number(params.page) || 1)

  const filters = {
    search: params.search,
    type: params.type,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minBeds: params.minBeds ? Number(params.minBeds) : undefined,
    minBaths: params.minBaths ? Number(params.minBaths) : undefined,
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined)
  const hasOtherFilters = Object.entries(filters).some(([k, v]) => k !== 'type' && v !== undefined)

  const [featuredProperties, { data: newMarketProperties, totalPages, count }] =
    await Promise.all([
      getFeaturedProperties(),
      getNewMarketProperties(currentPage, 8, filters),
    ])

  return (
    <div className="bg-background-light min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <section className="py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight">
              {dict.home.heroTitle}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-medium">
                  {dict.home.heroHighlight}
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0"></span>
              </span>
              {dict.home.heroDot}
            </h1>

            {/* Search bar — client component */}
            <Suspense
              fallback={
                <div className="relative max-w-2xl mx-auto h-16 rounded-xl bg-white shadow-soft animate-pulse" />
              }
            >
              <SearchBar dict={dict.home} />
            </Suspense>

            {/* Filter type pills + modal trigger — client component */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center gap-3 py-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-20 rounded-full bg-white animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <FilterButtons dict={dict.search} />
            </Suspense>
          </div>
        </section>

        {/* Active filters summary bar */}
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-nordic-muted">
              {dict.home.showing}{' '}
              <span className="font-semibold text-nordic-dark">{count}</span>{' '}
              {count === 1
                ? dict.home.properties.slice(0, -3) + 'y'
                : dict.home.properties}
              {filters.search && (
                <>
                  {' '}
                  {dict.home.matching}{' '}
                  <span className="font-semibold text-mosque">
                    "{filters.search}"
                  </span>
                </>
              )}
            </span>
            {filters.type && (
              <span className="px-3 py-1 bg-mosque/10 text-mosque text-xs font-medium rounded-full capitalize">
                {filters.type}
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="px-3 py-1 bg-mosque/10 text-mosque text-xs font-medium rounded-full">
                {filters.minPrice
                  ? `$${(filters.minPrice / 1e6).toFixed(1)}M`
                  : '$0'}
                {' – '}
                {filters.maxPrice
                  ? `$${(filters.maxPrice / 1e6).toFixed(1)}M`
                  : dict.home.noLimit}
              </span>
            )}
            {filters.minBeds && (
              <span className="px-3 py-1 bg-mosque/10 text-mosque text-xs font-medium rounded-full">
                {filters.minBeds}+ {dict.home.beds}
              </span>
            )}
            {filters.minBaths && (
              <span className="px-3 py-1 bg-mosque/10 text-mosque text-xs font-medium rounded-full">
                {filters.minBaths}+ {dict.home.baths}
              </span>
            )}
            <a
              href="/"
              className="ml-auto text-xs text-nordic-muted hover:text-nordic-dark underline underline-offset-2 transition-colors"
            >
              {dict.home.clearAll}
            </a>
          </div>
        )}

        {/* Featured Collections — only shown when no active filters */}
        {!hasActiveFilters && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-light text-nordic-dark">
                  {dict.home.featuredTitle}
                </h2>
                <p className="text-nordic-muted mt-1 text-sm">
                  {dict.home.featuredSubtitle}
                </p>
              </div>
              <Link
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
                href="/properties"
              >
                {dict.home.viewAll}{' '}
                <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProperties.map((property) => (
                <FeaturedPropertyCard key={property.id} property={property} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark">
                {hasOtherFilters
                  ? dict.home.searchResults
                  : dict.home.newMarketTitle}
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {hasOtherFilters
                  ? count === 1
                    ? dict.home.foundProperty
                    : dict.home.foundProperties.replace(
                        '{count}',
                        count.toString(),
                      )
                  : dict.home.newMarketSubtitle}
              </p>
            </div>
            {!hasOtherFilters && (
              <div className="hidden md:flex bg-white p-1 rounded-lg">
                <Link
                  href="/"
                  className={`px-4 py-1.5 rounded-md text-sm font-medium ${!filters.type ? 'bg-nordic-dark text-white shadow-sm' : 'text-nordic-muted hover:text-nordic-dark'}`}
                >
                  {dict.home.allBtn}
                </Link>
                <Link
                  href="/?type=buy"
                  className={`px-4 py-1.5 rounded-md text-sm font-medium ${filters.type === 'buy' ? 'bg-nordic-dark text-white shadow-sm' : 'text-nordic-muted hover:text-nordic-dark'}`}
                >
                  {dict.home.buyBtn}
                </Link>
                <Link
                  href="/?type=rent"
                  className={`px-4 py-1.5 rounded-md text-sm font-medium ${filters.type === 'rent' ? 'bg-nordic-dark text-white shadow-sm' : 'text-nordic-muted hover:text-nordic-dark'}`}
                >
                  {dict.home.rentBtn}
                </Link>
              </div>
            )}
          </div>

          {newMarketProperties.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <span className="material-icons text-6xl text-nordic-muted/40">
                search_off
              </span>
              <p className="text-xl font-light text-nordic-dark">
                {dict.home.noProperties}
              </p>
              <p className="text-nordic-muted text-sm">
                {dict.home.adjustFilters}
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-mosque text-white rounded-lg font-medium hover:bg-mosque/90 transition-colors"
              >
                {dict.home.clearFilters}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newMarketProperties.map((property, index) => {
                let extraClass = ''
                if (!hasOtherFilters && index === 4)
                  extraClass = 'hidden xl:flex'
                if (!hasOtherFilters && index === 5)
                  extraClass = 'hidden lg:flex'
                return (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    className={extraClass}
                  />
                )
              })}
            </div>
          )}

          <Suspense fallback={null}>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </section>
      </main>
    </div>
  )
}
