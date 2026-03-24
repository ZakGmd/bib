import { auth } from "@/auth"
import Link from "next/link"
import { SignOutButton } from "./signOutButton"

export async function Navbar() {
  const session = await auth()

  return (
    <header className="bg-white border-b border-[#E5E9ED] sticky top-0 z-40 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/books" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-[#2C5AA0] rounded-lg flex items-center justify-center shadow-[0_2px_6px_0_rgba(44,90,160,0.25)]">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-serif font-bold text-[#1A202C] text-[1.0625rem] group-hover:text-[#2C5AA0] transition-colors duration-150">
            LibraryMS
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/my-loans" className="text-sm font-medium text-[#4A5568] hover:text-[#1A202C] transition-colors duration-150">
                My Loans
              </Link>

              {(session.user.role === "LIBRARIAN" || session.user.role === "ADMIN") && (
                <Link href="/dashboard" className="text-sm font-medium text-[#4A5568] hover:text-[#1A202C] transition-colors duration-150">
                  Dashboard
                </Link>
              )}

              <div className="flex items-center gap-3 pl-3 border-l border-[#E5E9ED]">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-[#1A202C] leading-none">{session.user.name}</p>
                  <p className="text-[0.6875rem] text-[#718096] mt-0.5 uppercase tracking-wide font-medium">{session.user.role}</p>
                </div>
                <SignOutButton />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-px"
            >
              Sign in
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}
