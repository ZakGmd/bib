import { auth } from "@/auth"
import Link from "next/link"
import { SignOutButton } from "./signOutButton"

export async function Navbar() {
  const session = await auth()

  return (
    <header className="bg-white border-b border-[#E5E9ED] sticky top-0 z-40 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href={session?.user?.role === "LIBRARIAN" || session?.user?.role === "ADMIN" ? "/dashboard" : "/books"} className="flex items-center gap-2.5 group">
          <div className="flex items-center gap-2.5">
           <img src="bib/public/logo.png"  className="h-8 w-auto rounded-lg" />
           <span className="font-serif font-bold text-[#1A202C] text-[1.0625rem]">BIB-ESTO</span>
         </div>
        </Link>

        {/* Nav links — guests & students only */}
        {(!session || (session.user.role !== "LIBRARIAN" && session.user.role !== "ADMIN")) && (
          <nav className="hidden md:flex items-center gap-7">
            <Link href="/" className="text-sm font-medium text-[#4A5568] hover:text-[#1A202C] transition-colors duration-150">Home</Link>
            <Link href="/books" className="text-sm font-medium text-[#4A5568] hover:text-[#1A202C] transition-colors duration-150">Books</Link>
            <Link href="/about" className="text-sm font-medium text-[#4A5568] hover:text-[#1A202C] transition-colors duration-150">About</Link>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-6">
          {session ? (
            <>
              {session.user.role === "LIBRARIAN" || session.user.role === "ADMIN" ? (
                <Link href="/dashboard" className="text-sm font-medium text-[#4A5568] hover:text-[#1A202C] transition-colors duration-150">
                  Dashboard
                </Link>
              ) : (
                <Link href="/my-loans" className="text-sm font-medium text-[#4A5568] hover:text-[#1A202C] transition-colors duration-150">
                  My Loans
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
