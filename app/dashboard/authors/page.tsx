import { prisma } from "@/lib/prisma"
import { AuthorsManager } from "./_components/authorsManager"

export default async function DashboardAuthorsPage() {
  const authors = await prisma.author.findMany({
    include: { books: true },
    orderBy: { name: "asc" },
  })

  const data = authors.map((a) => ({
    id: a.id,
    name: a.name,
    bio: a.bio,
    photoUrl: a.photoUrl,
    bookCount: a.books.length,
  }))

  return <AuthorsManager authors={data} />
}
