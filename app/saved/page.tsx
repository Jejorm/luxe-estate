import { Navbar } from '@/components/Navbar'
import { PropertyCard } from '@/components/PropertyCard'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getFavoriteProperties } from '@/lib/properties'

export default async function SavedPropertiesPage() {
  const dict = await getDictionary()
  const favoriteProperties = await getFavoriteProperties()

  return (
    <div className="bg-background-light min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-nordic-dark">
            {dict.nav.savedHomes}
          </h1>
          <p className="text-nordic-muted mt-2">
            {favoriteProperties.length} {dict.home.properties}
          </p>
        </div>

        {favoriteProperties.length === 0 ? (
          <div className="text-center py-24 space-y-4 bg-white rounded-xl shadow-sm border border-nordic-dark/5">
            <span className="material-icons text-6xl text-nordic-muted/40">
              favorite_border
            </span>
            <p className="text-xl font-light text-nordic-dark">
              No saved properties yet
            </p>
            <p className="text-nordic-muted text-sm">
              Click the heart icon on any property to save it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
