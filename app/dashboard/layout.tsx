import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "./_components/sidebar"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { role } = session.user
  if (role !== "LIBRARIAN") redirect("/books")

  const unreadMessages = await prisma.contact.count({ where: { read: false } })

  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      <Sidebar user={session.user} unreadMessages={unreadMessages} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
