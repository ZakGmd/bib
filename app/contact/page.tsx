import Link from "next/link"
import { Navbar } from "@/app/components/navbar"
import { ContactForm } from "./_components/contactForm"

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC]">

        {/* ── Header ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 pt-20 pb-16 border-b border-[#E5E9ED]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2C5AA0] mb-4">Get in touch</p>
          <h1 className="font-serif text-[3rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight mb-5">
            Contact us
          </h1>
          <p className="text-[1.125rem] text-[#4A5568] leading-relaxed max-w-[520px]">
            Have a question about a book, a loan, or the library? Send us a message and our librarian will get back to you.
          </p>
        </section>

        {/* ── Content ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-12 items-start">

            {/* Info cards */}
            <div className="flex flex-col gap-5">
              <p className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-1">Why contact us?</p>
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                  title: "Book requests",
                  body: "Want a book that isn't in our catalog? Let us know and we'll look into acquiring it.",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  title: "Loan issues",
                  body: "Having trouble with a loan request or return? We're here to help resolve it quickly.",
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "General questions",
                  body: "Any other questions about BIB-ESTO or the library at ESTO? We're happy to help.",
                },
              ].map(({ icon, title, body }) => (
                <div key={title} className="bg-white border border-[#E5E9ED] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] flex gap-4">
                  <div className="w-9 h-9 bg-[#EBF1FA] rounded-lg flex items-center justify-center text-[#2C5AA0] shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A202C] mb-1">{title}</p>
                    <p className="text-sm text-[#718096] leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form — client component */}
            <ContactForm />

          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-[#E5E9ED] bg-white">
          <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="BIB-ESTO" className="h-7 w-auto" />
              <span className="font-serif font-bold text-[#1A202C] text-sm">BIB-ESTO</span>
            </div>
            <p className="text-xs text-[#718096]">© {new Date().getFullYear()} École Supérieure de Technologie Oujda</p>
            <nav className="flex gap-5">
              <Link href="/" className="text-xs text-[#718096] hover:text-[#1A202C] transition-colors">Home</Link>
              <Link href="/books" className="text-xs text-[#718096] hover:text-[#1A202C] transition-colors">Books</Link>
              <Link href="/about" className="text-xs text-[#718096] hover:text-[#1A202C] transition-colors">About</Link>
              <Link href="/contact" className="text-xs text-[#718096] hover:text-[#1A202C] transition-colors">Contact</Link>
            </nav>
          </div>
        </footer>

      </main>
    </>
  )
}
