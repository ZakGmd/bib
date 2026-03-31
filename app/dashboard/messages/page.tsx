import { prisma } from "@/lib/prisma"
import { MessagesManager } from "./_components/messagesManager"

export default async function MessagesPage() {
  const messages = await prisma.contact.findMany({
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
  })

  const data = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    message: m.message,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
  }))

  return <MessagesManager messages={data} />
}
