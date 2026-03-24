import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { BooksClient } from "../components/books/booksClient"
import { Navbar } from "../components/navbar"

export default async function BooksPage() {
  const session = await auth()

  const [books, activeLoans] = await Promise.all([
    prisma.book.findMany({
      include: {
        authors: { include: { author: true }, orderBy: { order: "asc" } },
      },
      orderBy: { title: "asc" },
    }),
    session
      ? prisma.loan.findMany({
          where: { userId: session.user.id, status: { in: ["PENDING", "APPROVED"] } },
          select: { bookId: true },
        })
      : Promise.resolve([]),
  ])

  const activeLoanBookIds = activeLoans.map((l) => l.bookId)

  const booksData = books.map((book) => ({
    id: book.id,
    title: book.title,
    authors: book.authors.map((ba) => ba.author.name),
    category: book.category || "Uncategorized",
    publishedYear: book.publishedYear ?? null,
    availableCopies: book.availableCopies,
    totalCopies: book.totalCopies,
    coverUrl: book.coverUrl,
    description: book.description,
  }))

  return (
    <>
      <Navbar />
      <BooksClient
        books={booksData}
        isAuthenticated={!!session}
        activeLoanBookIds={activeLoanBookIds}
      />
    </>
  )
}
