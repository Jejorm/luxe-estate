'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AppRole = 'admin' | 'user'

export async function updateUserRole(userId: string, newRole: AppRole) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('set_user_role', {
    target_user_id: userId,
    new_role: newRole,
  })

  if (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/admin/users')
  return { success: true }
}

export async function fetchAdminUsers(page = 1, limit = 10) {
  const supabase = await createClient()

  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error, count } = await supabase
    .rpc('get_admin_users', {}, { count: 'exact' })
    .range(start, end)

  if (error) {
    console.error('Error fetching admin users:', error)
    return { success: false, data: [], total: 0 }
  }

  return {
    success: true,
    data: data as { id: string; email: string; role: AppRole }[],
    total: count || 0,
  }
}

export async function fetchAdminProperties(page = 1, limit = 10) {
  const supabase = await createClient()

  const start = (page - 1) * limit
  const end = start + limit - 1

  const { data, error, count } = await supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end)

  if (error) {
    console.error('Error fetching admin properties:', error)
    return { success: false, data: [], total: 0 }
  }

  return {
    success: true,
    data,
    total: count || 0,
  }
}

export async function togglePropertyActive(
  id: string,
  currentActive: boolean,
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .update({ is_active: !currentActive })
    .eq('id', id)

  if (error) {
    console.error('Error toggling property active state:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/properties')
  revalidatePath('/')
  return { success: true }
}
