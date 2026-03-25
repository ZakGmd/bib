import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/app/components/navbar"
import { RequestLoanButton } from "@/app/components/books/requestLoanButton"

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const [book, activeLoan] = await Promise.all([
    prisma.book.findUnique({
      where: { id },
      include: {
        authors: { include: { author: true }, orderBy: { order: "asc" } },
      },
    }),
    session
      ? prisma.loan.findFirst({
          where: { bookId: id, userId: session.user.id, status: { in: ["PENDING", "APPROVED"] } },
        })
      : Promise.resolve(null),
  ])

  if (!book) notFound()

  const authors = book.authors.map((ba) => ba.author)
  const isUnavailable = book.availableCopies === 0
  const isLimited = book.availableCopies === 1
  const isAlreadyRequested = !!activeLoan

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAFBFC]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-10">

          {/* Back */}
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#718096] hover:text-[#1A202C] transition-colors duration-150 mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

            {/* Left — cover + action */}
            <div className="flex flex-col gap-4">
              {/* Cover */}
              <div className="bg-white border border-[#E5E9ED] rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-[#EBF1FA] to-[#dce7f5] flex items-center justify-center p-8">
                  {book.isbn ? (
                    <Image
                      src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <p className="font-serif text-xl font-bold text-[#2C5AA0] text-center leading-snug">
                      {book.title}
                    </p>
                  )}
                </div>
              </div>

              {/* Availability card */}
              <div className="bg-white border border-[#E5E9ED] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#1A202C]">Availability</span>
                  {isUnavailable ? (
                    <span className="px-2.5 py-1 bg-[#FAFBFC] text-[#718096] border border-[#E5E9ED] rounded-lg text-xs font-semibold">
                      Unavailable
                    </span>
                  ) : isLimited ? (
                    <span className="px-2.5 py-1 bg-[#FEF3E2] text-[#D97706] border border-[#D97706]/20 rounded-lg text-xs font-semibold">
                      Limited
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-[#E6F7F5] text-[#0F7B6C] border border-[#0F7B6C]/20 rounded-lg text-xs font-semibold">
                      Available
                    </span>
                  )}
                </div>

                {/* Copy bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[#718096] mb-1.5">
                    <span>Copies available</span>
                    <span className="font-semibold text-[#1A202C]">{book.availableCopies} / {book.totalCopies}</span>
                  </div>
                  <div className="h-1.5 bg-[#E5E9ED] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isUnavailable ? "bg-[#A0AEC0]" : isLimited ? "bg-[#D97706]" : "bg-[#0F7B6C]"
                      }`}
                      style={{ width: `${book.totalCopies > 0 ? (book.availableCopies / book.totalCopies) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4">
                  {session ? (
                    <RequestLoanButton
                      bookId={book.id}
                      isAlreadyRequested={isAlreadyRequested}
                      isUnavailable={isUnavailable}
                    />
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full px-4 py-3 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md text-center"
                    >
                      Sign in to Request
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Right — book details */}
            <div className="flex flex-col gap-6">

              {/* Title block */}
              <div>
                {book.category && (
                  <p className="text-xs font-bold uppercase tracking-widest text-[#2C5AA0] mb-2">
                    {book.category}
                  </p>
                )}
                <h1 className="font-serif text-[2rem] font-bold text-[#1A202C] tracking-tight leading-tight mb-3">
                  {book.title}
                </h1>
                <p className="text-[1.0625rem] text-[#4A5568]">
                  {authors.map((a) => a.name).join(", ")}
                </p>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[#E5E9ED] rounded-xl overflow-hidden border border-[#E5E9ED]">
                {[
                  { label: "Publisher",  value: book.publisher ?? "—" },
                  { label: "Published",  value: book.publishedYear?.toString() ?? "—" },
                  { label: "ISBN",       value: book.isbn ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white px-5 py-4">
                    <p className="text-xs text-[#718096] mb-1">{label}</p>
                    <p className="text-sm font-semibold text-[#1A202C] truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {book.description && (
                <div className="bg-white border border-[#E5E9ED] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-3">About this book</h2>
                  <p className="text-[0.9375rem] text-[#4A5568] leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Authors */}
              <div className="bg-white border border-[#E5E9ED] rounded-xl p-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#718096] mb-4">
                  {authors.length === 1 ? "Author" : "Authors"}
                </h2>
                <div className="flex flex-col gap-4">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EBF1FA] to-[#dce7f5] flex items-center justify-center shrink-0 font-serif text-sm font-bold text-[#2C5AA0]">
                        {author.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A202C]">{author.name}</p>
                        {author.bio && (
                          <p className="text-xs text-[#718096] mt-1 leading-relaxed line-clamp-3">{author.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
