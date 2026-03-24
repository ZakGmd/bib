// app/books/page.tsx
// This is a SERVER COMPONENT - it can use Prisma!

import { prisma } from '@/lib/prisma'
import { BooksClient } from '../components/books/booksClient'

export default async function BooksPage() {
  // ✅ Fetch books from database on SERVER
  const books = await prisma.book.findMany({
    include: {
      authors: {
        include: {
          author: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      title: 'asc'
    }
  })

  // Transform to simple format for client
  const booksData = books.map(book => ({
    id: book.id,
    title: book.title,
    authors: book.authors.map(ba => ba.author.name),
    category: book.category || "Uncategorized",
    publishedYear: book.publishedYear || null,
    availableCopies: book.availableCopies,
    totalCopies: book.totalCopies,
    coverUrl: book.coverUrl,
    description: book.description
  }))

  // ✅ Pass data to Client Component as props
  return <BooksClient books={booksData} />
}