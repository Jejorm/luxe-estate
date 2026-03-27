import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '../lib/properties'
import { FavoriteButton } from './FavoriteButton'

interface Props {
  property: Property
  className?: string
}

export const PropertyCard = ({ property, className = '' }: Props) => {
  // Dynamic tag styling depending on tag
  const isSale = property.tag === 'buy'
  const tagBgClass = isSale ? 'bg-nordic-dark/90' : 'bg-mosque/90'

  return (
    <Link
      href={`/properties/${property.slug}`}
      className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col ${className}`}
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          alt={property.title || 'Property'}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          src={
            property.images?.[0] ||
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80'
          }
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <FavoriteButton
          propertyId={property.id}
          initialIsFavorite={property.is_favorite}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full hover:bg-white"
        />
        {property.tag && (
          <div
            className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${tagBgClass}`}
          >
            {property.tag.toUpperCase()}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {property.price_display}
            {property.is_rent && (
              <span className="text-sm font-normal text-nordic-muted">/mo</span>
            )}
          </h3>
        </div>
        <h4 className="text-nordic-dark font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">
              king_bed
            </span>{' '}
            {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">
              bathtub
            </span>{' '}
            {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">
              square_foot
            </span>{' '}
            {property.area}m²
          </div>
        </div>
      </div>
    </Link>
  )
}
