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

export async function fetchAdminUsers() {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_admin_users')

  if (error) {
    console.error('Error fetching admin users:', error)
    return { success: false, data: [] }
  }

  return {
    success: true,
    data: data as { id: string; email: string; role: AppRole }[],
  }
}

export async function fetchAdminProperties() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching admin properties:', error)
    return { success: false, data: [] }
  }

  return {
    success: true,
    data,
  }
}
