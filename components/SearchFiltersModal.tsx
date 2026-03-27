'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface SearchFiltersModalProps {
  isOpen: boolean
  onClose: () => void
}

const AMENITIES = [
  { id: 'pool', icon: 'pool', label: 'Swimming Pool' },
  { id: 'gym', icon: 'fitness_center', label: 'Gym' },
  { id: 'parking', icon: 'local_parking', label: 'Parking' },
  { id: 'ac', icon: 'ac_unit', label: 'Air Conditioning' },
  { id: 'wifi', icon: 'wifi', label: 'High-speed Wifi' },
  { id: 'patio', icon: 'deck', label: 'Patio / Terrace' },
]

const MIN_PRICE = 0
const MAX_PRICE = 10_000_000
const STEP = 50_000

function formatPrice(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

export function SearchFiltersModal({
  isOpen,
  onClose,
}: SearchFiltersModalProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [location, setLocation] = useState(searchParams.get('search') ?? '')
  const [minPrice, setMinPrice] = useState(
    Number(searchParams.get('minPrice') ?? 0),
  )
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get('maxPrice') ?? MAX_PRICE),
  )
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null)
  const [propertyType, setPropertyType] = useState(
    searchParams.get('type') ?? 'Any Type',
  )
  const [beds, setBeds] = useState(Number(searchParams.get('minBeds') ?? 0))
  const [baths, setBaths] = useState(Number(searchParams.get('minBaths') ?? 0))
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(
    new Set(['pool', 'wifi']),
  )

  // Sync state from URL when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocation(searchParams.get('search') ?? '')
      setMinPrice(Number(searchParams.get('minPrice') ?? 0))
      setMaxPrice(Number(searchParams.get('maxPrice') ?? MAX_PRICE))
      setPropertyType(searchParams.get('type') ?? 'Any Type')
      setBeds(Number(searchParams.get('minBeds') ?? 0))
      setBaths(Number(searchParams.get('minBaths') ?? 0))
    }
  }, [isOpen, searchParams])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (location.trim()) params.set('search', location.trim())
    if (propertyType && propertyType !== 'Any Type')
      params.set('type', propertyType.toLowerCase())
    if (minPrice > 0) params.set('minPrice', String(minPrice))
    if (maxPrice < MAX_PRICE) params.set('maxPrice', String(maxPrice))
    if (beds > 0) params.set('minBeds', String(beds))
    if (baths > 0) params.set('minBaths', String(baths))
    params.set('page', '1')

    router.push(`/?${params.toString()}`)
    onClose()
  }

  const clearAll = () => {
    setLocation('')
    setMinPrice(0)
    setMaxPrice(MAX_PRICE)
    setPropertyType('Any Type')
    setBeds(0)
    setBaths(0)
    setSelectedAmenities(new Set())

    const params = new URLSearchParams()
    params.set('page', '1')
    router.push(`/?${params.toString()}`)
    onClose()
  }

  // Percentage positions for the slider track
  const minPct = ((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100
  const maxPct = ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100

  // Drag handling for the dual-range slider
  const handleTrackMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!dragging) return
      const rect = e.currentTarget.getBoundingClientRect()
      const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
      const raw = MIN_PRICE + pct * (MAX_PRICE - MIN_PRICE)
      const snapped = Math.round(raw / STEP) * STEP

      if (dragging === 'min') {
        setMinPrice(Math.min(snapped, maxPrice - STEP))
      } else {
        setMaxPrice(Math.max(snapped, minPrice + STEP))
      }
    },
    [dragging, minPrice, maxPrice],
  )

  if (!isOpen) return null

  // Count active filters for the badge
  const activeCount = [
    location.trim(),
    propertyType !== 'Any Type' ? propertyType : '',
    minPrice > 0 ? 'min' : '',
    maxPrice < MAX_PRICE ? 'max' : '',
    beds > 0 ? 'beds' : '',
    baths > 0 ? 'baths' : '',
  ].filter(Boolean).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm cursor-default w-full h-full"
        onClick={onClose}
        aria-label="Close filters"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Filters
            </h2>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-mosque text-white text-xs font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <span className="material-icons">close</span>
          </button>
        </header>

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto p-8 space-y-10"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Section 1: Location */}
          <section>
            <label
              htmlFor="location-input"
              className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"
            >
              Location
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">
                location_on
              </span>
              <input
                id="location-input"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white transition-all shadow-sm"
                placeholder="City, neighborhood, or address"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price Range
              </span>
              <span className="text-sm font-medium text-mosque">
                {minPrice === 0 ? 'Any' : formatPrice(minPrice)} –{' '}
                {maxPrice >= MAX_PRICE ? 'No limit' : formatPrice(maxPrice)}
              </span>
            </div>

            {/* Dual Slider */}
            <fieldset
              className="relative h-12 flex items-center mb-6 px-2 cursor-pointer select-none border-0 p-0 m-0"
              onMouseMove={handleTrackMouseMove}
              onMouseUp={() => setDragging(null)}
              onMouseLeave={() => setDragging(null)}
            >
              <legend className="sr-only">Price range slider</legend>
              <div className="absolute inset-x-2 h-1 bg-gray-200 rounded-full" />
              <div
                className="absolute h-1 bg-mosque rounded-full"
                style={{
                  left: `calc(${minPct}% + 8px)`,
                  width: `${maxPct - minPct}%`,
                }}
              />
              {/* Min handle */}
              <div
                className="absolute w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                style={{ left: `calc(${minPct}% + 8px - 12px)` }}
                onMouseDown={() => setDragging('min')}
                role="slider"
                aria-label="Minimum Price"
                aria-valuenow={minPrice}
                aria-valuemin={MIN_PRICE}
                aria-valuemax={maxPrice}
                tabIndex={0}
              />
              {/* Max handle */}
              <div
                className="absolute w-6 h-6 bg-white border-2 border-mosque rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                style={{ left: `calc(${maxPct}% + 8px - 12px)` }}
                onMouseDown={() => setDragging('max')}
                role="slider"
                aria-label="Maximum Price"
                aria-valuenow={maxPrice}
                aria-valuemin={minPrice}
                aria-valuemax={MAX_PRICE}
                tabIndex={0}
              />
            </fieldset>

            {/* Price inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label
                  htmlFor="min-price-input"
                  className="block text-[10px] text-gray-500 uppercase font-medium mb-1"
                >
                  Min Price
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    id="min-price-input"
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm"
                    type="text"
                    value={minPrice === 0 ? '' : minPrice.toLocaleString()}
                    placeholder="0"
                    onChange={(e) => {
                      const val = Number.parseInt(
                        e.target.value.replace(/,/g, ''),
                        10,
                      )
                      setMinPrice(
                        Number.isNaN(val) ? 0 : Math.min(val, maxPrice - STEP),
                      )
                    }}
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label
                  htmlFor="max-price-input"
                  className="block text-[10px] text-gray-500 uppercase font-medium mb-1"
                >
                  Max Price
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    id="max-price-input"
                    className="w-full bg-transparent border-0 p-0 text-gray-900 font-medium focus:ring-0 text-sm"
                    type="text"
                    value={
                      maxPrice >= MAX_PRICE ? '' : maxPrice.toLocaleString()
                    }
                    placeholder="No limit"
                    onChange={(e) => {
                      const val = Number.parseInt(
                        e.target.value.replace(/,/g, ''),
                        10,
                      )
                      setMaxPrice(
                        Number.isNaN(val)
                          ? MAX_PRICE
                          : Math.max(val, minPrice + STEP),
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label
                htmlFor="property-type-select"
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Property Type
              </label>
              <div className="relative">
                <select
                  id="property-type-select"
                  className="w-full bg-gray-50 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option>Any Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="loft">Loft</option>
                  <option value="estate">Estate</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Beds & Baths counters */}
            <div className="space-y-4">
              {/* Bedrooms */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">
                  Bedrooms
                </span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-40 transition-colors"
                    onClick={() => setBeds((prev) => Math.max(0, prev - 1))}
                    disabled={beds === 0}
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-8 text-center">
                    {beds === 0 ? 'Any' : `${beds}+`}
                  </span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    onClick={() => setBeds((prev) => prev + 1)}
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Bathrooms */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">
                  Bathrooms
                </span>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-40 transition-colors"
                    onClick={() => setBaths((prev) => Math.max(0, prev - 1))}
                    disabled={baths === 0}
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-8 text-center">
                    {baths === 0 ? 'Any' : `${baths}+`}
                  </span>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    onClick={() => setBaths((prev) => prev + 1)}
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Amenities &amp; Features
            </span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AMENITIES.map((amenity) => {
                const active = selectedAmenities.has(amenity.id)
                return (
                  <label key={amenity.id} className="cursor-pointer relative">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleAmenity(amenity.id)}
                      className="sr-only"
                    />
                    <div
                      className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all font-medium
                      ${
                        active
                          ? 'border-mosque bg-mosque/10 text-mosque'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`material-icons text-lg ${active ? 'text-mosque' : 'text-gray-400'}`}
                      >
                        {amenity.icon}
                      </span>
                      {amenity.label}
                    </div>
                    {active && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full" />
                    )}
                  </label>
                )
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4"
          >
            Clear all filters
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 active:scale-95"
          >
            Show Homes
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  )
}
