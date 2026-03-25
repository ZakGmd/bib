import Link from "next/link"
import { Navbar } from "./components/navbar"
import { prisma } from "@/lib/prisma"

export default async function HomePage() {
  const [totalBooks, totalAvailable, categoryRows] = await Promise.all([
    prisma.book.count(),
    prisma.book.count({ where: { availableCopies: { gt: 0 } } }),
    prisma.book.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
    }),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC]">

        {/* ── Hero ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 pt-24 pb-20">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2C5AA0] mb-4">
            École Supérieure de Technologie — Oujda
          </p>
          <h1 className="font-serif text-[3.25rem] md:text-[4rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight max-w-[720px] mb-6">
            Your academic library,<br />
            <span className="text-[#2C5AA0]">simplified.</span>
          </h1>
          <p className="text-[1.125rem] text-[#4A5568] leading-relaxed max-w-[520px] mb-10">
            Browse our catalog, request book loans, and manage returns — all in one place.
            Built for students and professors of ESTO.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2C5AA0] text-white rounded-xl text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-[0_2px_8px_0_rgba(44,90,160,0.25)] hover:shadow-[0_4px_16px_0_rgba(44,90,160,0.3)] hover:-translate-y-px"
            >
              Browse Catalog
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#4A5568] border border-[#E5E9ED] rounded-xl text-sm font-semibold hover:bg-[#F8F9FA] hover:border-[#D1D8DF] hover:text-[#1A202C] transition-all duration-150"
            >
              Learn more
            </Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 pb-20">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: totalBooks,           label: "Books in catalog",   color: "text-[#1A202C]" },
              { value: totalAvailable,       label: "Available now",      color: "text-[#0F7B6C]" },
              { value: categoryRows.length,  label: "Subject categories", color: "text-[#2C5AA0]" },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white border border-[#E5E9ED] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                <p className={`font-serif text-[2.5rem] font-bold tracking-tight mb-1 ${color}`}>{value}</p>
                <p className="text-sm text-[#718096]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 pb-24">
          <p className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-3">What we offer</p>
          <h2 className="font-serif text-[2rem] font-bold text-[#1A202C] tracking-tight mb-10 max-w-[500px]">
            Everything you need to borrow books on campus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Rich Catalog",
                body: "Explore a curated collection across engineering, science, technology and more — updated regularly by our librarians.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Online Requests",
                body: "Request a loan from any device. No need to visit the desk — your librarian reviews and approves requests digitally.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Track Your Loans",
                body: "Stay on top of your active loans, due dates and return history — all from your personal dashboard.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-white border border-[#E5E9ED] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                <div className="w-9 h-9 bg-[#EBF1FA] rounded-lg flex items-center justify-center text-[#2C5AA0] mb-4">
                  {icon}
                </div>
                <h3 className="font-serif text-[1.125rem] font-bold text-[#1A202C] mb-2">{title}</h3>
                <p className="text-sm text-[#718096] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 pb-24">
          <div className="bg-[#2C5AA0] rounded-2xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-serif text-[1.75rem] font-bold text-white tracking-tight mb-2">
                Ready to start reading?
              </h2>
              <p className="text-[#bed3f0] text-sm leading-relaxed max-w-[380px]">
                Sign in with your ESTO account and request your first book today.
              </p>
            </div>
            <div className="flex gap-3 shrink-0 flex-wrap">
              <Link
                href="/books"
                className="px-6 py-3 bg-white text-[#2C5AA0] rounded-xl text-sm font-semibold hover:bg-[#F8F9FA] transition-all duration-150 shadow-sm"
              >
                Browse Catalog
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-[#234780] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3660] transition-all duration-150"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-[#E5E9ED] bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BIB-ESTO" className="h-7 w-auto" />
              <span className="font-serif font-bold text-[#1A202C] text-sm">BIB-ESTO</span>
            </div>
            <p className="text-xs text-[#718096]">
              © {new Date().getFullYear()} École Supérieure de Technologie Oujda
            </p>
            <nav className="flex gap-5">
              <Link href="/" className="text-xs text-[#718096] hover:text-[#1A202C] transition-colors">Home</Link>
              <Link href="/books" className="text-xs text-[#718096] hover:text-[#1A202C] transition-colors">Books</Link>
              <Link href="/about" className="text-xs text-[#718096] hover:text-[#1A202C] transition-colors">About</Link>
            </nav>
          </div>
        </footer>

      </main>
    </>
  )
}
