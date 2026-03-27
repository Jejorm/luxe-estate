'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleFavorite(
  propertyId: string,
  currentState: boolean,
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .update({ is_favorite: !currentState })
    .eq('id', propertyId)

  if (error) {
    console.error('Error toggling favorite:', error)
    return { success: false, error: error.message }
  }

  // Revalidate both the root page and the saved properties page
  revalidatePath('/')
  revalidatePath('/saved')

  return { success: true, is_favorite: !currentState }
}
