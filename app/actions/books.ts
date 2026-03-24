"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function canManage(role: string) {
  return role === "LIBRARIAN" || role === "ADMIN"
}

export type BookFormData = {
  title: string
  isbn: string
  publisher: string
  publishedYear: string
  category: string
  description: string
  coverUrl: string
  totalCopies: string
  authorIds: string[]
}

export async function createBook(data: BookFormData) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const copies = parseInt(data.totalCopies) || 1
    const year = data.publishedYear ? parseInt(data.publishedYear) : null

    await prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn || null,
        publisher: data.publisher || null,
        publishedYear: year,
        category: data.category || null,
        description: data.description || null,
        coverUrl: data.coverUrl || null,
        totalCopies: copies,
        availableCopies: copies,
        authors: {
          create: data.authorIds.map((authorId, i) => ({ authorId, order: i + 1 })),
        },
      },
    })

    revalidatePath("/dashboard/books")
    revalidatePath("/books")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateBook(bookId: string, data: BookFormData) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const copies = parseInt(data.totalCopies) || 1
    const year = data.publishedYear ? parseInt(data.publishedYear) : null

    const current = await prisma.book.findUnique({ where: { id: bookId } })
    if (!current) throw new Error("Book not found")

    const copyDiff = copies - current.totalCopies

    await prisma.$transaction(async (tx) => {
      await tx.book.update({
        where: { id: bookId },
        data: {
          title: data.title,
          isbn: data.isbn || null,
          publisher: data.publisher || null,
          publishedYear: year,
          category: data.category || null,
          description: data.description || null,
          coverUrl: data.coverUrl || null,
          totalCopies: copies,
          availableCopies: { increment: copyDiff },
        },
      })
      await tx.bookAuthor.deleteMany({ where: { bookId } })
      for (let i = 0; i < data.authorIds.length; i++) {
        await tx.bookAuthor.create({
          data: { bookId, authorId: data.authorIds[i], order: i + 1 },
        })
      }
    })

    revalidatePath("/dashboard/books")
    revalidatePath("/books")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteBook(bookId: string) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const activeLoans = await prisma.loan.count({
      where: { bookId, status: { in: ["PENDING", "APPROVED"] } },
    })
    if (activeLoans > 0) throw new Error("Cannot delete a book with active loans")

    await prisma.book.delete({ where: { id: bookId } })

    revalidatePath("/dashboard/books")
    revalidatePath("/books")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
