import Image from 'next/image'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import { getCurrentLocale, getDictionary } from '@/lib/i18n/getDictionary'
import { createClient } from '@/lib/supabase/server'
import { LanguageSelector } from './LanguageSelector'
import { NavLink } from './NavLink'
import { MobileMenu } from './MobileMenu'

export const Navbar = async () => {
  const dict = await getDictionary()
  const locale = await getCurrentLocale()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRole = null
  if (user) {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
    userRole = data?.role
  }

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
  const fullName = user?.user_metadata?.full_name as string | undefined

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="shrink-0 flex items-center gap-2 cursor-pointer">
                <Image
                  src="/logo.svg"
                  alt="Luxe Estate Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-semibold tracking-tight text-nordic-dark">
                  LuxeEstate
                </span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {userRole === 'admin' && (
              <NavLink
                className="bg-nordic-dark text-white hover:bg-mosque font-semibold text-sm px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-lg hover:shadow-mosque/20 mr-4 group"
                activeClassName="!bg-mosque ring-4 ring-mosque/10"
                href="/admin"
              >
                <span className="material-icons text-lg group-hover:rotate-12 transition-transform">
                  admin_panel_settings
                </span>
                {dict.nav.manageProperties}
              </NavLink>
            )}
            <NavLink
              className="text-nordic-dark/60 hover:text-nordic-dark hover:bg-nordic-dark/5 font-medium text-sm px-4 py-2 rounded-full transition-all"
              activeClassName="!text-nordic-dark !bg-nordic-dark/10 shadow-sm ring-1 ring-nordic-dark/5"
              href="/buy"
            >
              {dict.nav.buy}
            </NavLink>
            <NavLink
              className="text-nordic-dark/60 hover:text-nordic-dark hover:bg-nordic-dark/5 font-medium text-sm px-4 py-2 rounded-full transition-all"
              activeClassName="!text-nordic-dark !bg-nordic-dark/10 shadow-sm ring-1 ring-nordic-dark/5"
              href="/rent"
            >
              {dict.nav.rent}
            </NavLink>
            <NavLink
              className="text-nordic-dark/60 hover:text-nordic-dark hover:bg-nordic-dark/5 font-medium text-sm px-4 py-2 rounded-full transition-all"
              activeClassName="!text-nordic-dark !bg-nordic-dark/10 shadow-sm ring-1 ring-nordic-dark/5"
              href="/saved"
            >
              {dict.nav.savedHomes}
            </NavLink>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-6">
            <LanguageSelector currentLocale={locale} />

            {user ? (
              <div className="flex items-center gap-4 sm:pl-2 sm:border-l border-nordic-dark/10 sm:ml-2">
                <div className="w-9 h-9 rounded-full bg-nordic-dark/5 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all shrink-0">
                  {avatarUrl ? (
                    <Image
                      alt={fullName ?? 'Profile'}
                      className="w-full h-full object-cover"
                      src={avatarUrl}
                      width={36}
                      height={36}
                    />
                  ) : (
                    <span className="material-symbols-rounded text-nordic-dark/40 text-xl leading-none select-none">
                      person
                    </span>
                  )}
                </div>
                <form action={signOut} className="hidden sm:block">
                  <button
                    type="submit"
                    className="cursor-pointer text-sm font-semibold text-mosque hover:text-mosque/80 transition-colors"
                  >
                    {dict.nav.signOut}
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 sm:pl-2 sm:border-l border-nordic-dark/10 sm:ml-2 text-sm font-semibold text-mosque hover:text-mosque/80 transition-colors"
              >
                {dict.nav.signIn}
              </Link>
            )}

            <MobileMenu dict={dict} userRole={userRole} user={user} />
          </div>
        </div>
      </div>
    </nav>
  )
}
