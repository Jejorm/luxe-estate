import { signInWithGitHub, signInWithGoogle } from '@/app/actions/auth'

export default function LoginPage() {
  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-4 antialiased relative overflow-hidden bg-[#eff6f5] text-[#1a2d2a]">
      {/* Background radial gradient for a premium feel similar to the image */}
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
            Welcome to LuxeEstate
          </h1>
          <p className="text-[#6b7c7a] text-lg font-medium">
            Unlock exclusive properties worldwide.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-10 border border-white/60 backdrop-blur-xl">
          <div className="space-y-4">
            {/* Google Button */}
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-[#f0f0f0] rounded-xl text-[#1a2d2a] font-semibold transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Google logo"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            {/* GitHub Button */}
            <form action={signInWithGitHub}>
              <button
                type="submit"
                className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-[#f0f0f0] rounded-xl text-[#1a2d2a] font-semibold transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
              >
                <svg
                  className="w-6 h-6 fill-current text-[#1a2d2a]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="GitHub logo"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </form>
          </div>

          <p className="mt-10 text-center text-[0.95rem] text-[#6b7c7a] font-medium">
            {"Don't have an account?"}{' '}
            <a
              className="font-bold text-[#006655] hover:text-[#004d40] transition-colors"
              href="/"
            >
              Sign up
            </a>
          </p>
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
