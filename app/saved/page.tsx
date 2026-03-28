import { Navbar } from '@/components/Navbar'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { SavedPropertiesClient } from '@/components/SavedPropertiesClient'

export default async function SavedPropertiesPage() {
  const dict = await getDictionary()

  return (
    <div className="bg-background-light min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-28">
        <SavedPropertiesClient dict={dict} />
      </main>
    </div>
  )
}
