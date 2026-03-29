"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password. Please try again.")
      setLoading(false)
    } else {
      router.push("/books")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#2C5AA0] rounded-xl mb-5 shadow-[0_4px_14px_0_rgba(44,90,160,0.3)]">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h1 className="font-serif text-[1.875rem] font-bold text-[#1A202C] tracking-tight leading-tight mb-2">
            Welcome back
          </h1>
          <p className="text-[0.9375rem] text-[#718096]">
            Sign in to your library account
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#E5E9ED] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 bg-[#FFF5F5] border border-[#FEB2B2] rounded-lg">
                <svg className="w-4 h-4 text-[#C53030] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <p className="text-sm text-[#C53030]">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A202C]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-[#E5E9ED] rounded-lg text-[0.9375rem] text-[#1A202C] placeholder-[#A0AEC0] bg-white focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-[#1A202C]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 border border-[#E5E9ED] rounded-lg text-[0.9375rem] text-[#1A202C] placeholder-[#A0AEC0] bg-white focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A0AEC0] hover:text-[#718096] transition-colors duration-150"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col items-start gap-2 2-full">
              <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 bg-[#2C5AA0] text-white rounded-lg text-[0.9375rem] font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
            <Link href={"/"} className="w-full text-center px-5 py-3 bg-[#E5E9ED] text-black rounded-lg text-[0.9375rem] font-semibold  transition-all duration-150 shadow-sm " >
              Guess mode
            </Link>
            </div>
            

          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 p-5 bg-white border border-[#E5E9ED] rounded-xl">
          <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#A0AEC0] mb-3">
            Demo accounts
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {[
              { role: "Student",   email: "student@example.com" },
              { role: "Professor", email: "professor@example.com" },
              { role: "Librarian", email: "librarian@example.com" },
              { role: "Admin",     email: "admin@example.com" },
            ].map(({ role, email }) => (
              <button
                key={role}
                type="button"
                onClick={() => { setEmail(email); setPassword("password123") }}
                className="text-left group"
              >
                <p className="text-xs font-semibold text-[#1A202C] group-hover:text-[#2C5AA0] transition-colors duration-150">{role}</p>
                <p className="text-xs text-[#718096] truncate">{email}</p>
              </button>
            ))}
          </div>
          <p className="text-xs text-[#A0AEC0] mt-3 pt-3 border-t border-[#E5E9ED]">
            Click any account to fill the form · password: <span className="font-mono text-[#718096]">password123</span>
          </p>
        </div>

        <p className="text-center text-sm text-[#718096] mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#2C5AA0] hover:text-[#234780] transition-colors duration-150">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}
