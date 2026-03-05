import { supabase } from './supabase'

export type PropertyTagType = 'sale' | 'rent' | 'exclusive' | 'new'

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
  created_at: string
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
): Promise<PaginatedProperties> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_featured', false)
    .order('created_at', { ascending: true })
    .range(from, to)

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
