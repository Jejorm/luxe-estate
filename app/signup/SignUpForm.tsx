'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signUpWithEmail } from '@/app/actions/auth'

export default function SignUpForm({ dict }: { dict: any }) {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null)

  const errorMessage = state?.error
    ? dict.auth.errors[state.error as keyof typeof dict.auth.errors] ||
      dict.auth.errors.default
    : null

  const successMessage = state?.success === 'check_email'
    ? dict.auth.messages.check_email
    : null

  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-4 antialiased relative overflow-hidden bg-[#eff6f5] text-[#1a2d2a]">
      {/* Background radial gradient for a premium feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />

      <main className="w-full max-w-md z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#004d40] rounded-[1.25rem] mb-6 shadow-sm text-white">
            <span className="material-symbols-rounded text-4xl">
              real_estate_agent
            </span>
          </div>
          <h1 className="text-[2rem] font-bold tracking-tight text-[#1a2d2a] mb-2 leading-tight">
            Join LuxeEstate
          </h1>
          <p className="text-[#6b7c7a] text-lg font-medium">
            Create an account to start managing your properties.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10 border border-white/60 backdrop-blur-xl">
          <div className="space-y-6">
            <form action={formAction} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-[#1a2d2a] ml-1"
                  htmlFor="email"
                >
                  {dict.auth.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full h-12 px-4 rounded-xl border border-[#f0f0f0] bg-white text-[#1a2d2a] placeholder-[#adb5b4] focus:outline-none focus:ring-2 focus:ring-[#004d40]/10 focus:border-[#004d40] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold text-[#1a2d2a] ml-1"
                  htmlFor="password"
                >
                  {dict.auth.password}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-[#f0f0f0] bg-white text-[#1a2d2a] placeholder-[#adb5b4] focus:outline-none focus:ring-2 focus:ring-[#004d40]/10 focus:border-[#004d40] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer w-full h-12 bg-[#004d40] text-white rounded-xl font-semibold shadow-sm hover:bg-[#00382d] transition-all duration-200 active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? '...' : dict.auth.signUpBtn}
              </button>

              {/* Status Message BELOW the form */}
              {errorMessage && (
                <div className="mt-6 p-4 rounded-2xl !bg-[#fef2f2] border-2 !border-[#ef4444] flex items-center gap-3 !text-[#b91c1c] text-base font-bold animate-in fade-in slide-in-from-top-2 shadow-sm">
                  <span className="material-symbols-rounded text-2xl !text-[#ef4444] shrink-0">
                    warning
                  </span>
                  <span className="leading-tight">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mt-6 p-4 rounded-2xl bg-mosque/5 border-2 border-mosque flex items-center gap-3 text-mosque text-base font-bold animate-in fade-in slide-in-from-top-2 shadow-sm">
                  <span className="material-symbols-rounded text-2xl shrink-0">
                    check_circle
                  </span>
                  <span className="leading-tight">{successMessage}</span>
                </div>
              )}
            </form>

            <p className="text-center text-sm font-medium text-[#6b7c7a] pt-2">
              {dict.auth.haveAccount}{' '}
              <Link
                href="/login"
                className="text-[#004d40] hover:underline font-bold"
              >
                {dict.auth.signIn}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-10">
          <nav className="flex justify-center gap-8 text-sm font-medium text-[#adb5b4]">
            <a className="hover:text-[#6b7c7a] transition-colors" href="/">
              Privacy Policy
            </a>
            <a className="hover:text-[#6b7c7a] transition-colors" href="/">
              Terms of Service
            </a>
            <a className="hover:text-[#6b7c7a] transition-colors" href="/">
              Help Center
            </a>
          </nav>
        </div>
      </main>
    </div>
  )
}
