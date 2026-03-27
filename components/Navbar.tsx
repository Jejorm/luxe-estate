import Image from 'next/image'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import { getCurrentLocale, getDictionary } from '@/lib/i18n/getDictionary'
import { createClient } from '@/lib/supabase/server'
import { LanguageSelector } from './LanguageSelector'

export const Navbar = async () => {
  const dict = await getDictionary()
  const locale = await getCurrentLocale()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const fullName = user?.user_metadata?.full_name as string | undefined

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/">
            <div className="shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-nordic-dark flex items-center justify-center">
                <span className="material-icons text-white text-lg">
                  apartment
                </span>
              </div>
              <span className="text-xl font-semibold tracking-tight text-nordic-dark">
                LuxeEstate
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="/buy"
            >
              {dict.nav.buy}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="/rent"
            >
              {dict.nav.rent}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="/sell"
            >
              {dict.nav.sell}
            </Link>
            <Link
              className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all"
              href="/saved"
            >
              {dict.nav.savedHomes}
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-6">
            <LanguageSelector currentLocale={locale} />
            <button
              type="button"
              className="text-nordic-dark hover:text-mosque transition-colors hidden sm:block"
            >
              <span className="material-icons">search</span>
            </button>
            <button
              type="button"
              className="text-nordic-dark hover:text-mosque transition-colors relative hidden sm:block"
            >
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light" />
            </button>

            {user ? (
              <div className="flex items-center gap-4 sm:pl-2 sm:border-l border-nordic-dark/10 sm:ml-2">
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all">
                  {avatarUrl ? (
                    <Image
                      alt={fullName ?? 'Profile'}
                      className="w-full h-full object-cover"
                      src={avatarUrl}
                      width={36}
                      height={36}
                    />
                  ) : (
                    <span className="material-icons text-nordic-dark text-lg flex items-center justify-center w-full h-full">
                      person
                    </span>
                  )}
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-sm font-semibold text-mosque hover:text-mosque/80 transition-colors"
                  >
                    {dict.nav.signOut}
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 sm:pl-2 sm:border-l border-nordic-dark/10 sm:ml-2 text-sm font-semibold text-mosque hover:text-mosque/80 transition-colors"
              >
                {dict.nav.signIn}
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Nav could be added here later */}
    </nav>
  )
}
