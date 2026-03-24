import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Navbar } from "../components/navbar"
import { MyLoansClient } from "./_components/myLoansClient"

export default async function MyLoansPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const loans = await prisma.loan.findMany({
    where: { userId: session.user.id },
    include: {
      book: {
        include: {
          authors: { include: { author: true }, orderBy: { order: "asc" } },
        },
      },
    },
    orderBy: { requestDate: "desc" },
  })

  const data = loans.map((loan) => ({
    id: loan.id,
    status: loan.status as string,
    notes: loan.notes,
    requestDate: loan.requestDate.toISOString(),
    approvedAt: loan.approvedAt?.toISOString() ?? null,
    loanDate: loan.loanDate?.toISOString() ?? null,
    dueDate: loan.dueDate?.toISOString() ?? null,
    returnDate: loan.returnDate?.toISOString() ?? null,
    book: {
      id: loan.book.id,
      title: loan.book.title,
      authors: loan.book.authors.map((ba) => ba.author.name),
      category: loan.book.category,
      coverUrl: loan.book.coverUrl,
    },
  }))

  return (
    <>
      <Navbar />
      <MyLoansClient loans={data} userName={session.user.name} />
    </>
  )
}
