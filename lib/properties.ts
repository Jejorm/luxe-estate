import { supabase } from './supabase'

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
  tag: 'buy' | 'rent'
  images: string[]
  slug: string
  lat: number
  lng: number
  is_featured: boolean
  is_active: boolean
  is_favorite?: boolean
  property_type: PropertyType | null
  description?: string | null
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
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }

  return data ?? []
}

export async function getFavoriteProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_favorite', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching favorite properties:', error)
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
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true })

  // Text search across title and location
  if (filters.search?.trim()) {
    query = query.or(
      `title.ilike.%${filters.search.trim()}%,location.ilike.%${filters.search.trim()}%`,
    )
  }

  // Primary property tags (buy/rent filtering)
  if (filters.type === 'buy' || filters.type === 'rent') {
    query = query.eq('tag', filters.type)
  }
  // Property type filter (maps pill labels to DB values)
  else if (filters.type && filters.type !== 'all') {
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
    .eq('is_active', true)
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
  const { data, error } = await supabase
    .from('properties')
    .select('slug')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching property slugs:', error)
    return []
  }

  return data ?? []
}
