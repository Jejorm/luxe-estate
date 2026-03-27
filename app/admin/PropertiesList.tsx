import Image from 'next/image'
import type { Property } from '@/lib/properties'

export default function PropertiesList({
  properties,
}: {
  properties: Property[]
}) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-neutral-500 py-12 text-center bg-neutral-950/30 rounded-xl border border-neutral-800/30">
        No properties found in the directory.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {properties.slice(0, 6).map((property) => (
        <div
          key={property.id}
          className="flex items-center justify-between p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/50 hover:border-emerald-500/30 hover:bg-neutral-900/60 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800 relative group-hover:border-emerald-500/40 transition-colors">
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600 text-xs">
                  No img
                </div>
              )}
            </div>
            <div>
              <p className="text-neutral-100 font-medium line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {property.title}
              </p>
              <p className="text-neutral-500 text-sm line-clamp-1">
                {property.location}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-emerald-400 font-medium">
              {property.price_display}
            </p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider mt-0.5">
              {property.property_type || 'Unknown'}
            </p>
          </div>
        </div>
      ))}
      {properties.length > 6 && (
        <div className="text-center pt-4">
          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
            + {properties.length - 6} more active listings
          </span>
        </div>
      )}
    </div>
  )
}
