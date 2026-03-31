"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export type ContactFormData = {
  name: string
  email: string
  message: string
}

export async function submitContact(data: ContactFormData) {
  if (!data.name || !data.email || !data.message) {
    return { success: false, error: "All fields are required." }
  }

  try {
    await prisma.contact.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
      },
    })

    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function markAsRead(contactId: string) {
  const session = await auth()
  if (!session || (session.user.role !== "LIBRARIAN")) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.contact.update({
      where: { id: contactId },
      data: { read: true },
    })

    revalidatePath("/dashboard/messages")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteMessage(contactId: string) {
  const session = await auth()
  if (!session || (session.user.role !== "LIBRARIAN")) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await prisma.contact.delete({ where: { id: contactId } })
    revalidatePath("/dashboard/messages")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
