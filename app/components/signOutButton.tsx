"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm font-medium text-[#718096] hover:text-[#C53030] transition-colors duration-150"
    >
      Sign out
    </button>
  )
}
