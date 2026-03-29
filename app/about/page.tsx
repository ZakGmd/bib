import Link from "next/link"
import { Navbar } from "../components/navbar"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAFBFC]">

        {/* ── Header ── */}
        <section className="max-w-[1100px] w-full mx-auto px-6 md:px-8 pt-20 pb-16 border-b border-[#E5E9ED]">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col items-start">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2C5AA0] mb-4">
              About BIB-ESTO
            </p>
            <h1 className="font-serif text-[3rem] font-bold text-[#1A202C] leading-[1.1] tracking-tight max-w-[640px] mb-5">
              The library service of ESTO
            </h1>
            <p className="text-[1.125rem] text-[#4A5568] leading-relaxed max-w-[560px]">
              BIB-ESTO is the digital library management system of the École Supérieure de Technologie d'Oujda — making it easy for the academic community to borrow and return books.
            </p>
            </div>
            
            <div className="overflow-hidden w-full h-full">
              <img src="/logo.png" alt="BIB-ESTO" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>         
          
        </section>

        {/* ── Mission ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 py-16 border-b border-[#E5E9ED]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-3">Our mission</p>
              <h2 className="font-serif text-[1.875rem] font-bold text-[#1A202C] tracking-tight mb-5">
                Supporting learning through access to knowledge
              </h2>
              <p className="text-[0.9375rem] text-[#4A5568] leading-relaxed mb-4">
                Our mission is to give every student and professor at ESTO easy, fast access to the books they need — without administrative friction.
              </p>
              <p className="text-[0.9375rem] text-[#4A5568] leading-relaxed">
                Through BIB-ESTO, members of the academic community can browse the catalog, request loans online, and track their borrowing history — all from one platform.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Students", body: "Undergraduate and graduate students enrolled at ESTO can borrow books for the duration of the semester." },
                { label: "Professors", body: "Faculty members enjoy extended loan periods to support course preparation and academic research." },
                { label: "Librarians", body: "Our dedicated staff manage the catalog, approve requests, and ensure books are returned in good condition." },
              ].map(({ label, body }) => (
                <div key={label} className="bg-white border border-[#E5E9ED] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                  <p className="text-sm font-bold text-[#1A202C] mb-1.5">{label}</p>
                  <p className="text-sm text-[#718096] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 py-16 border-b border-[#E5E9ED]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-3">How it works</p>
          <h2 className="font-serif text-[1.875rem] font-bold text-[#1A202C] tracking-tight mb-10">
            Borrow a book in three steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Browse the catalog",
                body: "Search by title, author, or category. Check availability in real time and read book details before requesting.",
              },
              {
                step: "02",
                title: "Request a loan",
                body: "Sign in with your ESTO account and submit a loan request with a single click. Your librarian will review it promptly.",
              },
              {
                step: "03",
                title: "Pick up & return",
                body: "Once approved, collect your book at the library. Return it before the due date to keep your borrowing privileges.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-white border border-[#E5E9ED] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                <p className="font-serif text-[2rem] font-bold text-[#E5E9ED] tracking-tight mb-4 leading-none">{step}</p>
                <h3 className="font-serif text-[1.125rem] font-bold text-[#1A202C] mb-2">{title}</h3>
                <p className="text-sm text-[#718096] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── About ESTO ── */}
        <section className="max-w-[1100px] mx-auto px-6 md:px-8 py-16">
          <div className="bg-white border border-[#E5E9ED] rounded-2xl p-8 md:p-12 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2C5AA0] mb-3">About ESTO</p>
            <h2 className="font-serif text-[1.875rem] font-bold text-[#1A202C] tracking-tight mb-5 max-w-[500px]">
              École Supérieure de Technologie d'Oujda
            </h2>
            <p className="text-[0.9375rem] text-[#4A5568] leading-relaxed max-w-[640px] mb-6">
              ESTO is a higher education institution in Oujda, Morocco, offering technical degrees in engineering, IT, and applied sciences. BIB-ESTO is its dedicated library platform, designed to serve the institution's students and academic staff.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C5AA0] text-white rounded-xl text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm"
            >
              Explore the catalog
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
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
