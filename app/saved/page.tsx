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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-28">
        <div className="mb-24 text-center">
          <p className="mt-12  text-2xl md:text-3xl font-light text-nordic-dark/80 tracking-wide leading-relaxed max-w-3xl mx-auto italic">
            "Tus favoritos en un solo lugar: una selección curada de las
            propiedades que capturaron tu atención."
          </p>
          <div className="h-px w-24 bg-nordic-dark/10 mx-auto mt-12" />
        </div>

        <div className="flex items-center justify-between mb-8 border-b border-nordic-dark/5 pb-4">
          <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-nordic-dark/5 shadow-soft">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mosque opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-mosque"></span>
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-mosque leading-none">
                {favoriteProperties.length}
              </span>
              <span className="text-xs font-bold text-nordic-dark/60 uppercase tracking-[0.2em] leading-none">
                {dict.home.properties} guardadas
              </span>
            </div>
          </div>
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
