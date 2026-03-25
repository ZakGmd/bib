import { prisma } from "@/lib/prisma"
import { BooksManager } from "./_components/booksManager"

export default async function DashboardBooksPage() {
  const [books, authors] = await Promise.all([
    prisma.book.findMany({
      include: {
        authors: { include: { author: true }, orderBy: { order: "asc" } },
      },
      orderBy: { title: "asc" },
    }),
    prisma.author.findMany({ orderBy: { name: "asc" } }),
  ])
  
   
  const booksData = books.map((b) => ({
    id: b.id,
    title: b.title,
    isbn: b.isbn,
    publisher: b.publisher,
    publishedYear: b.publishedYear,
    category: b.category,
    description: b.description,
    coverUrl: b.coverUrl,
    totalCopies: b.totalCopies,
    availableCopies: b.availableCopies,
    authors: b.authors.map((ba) => ({ id: ba.author.id, name: ba.author.name })),
  }))

  const authorsData = authors.map((a) => ({ id: a.id, name: a.name }))

  return <BooksManager books={booksData} authors={authorsData} />
}
