"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

function canManage(role: string) {
  return role === "LIBRARIAN" || role === "ADMIN"
}

export type AuthorFormData = {
  name: string
  bio: string
  photoUrl: string
}

export async function createAuthor(data: AuthorFormData) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.author.create({
      data: {
        name: data.name,
        bio: data.bio || null,
        photoUrl: data.photoUrl || null,
      },
    })

    revalidatePath("/dashboard/authors")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateAuthor(authorId: string, data: AuthorFormData) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.author.update({
      where: { id: authorId },
      data: {
        name: data.name,
        bio: data.bio || null,
        photoUrl: data.photoUrl || null,
      },
    })

    revalidatePath("/dashboard/authors")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteAuthor(authorId: string) {
  const session = await auth()
  if (!session || !canManage(session.user.role)) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.author.delete({ where: { id: authorId } })
    revalidatePath("/dashboard/authors")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
