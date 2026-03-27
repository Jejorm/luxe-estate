import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PropertyForm from '../components/PropertyForm'

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !property) {
    console.error('Error fetching property:', error)
    notFound()
  }

  return <PropertyForm initialData={property} />
}
