import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "./_components/sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { role } = session.user
  if (role !== "LIBRARIAN" && role !== "ADMIN") redirect("/books")

  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      <Sidebar user={session.user} />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
