import { supabase } from './supabase'

export type PropertyTagType = 'sale' | 'rent' | 'exclusive' | 'new'
export type PropertyType =
  | 'house'
  | 'apartment'
  | 'villa'
  | 'penthouse'
  | 'condo'
  | 'townhouse'
  | 'loft'
  | 'estate'

export interface Property {
  id: string
  title: string
  location: string
  price_display: string
  price_numeric: number | null
  is_rent: boolean
  beds: number
  baths: number
  area: string
  tag: string
  tag_type: PropertyTagType | null
  images: string[]
  slug: string
  lat: number
  lng: number
  is_featured: boolean
  property_type: PropertyType | null
  created_at: string
}

export interface PropertyFilters {
  search?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  minBaths?: number
}

export interface PaginatedProperties {
  data: Property[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }

  return data ?? []
}

export async function getNewMarketProperties(
  page = 1,
  pageSize = 8,
  filters: PropertyFilters = {},
): Promise<PaginatedProperties> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true })

  // Text search across title and location
  if (filters.search && filters.search.trim()) {
    query = query.or(
      `title.ilike.%${filters.search.trim()}%,location.ilike.%${filters.search.trim()}%`,
    )
  }

  // Property type filter (maps pill labels to DB values)
  if (filters.type && filters.type !== 'all') {
    // Support compound labels like "villa" → matches "villa", "estate" → broad match
    const typeMap: Record<string, string[]> = {
      house: ['house'],
      apartment: ['apartment'],
      villa: ['villa'],
      penthouse: ['penthouse'],
      condo: ['condo'],
      townhouse: ['townhouse'],
      loft: ['loft'],
      estate: ['estate'],
    }
    const mapped = typeMap[filters.type.toLowerCase()]
    if (mapped && mapped.length === 1) {
      query = query.eq('property_type', mapped[0])
    }
  }

  // Price range
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    query = query.gte('price_numeric', filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price_numeric', filters.maxPrice)
  }

  // Bedrooms & bathrooms minimums
  if (filters.minBeds !== undefined && filters.minBeds > 0) {
    query = query.gte('beds', filters.minBeds)
  }
  if (filters.minBaths !== undefined && filters.minBaths > 0) {
    query = query.gte('baths', filters.minBaths)
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Error fetching new market properties:', error)
    return { data: [], count: 0, page, pageSize, totalPages: 0 }
  }

  const totalCount = count ?? 0
  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    data: data ?? [],
    count: totalCount,
    page,
    pageSize,
    totalPages,
  }
}

export async function getPropertyBySlug(
  slug: string,
): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code !== 'PGRST116')
      // Not found error
      console.error('Error fetching property by slug:', error)
    return null
  }

  return data
}

export async function getAllPropertySlugs(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase.from('properties').select('slug')

  if (error) {
    console.error('Error fetching property slugs:', error)
    return []
  }

  return data ?? []
}
