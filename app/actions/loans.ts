"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function canManage(role: string) {
  return role === "LIBRARIAN" || role === "ADMIN"
}

export async function requestLoan(bookId: string) {
  const session = await auth()
  if (!session) return { success: false, error: "Please sign in to request a loan" }

  try {
    const book = await prisma.book.findUnique({ where: { id: bookId } })
    if (!book) throw new Error("Book not found")

    const existing = await prisma.loan.findFirst({
      where: { bookId, userId: session.user.id, status: { in: ["PENDING", "APPROVED"] } },
    })
    if (existing) throw new Error("You already have an active request for this book")

    await prisma.loan.create({
      data: { bookId, userId: session.user.id, status: "PENDING" },
    })

    revalidatePath("/books")
    revalidatePath("/my-loans")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function cancelLoan(loanId: string) {
  const session = await auth()
  if (!session) return { success: false, error: "Unauthorized" }

  try {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } })
    if (!loan) throw new Error("Loan not found")
    if (loan.userId !== session.user.id) throw new Error("Unauthorized")
    if (loan.status !== "PENDING") throw new Error("Only pending loans can be cancelled")

    await prisma.loan.delete({ where: { id: loanId } })

    revalidatePath("/my-loans")
    revalidatePath("/books")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function approveLoan(loanId: string) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({
        where: { id: loanId },
        include: { book: true },
      })
      if (!loan) throw new Error("Loan not found")
      if (loan.status !== "PENDING") throw new Error("Loan is not pending")
      if (loan.book.availableCopies <= 0) throw new Error("No available copies")

      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 14)

      await tx.loan.update({
        where: { id: loanId },
        data: {
          status: "APPROVED",
          approvedBy: session.user.id,
          approvedAt: new Date(),
          loanDate: new Date(),
          dueDate,
        },
      })

      await tx.book.update({
        where: { id: loan.bookId },
        data: { availableCopies: { decrement: 1 } },
      })
    })

    revalidatePath("/dashboard/loans")
    revalidatePath("/books")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function denyLoan(loanId: string) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } })
    if (!loan || loan.status !== "PENDING") throw new Error("Loan not found or not pending")

    await prisma.loan.update({
      where: { id: loanId },
      data: { status: "DENIED" },
    })

    revalidatePath("/dashboard/loans")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function returnLoan(loanId: string) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({ where: { id: loanId } })
      if (!loan) throw new Error("Loan not found")
      if (loan.status !== "APPROVED" && loan.status !== "OVERDUE") {
        throw new Error("Loan is not active")
      }

      await tx.loan.update({
        where: { id: loanId },
        data: { status: "RETURNED", returnDate: new Date() },
      })

      await tx.book.update({
        where: { id: loan.bookId },
        data: { availableCopies: { increment: 1 } },
      })
    })

    revalidatePath("/dashboard/loans")
    revalidatePath("/books")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
