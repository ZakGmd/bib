import { prisma } from "@/lib/prisma"
import { LoansManager } from "./_components/loansManager"

export default async function LoansPage() {
  const loans = await prisma.loan.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      book: { select: { id: true, title: true, availableCopies: true, totalCopies: true } },
    },
    orderBy: [{ status: "asc" }, { requestDate: "desc" }],
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
    user: loan.user,
    book: loan.book,
  }))

  return <LoansManager loans={data} />
}
